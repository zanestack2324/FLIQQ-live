-- ============================================================
-- FLIQQ - Supabase Migration (from Prisma Schema)
-- Run this in Supabase SQL Editor
-- ============================================================

-- -------------------- ENUMS --------------------
CREATE TYPE user_role AS ENUM ('USER', 'CREATOR', 'AGENCY', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN');
CREATE TYPE account_status AS ENUM ('ACTIVE', 'SUSPENDED', 'BANNED', 'PENDING_VERIFICATION', 'DEACTIVATED');
CREATE TYPE gender AS ENUM ('MALE', 'FEMALE', 'NON_BINARY', 'PREFER_NOT_TO_SAY');
CREATE TYPE verification_status AS ENUM ('UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED');
CREATE TYPE stream_status AS ENUM ('OFFLINE', 'ONLINE', 'RECORDING', 'RESTREAMING', 'SCHEDULED', 'ENDED');
CREATE TYPE stream_type AS ENUM ('STANDARD', 'MULTI_GUEST', 'PK_BATTLE', 'SCREEN_SHARE', 'PREMIUM');
CREATE TYPE subscription_tier AS ENUM ('TIER_1', 'TIER_2', 'TIER_3');
CREATE TYPE gift_category AS ENUM ('STANDARD', 'PREMIUM', 'EXCLUSIVE', 'SEASONAL');
CREATE TYPE transaction_type AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'GIFT_SENT', 'GIFT_RECEIVED', 'SUBSCRIPTION', 'SUBSCRIPTION_REVENUE', 'REFERRAL_BONUS', 'AGENCY_COMMISSION', 'PENALTY', 'REFUND', 'ADJUSTMENT');
CREATE TYPE transaction_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED');
CREATE TYPE payout_status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');
CREATE TYPE notification_type AS ENUM ('FOLLOW', 'SUBSCRIPTION', 'GIFT', 'STREAM_START', 'STREAM_END', 'COMMENT', 'LIKE', 'RAID', 'WALLET_UPDATE', 'PAYOUT', 'REFERRAL', 'MILESTONE', 'BAN', 'WARNING', 'SYSTEM');
CREATE TYPE report_type AS ENUM ('HARASSMENT', 'NUDITY', 'VIOLENCE', 'HATE_SPEECH', 'SPAM', 'COPYRIGHT', 'IMPERSONATION', 'UNDERAGE', 'SELF_HARM', 'MISINFORMATION', 'OTHER');
CREATE TYPE report_status AS ENUM ('PENDING', 'REVIEWING', 'RESOLVED', 'DISMISSED', 'ACTIONED');
CREATE TYPE appeal_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE moderation_action AS ENUM ('WARNING', 'TIMEOUT', 'MUTE', 'SUSPENSION', 'BAN', 'CONTENT_REMOVAL', 'STREAM_TERMINATION', 'FLAG');
CREATE TYPE media_type AS ENUM ('IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'CLIP', 'VOD', 'STREAM_THUMBNAIL', 'PROFILE_PICTURE', 'BANNER', 'EMOTE', 'BADGE');
CREATE TYPE chat_message_type AS ENUM ('TEXT', 'GIFT', 'SUBSCRIPTION', 'RAID', 'SYSTEM', 'ACTION', 'POLL', 'MEDIA');

-- ==================== USER DOMAIN ====================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  email_verified TIMESTAMPTZ,
  phone TEXT UNIQUE,
  phone_verified BOOLEAN DEFAULT false,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  password_hash TEXT,
  role user_role DEFAULT 'USER',
  status account_status DEFAULT 'ACTIVE',
  gender gender,
  date_of_birth DATE,
  bio TEXT,
  avatar_url TEXT,
  banner_url TEXT,
  language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',
  country TEXT,
  city TEXT,
  last_seen TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ,
  is_online BOOLEAN DEFAULT false,
  is_verified_badge BOOLEAN DEFAULT false,
  is_sensitive BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_is_online ON users(is_online);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Auth trigger (syncs Supabase auth.users → public.users)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username, display_name, role, status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    'USER',
    'ACTIVE'
  );
  INSERT INTO public.wallets (user_id) VALUES (NEW.id);
  INSERT INTO public.user_settings (user_id) VALUES (NEW.id);
  INSERT INTO public.notification_preferences (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INT,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  UNIQUE(provider, provider_account_id)
);
CREATE INDEX idx_accounts_user_id ON accounts(user_id);

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMPTZ NOT NULL
);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);

CREATE TABLE verification_tokens (
  identifier TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  UNIQUE(identifier, token)
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  banner_url TEXT,
  gender gender,
  date_of_birth DATE,
  country TEXT,
  city TEXT,
  website TEXT,
  twitter_handle TEXT,
  instagram_handle TEXT,
  tiktok_handle TEXT,
  youtube_handle TEXT,
  discord_handle TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  is_adult BOOLEAN DEFAULT false,
  is_verified_badge BOOLEAN DEFAULT false,
  verification_status verification_status DEFAULT 'UNVERIFIED',
  follower_count INT DEFAULT 0,
  following_count INT DEFAULT 0,
  subscriber_count INT DEFAULT 0,
  total_streams INT DEFAULT 0,
  total_watch_time BIGINT DEFAULT 0,
  total_followers INT DEFAULT 0,
  total_earnings DECIMAL(12,2) DEFAULT 0,
  level INT DEFAULT 1,
  experience INT DEFAULT 0,
  achievements TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_profiles_follower_count ON profiles(follower_count);
CREATE INDEX idx_profiles_level ON profiles(level);
CREATE INDEX idx_profiles_verification_status ON profiles(verification_status);

CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'system',
  language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  mature_content_filter BOOLEAN DEFAULT true,
  show_online_status BOOLEAN DEFAULT true,
  show_activity BOOLEAN DEFAULT true,
  allow_followers_only BOOLEAN DEFAULT false,
  allow_subscribers_only BOOLEAN DEFAULT false,
  allow_chat BOOLEAN DEFAULT true,
  allow_direct_messages BOOLEAN DEFAULT true,
  allow_gifts BOOLEAN DEFAULT true,
  auto_play BOOLEAN DEFAULT true,
  low_latency_mode BOOLEAN DEFAULT false,
  quality_preference TEXT DEFAULT 'auto',
  subtitle_language TEXT,
  reduced_motion BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE user_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status verification_status DEFAULT 'UNVERIFIED',
  id_document_type TEXT,
  id_document_url TEXT,
  selfie_url TEXT,
  additional_docs TEXT[] DEFAULT '{}',
  submitted_at TIMESTAMPTZ,
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE creator_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stream_key TEXT UNIQUE NOT NULL,
  category TEXT,
  title TEXT,
  tags TEXT[] DEFAULT '{}',
  mature_content BOOLEAN DEFAULT false,
  subscriber_only_chat BOOLEAN DEFAULT false,
  follower_only_chat BOOLEAN DEFAULT false,
  slow_mode BOOLEAN DEFAULT false,
  slow_mode_interval INT DEFAULT 30,
  emote_only_chat BOOLEAN DEFAULT false,
  sub_tier subscription_tier,
  sub_price DECIMAL(6,2),
  sub_description TEXT,
  donation_link TEXT,
  merch_link TEXT,
  auto_record BOOLEAN DEFAULT false,
  save_vods BOOLEAN DEFAULT true,
  allow_clipping BOOLEAN DEFAULT true,
  allow_reuploads BOOLEAN DEFAULT true,
  max_resolution TEXT DEFAULT '1080p',
  max_bitrate INT DEFAULT 6000,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_creator_settings_stream_key ON creator_settings(stream_key);

CREATE TABLE user_moderations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action moderation_action NOT NULL,
  reason TEXT NOT NULL,
  duration INT,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  moderated_by TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  lifted_at TIMESTAMPTZ
);
CREATE INDEX idx_user_moderations_user_id ON user_moderations(user_id);
CREATE INDEX idx_user_moderations_is_active ON user_moderations(is_active);
CREATE INDEX idx_user_moderations_expires_at ON user_moderations(expires_at);

-- ==================== SOCIAL DOMAIN ====================

CREATE TABLE follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(follower_id, following_id)
);
CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_following_id ON follows(following_id);
CREATE INDEX idx_follows_created_at ON follows(created_at);

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tier subscription_tier NOT NULL,
  price DECIMAL(6,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'ACTIVE',
  current_period_start TIMESTAMPTZ DEFAULT now(),
  current_period_end TIMESTAMPTZ NOT NULL,
  cancelled_at TIMESTAMPTZ,
  renew_automatically BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_subscriptions_subscriber_id ON subscriptions(subscriber_id);
CREATE INDEX idx_subscriptions_creator_id ON subscriptions(creator_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_current_period_end ON subscriptions(current_period_end);

CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tier subscription_tier NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(6,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  benefits TEXT[] DEFAULT '{}',
  badge_id TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(creator_id, tier)
);
CREATE INDEX idx_subscription_plans_creator_id ON subscription_plans(creator_id);
CREATE INDEX idx_subscription_plans_is_active ON subscription_plans(is_active);

CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  tier INT DEFAULT 1,
  color TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_badges_category ON badges(category);

CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  UNIQUE(user_id, badge_id)
);
CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);

-- ==================== STREAM DOMAIN ====================

CREATE TABLE stream_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES stream_categories(id),
  is_active BOOLEAN DEFAULT true,
  viewer_count INT DEFAULT 0,
  stream_count INT DEFAULT 0,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_stream_categories_slug ON stream_categories(slug);
CREATE INDEX idx_stream_categories_parent_id ON stream_categories(parent_id);
CREATE INDEX idx_stream_categories_viewer_count ON stream_categories(viewer_count);

CREATE TABLE category_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES stream_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  is_official BOOLEAN DEFAULT false
);
CREATE INDEX idx_category_tags_category_id ON category_tags(category_id);
CREATE INDEX idx_category_tags_name ON category_tags(name);

CREATE TABLE livestreams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES stream_categories(id),
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  thumbnail_url TEXT,
  stream_type stream_type DEFAULT 'STANDARD',
  status stream_status DEFAULT 'OFFLINE',
  status_changed_at TIMESTAMPTZ,
  stream_url TEXT,
  playback_url TEXT,
  rtmp_endpoint TEXT,
  stream_key TEXT,
  language TEXT DEFAULT 'en',
  is_mature BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_emergency BOOLEAN DEFAULT false,
  viewer_count INT DEFAULT 0,
  total_viewers INT DEFAULT 0,
  peak_viewers INT DEFAULT 0,
  follower_count INT DEFAULT 0,
  like_count INT DEFAULT 0,
  share_count INT DEFAULT 0,
  duration INT,
  resolution TEXT,
  bitrate INT,
  fps INT,
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_livestreams_user_id ON livestreams(user_id);
CREATE INDEX idx_livestreams_status ON livestreams(status);
CREATE INDEX idx_livestreams_category_id ON livestreams(category_id);
CREATE INDEX idx_livestreams_viewer_count ON livestreams(viewer_count);
CREATE INDEX idx_livestreams_started_at ON livestreams(started_at);
CREATE INDEX idx_livestreams_scheduled_at ON livestreams(scheduled_at);
CREATE INDEX idx_livestreams_is_featured ON livestreams(is_featured);

CREATE TABLE live_viewers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id UUID NOT NULL REFERENCES livestreams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT now(),
  left_at TIMESTAMPTZ,
  duration INT,
  is_moderator BOOLEAN DEFAULT false,
  is_vip BOOLEAN DEFAULT false,
  ip_address TEXT,
  user_agent TEXT,
  UNIQUE(stream_id, user_id)
);
CREATE INDEX idx_live_viewers_stream_id ON live_viewers(stream_id);
CREATE INDEX idx_live_viewers_user_id ON live_viewers(user_id);
CREATE INDEX idx_live_viewers_joined_at ON live_viewers(joined_at);

CREATE TABLE stream_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id UUID NOT NULL REFERENCES livestreams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_stream_reactions_stream_id ON stream_reactions(stream_id);
CREATE INDEX idx_stream_reactions_user_id ON stream_reactions(user_id);
CREATE INDEX idx_stream_reactions_type ON stream_reactions(type);

CREATE TABLE stream_moderators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id UUID NOT NULL REFERENCES livestreams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'MODERATOR',
  added_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(stream_id, user_id)
);
CREATE INDEX idx_stream_moderators_stream_id ON stream_moderators(stream_id);
CREATE INDEX idx_stream_moderators_user_id ON stream_moderators(user_id);

CREATE TABLE stream_bans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id UUID NOT NULL REFERENCES livestreams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason TEXT,
  banned_by TEXT NOT NULL,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(stream_id, user_id)
);
CREATE INDEX idx_stream_bans_stream_id ON stream_bans(stream_id);
CREATE INDEX idx_stream_bans_user_id ON stream_bans(user_id);

CREATE TABLE guest_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id UUID NOT NULL REFERENCES livestreams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'PENDING',
  joined_at TIMESTAMPTZ,
  left_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(stream_id, user_id)
);
CREATE INDEX idx_guest_sessions_stream_id ON guest_sessions(stream_id);
CREATE INDEX idx_guest_sessions_user_id ON guest_sessions(user_id);

CREATE TABLE pk_battles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_a_id UUID NOT NULL REFERENCES livestreams(id) ON DELETE CASCADE,
  stream_b_id UUID UNIQUE NOT NULL REFERENCES livestreams(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'PENDING',
  duration INT DEFAULT 300,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  winner_id TEXT,
  score_a INT DEFAULT 0,
  score_b INT DEFAULT 0,
  prize_pool DECIMAL(12,2),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_pk_battles_status ON pk_battles(status);
CREATE INDEX idx_pk_battles_stream_a_id ON pk_battles(stream_a_id);
CREATE INDEX idx_pk_battles_stream_b_id ON pk_battles(stream_b_id);

CREATE TABLE raids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_stream_id UUID UNIQUE NOT NULL REFERENCES livestreams(id) ON DELETE CASCADE,
  target_stream_id UUID NOT NULL REFERENCES livestreams(id) ON DELETE CASCADE,
  viewer_count INT NOT NULL,
  status TEXT DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_raids_source_stream_id ON raids(source_stream_id);
CREATE INDEX idx_raids_target_stream_id ON raids(target_stream_id);

CREATE TABLE clips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stream_id UUID NOT NULL REFERENCES livestreams(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INT NOT NULL,
  view_count INT DEFAULT 0,
  like_count INT DEFAULT 0,
  share_count INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_clips_user_id ON clips(user_id);
CREATE INDEX idx_clips_stream_id ON clips(stream_id);
CREATE INDEX idx_clips_view_count ON clips(view_count);
CREATE INDEX idx_clips_created_at ON clips(created_at);

CREATE TABLE vods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stream_id UUID REFERENCES livestreams(id),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INT NOT NULL,
  size BIGINT NOT NULL,
  resolution TEXT,
  bitrate INT,
  fps INT,
  view_count INT DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  is_processing BOOLEAN DEFAULT true,
  processing_progress INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_vods_user_id ON vods(user_id);
CREATE INDEX idx_vods_stream_id ON vods(stream_id);
CREATE INDEX idx_vods_view_count ON vods(view_count);
CREATE INDEX idx_vods_created_at ON vods(created_at);

CREATE TABLE polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id UUID NOT NULL REFERENCES livestreams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  duration INT DEFAULT 60,
  is_active BOOLEAN DEFAULT true,
  is_multiple BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ
);
CREATE INDEX idx_polls_stream_id ON polls(stream_id);

CREATE TABLE poll_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  vote_count INT DEFAULT 0
);
CREATE INDEX idx_poll_options_poll_id ON poll_options(poll_id);

CREATE TABLE poll_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  option_id UUID NOT NULL REFERENCES poll_options(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(poll_id, user_id)
);
CREATE INDEX idx_poll_votes_poll_id ON poll_votes(poll_id);

-- ==================== CHAT DOMAIN ====================

CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id UUID NOT NULL REFERENCES livestreams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type chat_message_type DEFAULT 'TEXT',
  content TEXT NOT NULL,
  gift_id UUID UNIQUE,
  parent_id UUID REFERENCES chat_messages(id),
  is_highlight BOOLEAN DEFAULT false,
  is_system BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_chat_messages_stream_id ON chat_messages(stream_id);
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX idx_chat_messages_type ON chat_messages(type);

CREATE TABLE direct_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_direct_messages_sender_id ON direct_messages(sender_id);
CREATE INDEX idx_direct_messages_receiver_id ON direct_messages(receiver_id);
CREATE INDEX idx_direct_messages_created_at ON direct_messages(created_at);

CREATE TABLE chat_bans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id UUID REFERENCES livestreams(id),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  banned_by TEXT NOT NULL,
  reason TEXT,
  is_global BOOLEAN DEFAULT false,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_chat_bans_user_id ON chat_bans(user_id);
CREATE INDEX idx_chat_bans_stream_id ON chat_bans(stream_id);
CREATE INDEX idx_chat_bans_is_active ON chat_bans(is_active);

CREATE TABLE chat_timeouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id UUID REFERENCES livestreams(id),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  timed_out_by TEXT NOT NULL,
  duration INT NOT NULL,
  reason TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_chat_timeouts_user_id ON chat_timeouts(user_id);
CREATE INDEX idx_chat_timeouts_stream_id ON chat_timeouts(stream_id);
CREATE INDEX idx_chat_timeouts_is_active ON chat_timeouts(is_active);

-- ==================== GIFT & ECONOMY DOMAIN ====================

CREATE TABLE gift_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  animated_url TEXT,
  category gift_category DEFAULT 'STANDARD',
  coin_price DECIMAL(12,2) NOT NULL,
  diamond_value DECIMAL(12,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  streak_bonus BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_gift_catalog_category ON gift_catalog(category);
CREATE INDEX idx_gift_catalog_is_active ON gift_catalog(is_active);
CREATE INDEX idx_gift_catalog_coin_price ON gift_catalog(coin_price);

CREATE TABLE gifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES users(id),
  stream_id UUID REFERENCES livestreams(id),
  gift_catalog_id UUID NOT NULL REFERENCES gift_catalog(id),
  quantity INT DEFAULT 1,
  coin_amount DECIMAL(12,2) NOT NULL,
  diamond_amount DECIMAL(12,2) NOT NULL,
  message TEXT,
  is_animated BOOLEAN DEFAULT false,
  is_highlighted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_gifts_sender_id ON gifts(sender_id);
CREATE INDEX idx_gifts_receiver_id ON gifts(receiver_id);
CREATE INDEX idx_gifts_stream_id ON gifts(stream_id);
CREATE INDEX idx_gifts_created_at ON gifts(created_at);

CREATE TABLE emotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT DEFAULT 'GLOBAL',
  creator_id UUID REFERENCES users(id),
  is_animated BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_emotes_name ON emotes(name);
CREATE INDEX idx_emotes_category ON emotes(category);
CREATE INDEX idx_emotes_creator_id ON emotes(creator_id);

CREATE TABLE user_emote_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  emote_id UUID NOT NULL REFERENCES emotes(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, emote_id)
);
CREATE INDEX idx_user_emote_access_user_id ON user_emote_access(user_id);

CREATE TABLE user_emote_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  max_slots INT DEFAULT 10,
  used_slots INT DEFAULT 0
);

-- ==================== WALLET & TRANSACTION DOMAIN ====================

CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  coin_balance DECIMAL(16,2) DEFAULT 0,
  diamond_balance DECIMAL(16,2) DEFAULT 0,
  bonus_balance DECIMAL(16,2) DEFAULT 0,
  total_earned DECIMAL(16,2) DEFAULT 0,
  total_spent DECIMAL(16,2) DEFAULT 0,
  is_frozen BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_wallets_coin_balance ON wallets(coin_balance);
CREATE INDEX idx_wallets_diamond_balance ON wallets(diamond_balance);

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type transaction_type NOT NULL,
  amount DECIMAL(16,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  coin_amount DECIMAL(16,2),
  diamond_amount DECIMAL(16,2),
  fee DECIMAL(12,2) DEFAULT 0,
  status transaction_status DEFAULT 'PENDING',
  description TEXT,
  reference_id TEXT,
  gift_id TEXT,
  payout_id TEXT,
  subscription_id TEXT,
  agency_member_id TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_transactions_reference_id ON transactions(reference_id);

CREATE TABLE payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  fee DECIMAL(12,2) DEFAULT 0,
  status payout_status DEFAULT 'PENDING',
  payment_method TEXT NOT NULL,
  payment_details JSONB NOT NULL,
  reference_id TEXT,
  processed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_payouts_user_id ON payouts(user_id);
CREATE INDEX idx_payouts_status ON payouts(status);
CREATE INDEX idx_payouts_created_at ON payouts(created_at);

CREATE TABLE coin_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  coin_amount DECIMAL(12,2) NOT NULL,
  bonus_coins DECIMAL(12,2) DEFAULT 0,
  price DECIMAL(8,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  is_popular BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_coin_packages_is_active ON coin_packages(is_active);
CREATE INDEX idx_coin_packages_price ON coin_packages(price);

CREATE TABLE diamond_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  diamond_amount DECIMAL(12,2) NOT NULL,
  bonus_diamonds DECIMAL(12,2) DEFAULT 0,
  price DECIMAL(8,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  conversion_rate DECIMAL(8,4),
  is_popular BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_diamond_packages_is_active ON diamond_packages(is_active);
CREATE INDEX idx_diamond_packages_price ON diamond_packages(price);

-- ==================== AGENCY DOMAIN ====================

CREATE TABLE agencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  country TEXT,
  city TEXT,
  commission_rate DECIMAL(5,2) DEFAULT 10.00,
  status TEXT DEFAULT 'ACTIVE',
  total_earnings DECIMAL(16,2) DEFAULT 0,
  member_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_agencies_name ON agencies(name);
CREATE INDEX idx_agencies_status ON agencies(status);

CREATE TABLE agency_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'CREATOR',
  commission_rate DECIMAL(5,2) DEFAULT 10.00,
  total_earned DECIMAL(16,2) DEFAULT 0,
  joined_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_agency_members_agency_id ON agency_members(agency_id);
CREATE INDEX idx_agency_members_user_id ON agency_members(user_id);

CREATE TABLE agency_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'PENDING',
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(agency_id, user_id)
);
CREATE INDEX idx_agency_invites_agency_id ON agency_invites(agency_id);
CREATE INDEX idx_agency_invites_user_id ON agency_invites(user_id);
CREATE INDEX idx_agency_invites_status ON agency_invites(status);

-- ==================== REFERRAL DOMAIN ====================

CREATE TABLE referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  total_referrals INT DEFAULT 0,
  total_earnings DECIMAL(12,2) DEFAULT 0,
  bonus_rate DECIMAL(5,2) DEFAULT 5.00,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_referral_codes_code ON referral_codes(code);

CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referral_code_id UUID REFERENCES referral_codes(id),
  bonus_earned DECIMAL(12,2) DEFAULT 0,
  status TEXT DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT now(),
  qualified_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);
CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX idx_referrals_referred_id ON referrals(referred_id);
CREATE INDEX idx_referrals_status ON referrals(status);

-- ==================== NOTIFICATION DOMAIN ====================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  data JSONB,
  image_url TEXT,
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
CREATE INDEX idx_notifications_type ON notifications(type);

CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  follow_notifications BOOLEAN DEFAULT true,
  subscription_notif BOOLEAN DEFAULT true,
  gift_notifications BOOLEAN DEFAULT true,
  stream_start_notif BOOLEAN DEFAULT true,
  stream_end_notif BOOLEAN DEFAULT false,
  comment_notifications BOOLEAN DEFAULT true,
  like_notifications BOOLEAN DEFAULT true,
  raid_notifications BOOLEAN DEFAULT true,
  wallet_notifications BOOLEAN DEFAULT true,
  payout_notifications BOOLEAN DEFAULT true,
  referral_notifications BOOLEAN DEFAULT true,
  milestone_notif BOOLEAN DEFAULT true,
  moderation_notif BOOLEAN DEFAULT true,
  system_notifications BOOLEAN DEFAULT true,
  email_digest BOOLEAN DEFAULT false,
  push_enabled BOOLEAN DEFAULT true,
  quiet_hours_start TEXT,
  quiet_hours_end TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ==================== MODERATION DOMAIN ====================

CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reported_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stream_id UUID REFERENCES livestreams(id),
  message_id TEXT,
  type report_type NOT NULL,
  description TEXT,
  evidence_urls TEXT[] DEFAULT '{}',
  status report_status DEFAULT 'PENDING',
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  action_taken moderation_action,
  action_note TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_reports_reporter_id ON reports(reporter_id);
CREATE INDEX idx_reports_reported_id ON reports(reported_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_type ON reports(type);
CREATE INDEX idx_reports_created_at ON reports(created_at);

CREATE TABLE appeals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  report_id UUID REFERENCES reports(id),
  action moderation_action NOT NULL,
  reason TEXT NOT NULL,
  evidence_urls TEXT[] DEFAULT '{}',
  status appeal_status DEFAULT 'PENDING',
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  response_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_appeals_user_id ON appeals(user_id);
CREATE INDEX idx_appeals_status ON appeals(status);
CREATE INDEX idx_appeals_created_at ON appeals(created_at);

CREATE TABLE moderation_action_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  moderator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action moderation_action NOT NULL,
  duration INT,
  reason TEXT NOT NULL,
  evidence_urls TEXT[] DEFAULT '{}',
  is_automated BOOLEAN DEFAULT false,
  automated_rule TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_moderation_action_logs_moderator_id ON moderation_action_logs(moderator_id);
CREATE INDEX idx_moderation_action_logs_target_id ON moderation_action_logs(target_id);
CREATE INDEX idx_moderation_action_logs_action ON moderation_action_logs(action);
CREATE INDEX idx_moderation_action_logs_created_at ON moderation_action_logs(created_at);
CREATE INDEX idx_moderation_action_logs_is_automated ON moderation_action_logs(is_automated);

CREATE TABLE moderation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  pattern TEXT,
  threshold REAL,
  action moderation_action NOT NULL,
  duration INT,
  is_active BOOLEAN DEFAULT true,
  priority INT DEFAULT 0,
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_moderation_rules_type ON moderation_rules(type);
CREATE INDEX idx_moderation_rules_is_active ON moderation_rules(is_active);
CREATE INDEX idx_moderation_rules_priority ON moderation_rules(priority);

CREATE TABLE moderation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id UUID REFERENCES livestreams(id),
  user_id UUID REFERENCES users(id),
  message_id TEXT,
  rule_id TEXT,
  action moderation_action NOT NULL,
  content TEXT,
  confidence REAL,
  is_automated BOOLEAN DEFAULT false,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_moderation_logs_stream_id ON moderation_logs(stream_id);
CREATE INDEX idx_moderation_logs_user_id ON moderation_logs(user_id);
CREATE INDEX idx_moderation_logs_action ON moderation_logs(action);
CREATE INDEX idx_moderation_logs_is_automated ON moderation_logs(is_automated);
CREATE INDEX idx_moderation_logs_created_at ON moderation_logs(created_at);

-- ==================== MEDIA DOMAIN ====================

CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  type media_type NOT NULL,
  mime_type TEXT NOT NULL,
  size BIGINT NOT NULL,
  width INT,
  height INT,
  duration INT,
  is_processing BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT true,
  alt TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_media_user_id ON media(user_id);
CREATE INDEX idx_media_type ON media(type);
CREATE INDEX idx_media_created_at ON media(created_at);

-- ==================== ANALYTICS DOMAIN ====================

CREATE TABLE stream_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_id UUID UNIQUE NOT NULL REFERENCES livestreams(id) ON DELETE CASCADE,
  peak_viewers INT DEFAULT 0,
  average_viewers REAL DEFAULT 0,
  total_viewers INT DEFAULT 0,
  total_followers INT DEFAULT 0,
  total_gifts INT DEFAULT 0,
  gift_revenue DECIMAL(12,2) DEFAULT 0,
  total_subs INT DEFAULT 0,
  sub_revenue DECIMAL(12,2) DEFAULT 0,
  chat_messages INT DEFAULT 0,
  unique_chatters INT DEFAULT 0,
  total_reactions INT DEFAULT 0,
  total_shares INT DEFAULT 0,
  total_reports INT DEFAULT 0,
  avg_watch_time REAL DEFAULT 0,
  buffering_ratio REAL DEFAULT 0,
  bitrate_avg INT DEFAULT 0,
  bitrate_peak INT DEFAULT 0,
  latency_avg INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE creator_daily_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_streams INT DEFAULT 0,
  total_stream_time INT DEFAULT 0,
  peak_viewers INT DEFAULT 0,
  average_viewers REAL DEFAULT 0,
  new_followers INT DEFAULT 0,
  new_subscribers INT DEFAULT 0,
  gift_revenue DECIMAL(12,2) DEFAULT 0,
  sub_revenue DECIMAL(12,2) DEFAULT 0,
  total_earnings DECIMAL(12,2) DEFAULT 0,
  chat_messages INT DEFAULT 0,
  total_reactions INT DEFAULT 0,
  total_shares INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, date)
);
CREATE INDEX idx_creator_daily_analytics_user_id ON creator_daily_analytics(user_id);
CREATE INDEX idx_creator_daily_analytics_date ON creator_daily_analytics(date);

CREATE TABLE creator_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level INT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  min_experience INT DEFAULT 0,
  max_experience INT,
  benefits TEXT[] DEFAULT '{}',
  badge_url TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_creator_levels_level ON creator_levels(level);

-- ==================== ADMIN DOMAIN ====================

CREATE TABLE admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id TEXT NOT NULL,
  action_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  target_type TEXT NOT NULL,
  reason TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_admin_actions_admin_id ON admin_actions(admin_id);
CREATE INDEX idx_admin_actions_action_type ON admin_actions(action_type);
CREATE INDEX idx_admin_actions_target_id ON admin_actions(target_id);
CREATE INDEX idx_admin_actions_created_at ON admin_actions(created_at);

CREATE TABLE admin_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  permissions TEXT[] DEFAULT '{}',
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE admin_role_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  role_id UUID NOT NULL REFERENCES admin_roles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role_id)
);

CREATE TABLE system_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  type TEXT DEFAULT 'string'
);
CREATE INDEX idx_system_configs_key ON system_configs(key);

CREATE TABLE system_health (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service TEXT NOT NULL,
  status TEXT NOT NULL,
  cpu REAL,
  memory REAL,
  uptime INT,
  last_heartbeat TIMESTAMPTZ DEFAULT now(),
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_system_health_service ON system_health(service);
CREATE INDEX idx_system_health_status ON system_health(status);
CREATE INDEX idx_system_health_last_heartbeat ON system_health(last_heartbeat);

-- ==================== DEVICE & SECURITY DOMAIN ====================

CREATE TABLE devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  platform TEXT NOT NULL,
  device_name TEXT,
  device_model TEXT,
  os_version TEXT,
  app_version TEXT,
  push_token TEXT,
  ip_address TEXT,
  last_used_at TIMESTAMPTZ DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, device_id)
);
CREATE INDEX idx_devices_user_id ON devices(user_id);
CREATE INDEX idx_devices_device_id ON devices(device_id);

CREATE TABLE login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  email TEXT,
  ip_address TEXT,
  user_agent TEXT,
  success BOOLEAN NOT NULL,
  fail_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_login_attempts_user_id ON login_attempts(user_id);
CREATE INDEX idx_login_attempts_email ON login_attempts(email);
CREATE INDEX idx_login_attempts_ip_address ON login_attempts(ip_address);
CREATE INDEX idx_login_attempts_created_at ON login_attempts(created_at);

CREATE TABLE security_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_security_questions_user_id ON security_questions(user_id);

CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  key TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scopes TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  last_used TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_api_keys_key ON api_keys(key);
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);

-- ==================== AUDIT & LOGGING DOMAIN ====================

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity);
CREATE INDEX idx_audit_logs_entity_id ON audit_logs(entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- ==================== FEATURE FLAGS ====================

CREATE TABLE feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  is_enabled BOOLEAN DEFAULT false,
  rules JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_feature_flags_name ON feature_flags(name);
CREATE INDEX idx_feature_flags_is_enabled ON feature_flags(is_enabled);

CREATE TABLE feature_flag_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flag_id UUID NOT NULL REFERENCES feature_flags(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  is_enabled BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_feature_flag_overrides_flag_id ON feature_flag_overrides(flag_id);
CREATE INDEX idx_feature_flag_overrides_user_id ON feature_flag_overrides(user_id);

-- ==================== SUPABASE REALTIME ====================

-- Enable Realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE users;
ALTER PUBLICATION supabase_realtime ADD TABLE livestreams;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE gifts;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE follows;
ALTER PUBLICATION supabase_realtime ADD TABLE transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE wallets;

-- ==================== STORAGE BUCKETS ====================

INSERT INTO storage.buckets (id, name, public) VALUES
  ('avatars', 'avatars', true),
  ('verification-documents', 'verification-documents', false),
  ('stream-thumbnails', 'stream-thumbnails', true),
  ('banners', 'banners', true),
  ('media', 'media', false),
  ('emotes', 'emotes', true)
ON CONFLICT (id) DO NOTHING;

-- ==================== ROW LEVEL SECURITY ====================

-- Enable RLS on all user tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE livestreams ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE gifts ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Public profiles are readable" ON users FOR SELECT USING (true);

-- Public streams are readable by all
CREATE POLICY "Streams are publicly readable" ON livestreams FOR SELECT USING (true);
CREATE POLICY "Creators can manage own streams" ON livestreams FOR ALL USING (auth.uid() = user_id);

-- Chat messages are publicly readable for a stream
CREATE POLICY "Chat messages are readable" ON chat_messages FOR SELECT USING (true);
CREATE POLICY "Authenticated users can send chat" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Wallet is private
CREATE POLICY "Users can read own wallet" ON wallets FOR SELECT USING (auth.uid() = user_id);

-- Notifications are private
CREATE POLICY "Users can read own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);

-- Follows
CREATE POLICY "Follows are publicly readable" ON follows FOR SELECT USING (true);
CREATE POLICY "Users can manage own follows" ON follows FOR ALL USING (auth.uid() = follower_id);
