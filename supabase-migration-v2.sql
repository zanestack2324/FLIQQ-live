-- =============================
-- FLIQQ v2: Leaderboard & Challenges
-- Run this AFTER the base migration
-- =============================

-- ----- LEADERBOARD CACHE TABLE -----
CREATE TABLE IF NOT EXISTS leaderboard_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  period TEXT NOT NULL,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(category, period)
);

ALTER TABLE leaderboard_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read leaderboard" ON leaderboard_cache
  FOR SELECT USING (true);

CREATE POLICY "Service role can manage leaderboard" ON leaderboard_cache
  FOR ALL USING (auth.role() = 'service_role');

-- ----- CHALLENGES -----
CREATE TABLE IF NOT EXISTS challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('comedy', 'dance', 'cooking', 'music_battle', 'talent_show', 'custom')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'judging', 'completed', 'cancelled')),
  prize_type TEXT NOT NULL CHECK (prize_type IN ('cash', 'coins', 'diamonds', 'featured_slot', 'badge', 'hybrid')),
  prize_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  prize_currency TEXT NOT NULL DEFAULT 'NGN',
  prize_description TEXT,
  entry_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
  max_participants INT,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  judging_ends_at TIMESTAMPTZ,
  rules TEXT[] DEFAULT '{}',
  banner_url TEXT,
  sponsor_name TEXT,
  sponsor_logo_url TEXT,
  created_by UUID NOT NULL REFERENCES users(id),
  winner_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active challenges" ON challenges
  FOR SELECT USING (status IN ('active', 'judging', 'completed'));

CREATE POLICY "Authenticated users can read all challenges" ON challenges
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage challenges" ON challenges
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- ----- CHALLENGE PARTICIPANTS -----
CREATE TABLE IF NOT EXISTS challenge_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  submission_url TEXT,
  submission_title TEXT,
  votes INT NOT NULL DEFAULT 0,
  rank INT,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  UNIQUE(challenge_id, user_id)
);

ALTER TABLE challenge_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read participants" ON challenge_participants
  FOR SELECT USING (true);

CREATE POLICY "Users can join challenges" ON challenge_participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own submission" ON challenge_participants
  FOR UPDATE USING (auth.uid() = user_id);

-- ----- CHALLENGE VOTES -----
CREATE TABLE IF NOT EXISTS challenge_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES challenge_participants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(challenge_id, user_id)
);

ALTER TABLE challenge_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read votes" ON challenge_votes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can vote once" ON challenge_votes
  FOR INSERT WITH CHECK (auth.uid() = user_id AND auth.role() = 'authenticated');

-- ----- INDEXES -----
CREATE INDEX IF NOT EXISTS idx_challenges_status ON challenges(status);
CREATE INDEX IF NOT EXISTS idx_challenges_type ON challenges(type);
CREATE INDEX IF NOT EXISTS idx_challenges_starts_at ON challenges(starts_at);
CREATE INDEX IF NOT EXISTS idx_challenge_participants_challenge ON challenge_participants(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_participants_user ON challenge_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_participants_votes ON challenge_participants(votes DESC);
CREATE INDEX IF NOT EXISTS idx_challenge_votes_challenge ON challenge_votes(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_votes_user ON challenge_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_cache_category_period ON leaderboard_cache(category, period);

-- ----- HELPER FUNCTION: Compute leaderboard -----
CREATE OR REPLACE FUNCTION compute_leaderboard(p_category TEXT, p_period TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
  since TIMESTAMPTZ;
BEGIN
  since := CASE p_period
    WHEN 'today' THEN CURRENT_DATE
    WHEN 'this_week' THEN DATE_TRUNC('week', CURRENT_DATE)
    WHEN 'this_month' THEN DATE_TRUNC('month', CURRENT_DATE)
    ELSE '1970-01-01'::TIMESTAMPTZ
  END;

  INSERT INTO leaderboard_cache (category, period, data, updated_at)
  VALUES (p_category, p_period, '[]'::JSONB, NOW())
  ON CONFLICT (category, period) DO NOTHING;

  WITH ranked AS (
    SELECT
      u.id AS user_id,
      u.username,
      u.display_name,
      u.avatar_url,
      u.is_verified,
      u.follower_count,
      CASE p_category
        WHEN 'fastest_growing' THEN u.follower_count - COALESCE(
          (SELECT SUM(viewer_count) FROM livestreams WHERE user_id = u.id AND status = 'ended'), 0
        )
        WHEN 'most_viewed' THEN COALESCE(
          (SELECT SUM(viewer_count) FROM livestreams WHERE user_id = u.id), 0
        )
        WHEN 'most_gifted' THEN COALESCE(
          (SELECT COUNT(*) FROM gifts WHERE recipient_id = u.id AND created_at >= since), 0
        )
        WHEN 'top_streamer' THEN COALESCE(
          (SELECT COUNT(*) FROM livestreams WHERE user_id = u.id AND status = 'ended'), 0
        )
        ELSE u.follower_count
      END AS score,
      CASE p_category
        WHEN 'fastest_growing' THEN 'followers gained'
        WHEN 'most_viewed' THEN 'total views'
        WHEN 'most_gifted' THEN 'gifts received'
        WHEN 'top_streamer' THEN 'streams hosted'
        ELSE 'followers'
      END AS metric
    FROM users u
    WHERE u.role IN ('creator', 'admin')
      AND u.account_status = 'active'
    ORDER BY score DESC
    LIMIT 100
  )
  SELECT COALESCE(JSONB_AGG(
    JSONB_BUILD_OBJECT(
      'rank', row_number() OVER (),
      'userId', r.user_id,
      'username', r.username,
      'displayName', r.display_name,
      'avatarUrl', r.avatar_url,
      'score', r.score,
      'metric', r.metric,
      'category', p_category,
      'period', p_period,
      'isVerified', r.is_verified,
      'followerCount', r.follower_count
    )
  ), '[]'::JSONB)
  INTO result
  FROM ranked r;

  UPDATE leaderboard_cache
  SET data = result, updated_at = NOW()
  WHERE category = p_category AND period = p_period;

  RETURN result;
END;
$$;

-- ----- HELPER FUNCTION: Get leaderboard (cached or computed) -----
CREATE OR REPLACE FUNCTION get_leaderboard(p_category TEXT, p_period TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  cached JSONB;
  cache_age INT;
BEGIN
  SELECT data, EXTRACT(EPOCH FROM (NOW() - updated_at))::INT
  INTO cached, cache_age
  FROM leaderboard_cache
  WHERE category = p_category AND period = p_period;

  IF cached IS NOT NULL AND cache_age < 300 THEN
    RETURN cached;
  END IF;

  RETURN compute_leaderboard(p_category, p_period);
END;
$$;

-- ----- CHALLENGE PARTICIPANT COUNT TRIGGER -----
CREATE OR REPLACE FUNCTION update_challenge_participant_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE challenges SET participant_count = (
      SELECT COUNT(*) FROM challenge_participants WHERE challenge_id = NEW.challenge_id
    ) WHERE id = NEW.challenge_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE challenges SET participant_count = (
      SELECT COUNT(*) FROM challenge_participants WHERE challenge_id = OLD.challenge_id
    ) WHERE id = OLD.challenge_id;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_challenge_participant_count ON challenge_participants;
CREATE TRIGGER trg_challenge_participant_count
  AFTER INSERT OR DELETE ON challenge_participants
  FOR EACH ROW EXECUTE FUNCTION update_challenge_participant_count();

-- ----- CHALLENGE VOTE COUNT TRIGGER -----
CREATE OR REPLACE FUNCTION update_participant_vote_count()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE challenge_participants SET votes = (
      SELECT COUNT(*) FROM challenge_votes WHERE participant_id = NEW.participant_id
    ) WHERE id = NEW.participant_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE challenge_participants SET votes = (
      SELECT COUNT(*) FROM challenge_votes WHERE participant_id = OLD.participant_id
    ) WHERE id = OLD.participant_id;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_challenge_vote_count ON challenge_votes;
CREATE TRIGGER trg_challenge_vote_count
  AFTER INSERT OR DELETE ON challenge_votes
  FOR EACH ROW EXECUTE FUNCTION update_participant_vote_count();

-- ----- ADD participant_count COLUMN TO challenges IF NOT EXISTS -----
ALTER TABLE challenges ADD COLUMN IF NOT EXISTS participant_count INT NOT NULL DEFAULT 0;
