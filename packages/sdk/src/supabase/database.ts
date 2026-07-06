import { supabase } from './client';
import type {
  Stream,
  StreamCategory,
  ChatMessage,
  Gift,
  GiftCatalog,
  Follow,
  Notification,
  Achievement,
  Transaction,
  Wallet,
  DiamondPackage,
  IdentityVerification,
  UserSettings,
  LeaderboardEntry,
  Leaderboard,
  Challenge,
  ChallengeParticipant,
  ChallengeVote,
  CreatorSubscriptionPlan,
  CreatorSubscription,
  ReferralCode,
  Referral,
  PKBattle,
  Raid,
  Poll,
  PollOption,
  Clip,
  Vod,
} from '../../../shared/src/types';

const STREAM_USER_SELECT = '*, user:users(id, username, displayName, avatarUrl)';

// ──────────────────────────────────────────────
// STREAMS
// ──────────────────────────────────────────────

export async function getLiveStreams(): Promise<Stream[]> {
  const { data, error } = await supabase
    .from('streams')
    .select(STREAM_USER_SELECT)
    .eq('isLive', true)
    .order('viewerCount', { ascending: false });
  if (error) throw error;
  return (data as Stream[]) || [];
}

export async function getStreamById(streamId: string): Promise<Stream | null> {
  const { data, error } = await supabase
    .from('streams')
    .select(STREAM_USER_SELECT)
    .eq('id', streamId)
    .maybeSingle();
  if (error) throw error;
  return data as Stream | null;
}

export async function getStreamsByCategory(categorySlug: string): Promise<Stream[]> {
  const { data, error } = await supabase
    .from('streams')
    .select(STREAM_USER_SELECT)
    .eq('isLive', true)
    .eq('category', categorySlug)
    .order('viewerCount', { ascending: false });
  if (error) throw error;
  return (data as Stream[]) || [];
}

export async function getTrendingStreams(): Promise<Stream[]> {
  const { data, error } = await supabase
    .from('streams')
    .select(STREAM_USER_SELECT)
    .eq('isLive', true)
    .order('viewerCount', { ascending: false })
    .limit(10);
  if (error) throw error;
  return (data as Stream[]) || [];
}

export async function getFollowingStreams(userId: string): Promise<Stream[]> {
  const { data: follows, error: followsError } = await supabase
    .from('follows')
    .select('followingId')
    .eq('followerId', userId);
  if (followsError) throw followsError;

  const followingIds = (follows || []).map((f: { followingId: string }) => f.followingId);
  if (followingIds.length === 0) return [];

  const { data, error } = await supabase
    .from('streams')
    .select(STREAM_USER_SELECT)
    .eq('isLive', true)
    .in('userId', followingIds)
    .order('viewerCount', { ascending: false });
  if (error) throw error;
  return (data as Stream[]) || [];
}

export async function getRecommendedStreams(userId: string): Promise<Stream[]> {
  const { data: follows, error: followsError } = await supabase
    .from('follows')
    .select('followingId')
    .eq('followerId', userId);
  if (followsError) throw followsError;

  const followingIds = (follows || []).map((f: { followingId: string }) => f.followingId);

  let query = supabase
    .from('streams')
    .select(STREAM_USER_SELECT)
    .eq('isLive', true);

  if (followingIds.length > 0) {
    query = query.not('userId', 'in', `(${followingIds.join(',')})`);
  }

  const { data, error } = await query.order('viewerCount', { ascending: false });
  if (error) throw error;
  return (data as Stream[]) || [];
}

export async function searchStreams(query: string): Promise<Stream[]> {
  const [titleResult, userResult] = await Promise.all([
    supabase
      .from('streams')
      .select(STREAM_USER_SELECT)
      .ilike('title', `%${query}%`)
      .order('viewerCount', { ascending: false }),
    supabase
      .from('users')
      .select('id, displayName')
      .ilike('displayName', `%${query}%`),
  ]);

  if (titleResult.error) throw titleResult.error;
  if (userResult.error) throw userResult.error;

  const seen = new Set<string>();
  const merged: Stream[] = [];

  for (const s of (titleResult.data as Stream[]) || []) {
    seen.add(s.id);
    merged.push(s);
  }

  const userIds = (userResult.data || []).map((u: { id: string }) => u.id);
  if (userIds.length > 0) {
    const { data: userStreams, error: usErr } = await supabase
      .from('streams')
      .select(STREAM_USER_SELECT)
      .in('userId', userIds)
      .order('viewerCount', { ascending: false });
    if (usErr) throw usErr;
    for (const s of (userStreams as Stream[]) || []) {
      if (!seen.has(s.id)) {
        seen.add(s.id);
        merged.push(s);
      }
    }
  }

  return merged;
}

export async function getUserStreams(userId: string): Promise<Stream[]> {
  const { data, error } = await supabase
    .from('streams')
    .select(STREAM_USER_SELECT)
    .eq('userId', userId)
    .order('startedAt', { ascending: false });
  if (error) throw error;
  return (data as Stream[]) || [];
}

// ──────────────────────────────────────────────
// CATEGORIES
// ──────────────────────────────────────────────

export async function getCategories(): Promise<StreamCategory[]> {
  const { data, error } = await supabase
    .from('stream_categories')
    .select('*')
    .order('name', { ascending: true });
  if (error) throw error;
  return (data as StreamCategory[]) || [];
}

export async function getCategoryBySlug(slug: string): Promise<StreamCategory | null> {
  const { data, error } = await supabase
    .from('stream_categories')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data as StreamCategory | null;
}

// ──────────────────────────────────────────────
// FOLLOWS
// ──────────────────────────────────────────────

export async function followUser(followerId: string, followingId: string): Promise<void> {
  const { error: followError } = await supabase
    .from('follows')
    .insert({ followerId, followingId });
  if (followError) throw followError;

  const [{ data: target }, { data: self }] = await Promise.all([
    supabase.from('users').select('followerCount').eq('id', followingId).single(),
    supabase.from('users').select('followingCount').eq('id', followerId).single(),
  ]);

  const { error: err1 } = await supabase
    .from('users')
    .update({ followerCount: (target?.followerCount ?? 0) + 1 })
    .eq('id', followingId);
  if (err1) throw err1;

  const { error: err2 } = await supabase
    .from('users')
    .update({ followingCount: (self?.followingCount ?? 0) + 1 })
    .eq('id', followerId);
  if (err2) throw err2;
}

export async function unfollowUser(followerId: string, followingId: string): Promise<void> {
  const { error: deleteError } = await supabase
    .from('follows')
    .delete()
    .eq('followerId', followerId)
    .eq('followingId', followingId);
  if (deleteError) throw deleteError;

  const [{ data: target }, { data: self }] = await Promise.all([
    supabase.from('users').select('followerCount').eq('id', followingId).single(),
    supabase.from('users').select('followingCount').eq('id', followerId).single(),
  ]);

  const { error: err1 } = await supabase
    .from('users')
    .update({ followerCount: Math.max(0, (target?.followerCount ?? 0) - 1) })
    .eq('id', followingId);
  if (err1) throw err1;

  const { error: err2 } = await supabase
    .from('users')
    .update({ followingCount: Math.max(0, (self?.followingCount ?? 0) - 1) })
    .eq('id', followerId);
  if (err2) throw err2;
}

export async function isFollowing(followerId: string, followingId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('follows')
    .select('id')
    .eq('followerId', followerId)
    .eq('followingId', followingId)
    .maybeSingle();
  if (error) throw error;
  return data !== null;
}

const FOLLOW_USER_JOIN =
  '*, follower:users!followerId(id, username, displayName, avatarUrl), following:users!followingId(id, username, displayName, avatarUrl)';

export async function getFollowers(userId: string): Promise<Follow[]> {
  const { data, error } = await supabase
    .from('follows')
    .select(FOLLOW_USER_JOIN)
    .eq('followingId', userId)
    .order('createdAt', { ascending: false });
  if (error) throw error;
  return (data as Follow[]) || [];
}

export async function getFollowing(userId: string): Promise<Follow[]> {
  const { data, error } = await supabase
    .from('follows')
    .select(FOLLOW_USER_JOIN)
    .eq('followerId', userId)
    .order('createdAt', { ascending: false });
  if (error) throw error;
  return (data as Follow[]) || [];
}

// ──────────────────────────────────────────────
// CHAT
// ──────────────────────────────────────────────

export async function getChatMessages(streamId: string, limit = 200): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*, user:users(id, username, displayName, avatarUrl)')
    .eq('streamId', streamId)
    .order('createdAt', { ascending: true })
    .limit(limit);
  if (error) throw error;
  return (data as ChatMessage[]) || [];
}

export async function sendChatMessage(streamId: string, userId: string, message: string): Promise<void> {
  const { error } = await supabase.from('chat_messages').insert({
    streamId,
    userId,
    message,
    isMod: false,
    isSubscriber: false,
  });
  if (error) throw error;
}

// ──────────────────────────────────────────────
// GIFTS
// ──────────────────────────────────────────────

export async function getGiftCatalog(): Promise<GiftCatalog[]> {
  const { data, error } = await supabase
    .from('gift_catalog')
    .select('*')
    .order('diamondCost', { ascending: true });
  if (error) throw error;
  return (data as GiftCatalog[]) || [];
}

export async function sendGift(
  senderId: string,
  receiverId: string,
  streamId: string | null,
  giftType: string,
  diamondAmount: number,
  message?: string,
): Promise<void> {
  const { error: giftError } = await supabase.from('gifts').insert({
    senderId,
    receiverId,
    streamId,
    giftType,
    diamondAmount,
    message: message ?? null,
  });
  if (giftError) throw giftError;

  const { data: wallet } = await supabase
    .from('wallets')
    .select('id, diamondBalance, lifetimeSpent')
    .eq('userId', senderId)
    .single();

  if (wallet) {
    const { error: walletError } = await supabase
      .from('wallets')
      .update({
        diamondBalance: Math.max(0, wallet.diamondBalance - diamondAmount),
        lifetimeSpent: wallet.lifetimeSpent + diamondAmount,
      })
      .eq('userId', senderId);
    if (walletError) throw walletError;
  }

  const { error: notifError } = await supabase.from('notifications').insert({
    userId: receiverId,
    type: 'gift',
    title: 'New Gift',
    body: `You received a ${giftType} gift!`,
    data: { senderId, giftType, diamondAmount: String(diamondAmount) },
    read: false,
  });
  if (notifError) throw notifError;
}

export async function getReceivedGifts(userId: string): Promise<Gift[]> {
  const { data, error } = await supabase
    .from('gifts')
    .select(
      '*, sender:users!senderId(id, username, displayName, avatarUrl), receiver:users!receiverId(id, username, displayName, avatarUrl)',
    )
    .eq('receiverId', userId)
    .order('createdAt', { ascending: false });
  if (error) throw error;
  return (data as Gift[]) || [];
}

// ──────────────────────────────────────────────
// WALLET
// ──────────────────────────────────────────────

export async function getWallet(userId: string): Promise<Wallet | null> {
  const { data, error } = await supabase
    .from('wallets')
    .select('*')
    .eq('userId', userId)
    .maybeSingle();
  if (error) throw error;
  return data as Wallet | null;
}

export async function getTransactions(userId: string): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('userId', userId)
    .order('createdAt', { ascending: false });
  if (error) throw error;
  return (data as Transaction[]) || [];
}

export async function getDiamondPackages(): Promise<DiamondPackage[]> {
  const { data, error } = await supabase
    .from('diamond_packages')
    .select('*')
    .order('price', { ascending: true });
  if (error) throw error;
  return (data as DiamondPackage[]) || [];
}

export async function diamondPurchase(
  userId: string,
  packageId: string,
  paymentProvider: 'stripe' | 'revenuecat',
  paymentId: string,
): Promise<void> {
  const { data: pkg, error: pkgError } = await supabase
    .from('diamond_packages')
    .select('*')
    .eq('id', packageId)
    .single();
  if (pkgError) throw pkgError;
  if (!pkg) throw new Error('Diamond package not found');

  const totalDiamonds = pkg.diamondAmount + pkg.bonusAmount;

  const { data: wallet } = await supabase
    .from('wallets')
    .select('id, diamondBalance, lifetimeSpent')
    .eq('userId', userId)
    .single();

  if (!wallet) throw new Error('Wallet not found');

  const { error: walletError } = await supabase
    .from('wallets')
    .update({
      diamondBalance: wallet.diamondBalance + totalDiamonds,
      lifetimeSpent: wallet.lifetimeSpent + pkg.price,
    })
    .eq('userId', userId);
  if (walletError) throw walletError;

  const { error: txError } = await supabase.from('transactions').insert({
    walletId: wallet.id,
    userId,
    type: 'purchase',
    amount: pkg.price,
    currency: pkg.currency,
    diamondAmount: totalDiamonds,
    status: 'completed',
    referenceType: paymentProvider,
    referenceId: paymentId,
    description: `Purchased ${pkg.name}`,
  });
  if (txError) throw txError;
}

export async function requestPayout(
  userId: string,
  amount: number,
  diamondAmount: number,
  method: string,
  accountDetails: Record<string, string>,
): Promise<void> {
  const { error: payoutError } = await supabase.from('payouts').insert({
    userId,
    amount,
    currency: 'USD',
    diamondAmount,
    method,
    status: 'pending',
    accountDetails,
    fee: 0,
    netAmount: amount,
  });
  if (payoutError) throw payoutError;
}

// ──────────────────────────────────────────────
// NOTIFICATIONS
// ──────────────────────────────────────────────

export async function getNotifications(userId: string): Promise<Notification[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('userId', userId)
    .order('createdAt', { ascending: false });
  if (error) throw error;
  return (data as Notification[]) || [];
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId);
  if (error) throw error;
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('userId', userId)
    .eq('read', false);
  if (error) throw error;
}

// ──────────────────────────────────────────────
// USER SETTINGS
// ──────────────────────────────────────────────

export async function getUserSettings(userId: string): Promise<UserSettings | null> {
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('userId', userId)
    .maybeSingle();
  if (error) throw error;
  return data as UserSettings | null;
}

export async function updateUserSettings(userId: string, settings: Partial<UserSettings>): Promise<void> {
  const { error } = await supabase
    .from('user_settings')
    .update(settings)
    .eq('userId', userId);
  if (error) throw error;
}

// ──────────────────────────────────────────────
// ACHIEVEMENTS
// ──────────────────────────────────────────────

export async function getAchievements(userId: string): Promise<Achievement[]> {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('userId', userId)
    .order('earnedAt', { ascending: false });
  if (error) throw error;
  return (data as Achievement[]) || [];
}

// ──────────────────────────────────────────────
// VERIFICATION
// ──────────────────────────────────────────────

export async function getVerificationStatus(userId: string): Promise<IdentityVerification | null> {
  const { data, error } = await supabase
    .from('identity_verifications')
    .select('*')
    .eq('userId', userId)
    .order('createdAt', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data as IdentityVerification | null;
}

export async function submitVerification(
  userId: string,
  documentType: string,
  documentUrl: string,
  selfieUrl?: string,
): Promise<void> {
  const { error } = await supabase.from('identity_verifications').insert({
    userId,
    documentType,
    documentUrl,
    selfieUrl: selfieUrl ?? null,
    status: 'pending',
  });
  if (error) throw error;
}

// ──────────────────────────────────────────────
// ANALYTICS
// ──────────────────────────────────────────────

export async function getCreatorAnalytics(
  userId: string,
  days = 30,
): Promise<{
  totalViews: number;
  totalFollowers: number;
  totalDiamonds: number;
  avgWatchTime: number;
  earningsMonth: number;
  pendingPayout: number;
}> {
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceISO = since.toISOString();

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).toISOString();

  const [
    { data: streams },
    { data: user },
    { data: gifts },
    { data: monthTxs },
    { data: payouts },
  ] = await Promise.all([
    supabase
      .from('streams')
      .select('totalViews')
      .eq('userId', userId)
      .gte('startedAt', sinceISO),
    supabase
      .from('users')
      .select('followerCount')
      .eq('id', userId)
      .single(),
    supabase
      .from('gifts')
      .select('diamondAmount')
      .eq('receiverId', userId),
    supabase
      .from('transactions')
      .select('amount')
      .eq('userId', userId)
      .eq('type', 'tip')
      .gte('createdAt', monthStart)
      .lte('createdAt', monthEnd),
    supabase
      .from('payouts')
      .select('amount')
      .eq('userId', userId)
      .eq('status', 'pending'),
  ]);

  const totalViews = (streams || []).reduce((sum: number, s: { totalViews: number }) => sum + (s.totalViews || 0), 0);
  const totalFollowers = (user as { followerCount?: number } | null)?.followerCount ?? 0;
  const totalDiamonds = (gifts || []).reduce((sum: number, g: { diamondAmount: number }) => sum + (g.diamondAmount || 0), 0);
  const earningsMonth = (monthTxs || []).reduce((sum: number, t: { amount: number }) => sum + (t.amount || 0), 0);
  const pendingPayout = (payouts || []).reduce((sum: number, p: { amount: number }) => sum + (p.amount || 0), 0);

  return {
    totalViews,
    totalFollowers,
    totalDiamonds,
    avgWatchTime: 0,
    earningsMonth,
    pendingPayout,
  };
}

export async function getRecentStreams(userId: string, limit = 5): Promise<Stream[]> {
  const { data, error } = await supabase
    .from('streams')
    .select(STREAM_USER_SELECT)
    .eq('userId', userId)
    .order('startedAt', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data as Stream[]) || [];
}

// ──────────────────────────────────────────────
// LEADERBOARD
// ──────────────────────────────────────────────

export async function getLeaderboard(
  category: string,
  period: string,
): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase
    .rpc('get_leaderboard', { p_category: category, p_period: period });
  if (error) throw error;
  return (data as LeaderboardEntry[]) || [];
}

export async function computeLeaderboard(
  category: string,
  period: string,
): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase
    .rpc('compute_leaderboard', { p_category: category, p_period: period });
  if (error) throw error;
  return (data as LeaderboardEntry[]) || [];
}

// ──────────────────────────────────────────────
// CHALLENGES
// ──────────────────────────────────────────────

export async function getChallenges(options?: {
  status?: string;
  type?: string;
  limit?: number;
}): Promise<Challenge[]> {
  let query = supabase
    .from('challenges')
    .select('*')
    .order('startsAt', { ascending: false });

  if (options?.status) {
    query = query.eq('status', options.status);
  }
  if (options?.type) {
    query = query.eq('type', options.type);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data as Challenge[]) || [];
}

export async function getChallengeById(challengeId: string): Promise<Challenge | null> {
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .eq('id', challengeId)
    .maybeSingle();
  if (error) throw error;
  return data as Challenge | null;
}

export async function getChallengeParticipants(challengeId: string): Promise<ChallengeParticipant[]> {
  const { data, error } = await supabase
    .from('challenge_participants')
    .select('*')
    .eq('challengeId', challengeId)
    .order('votes', { ascending: false });
  if (error) throw error;
  return (data as ChallengeParticipant[]) || [];
}

export async function joinChallenge(challengeId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('challenge_participants')
    .insert({ challengeId, userId });
  if (error) throw error;
}

export async function submitChallengeEntry(
  participantId: string,
  submissionUrl: string,
  submissionTitle: string,
): Promise<void> {
  const { error } = await supabase
    .from('challenge_participants')
    .update({ submissionUrl, submissionTitle, submittedAt: new Date().toISOString() })
    .eq('id', participantId);
  if (error) throw error;
}

export async function voteChallenge(
  challengeId: string,
  participantId: string,
  userId: string,
): Promise<void> {
  const { error } = await supabase
    .from('challenge_votes')
    .insert({ challengeId, participantId, userId });
  if (error) throw error;
}

export async function hasVoted(challengeId: string, userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('challenge_votes')
    .select('id')
    .eq('challengeId', challengeId)
    .eq('userId', userId)
    .maybeSingle();
  if (error) throw error;
  return data !== null;
}

export async function getMyChallenges(userId: string): Promise<ChallengeParticipant[]> {
  const { data, error } = await supabase
    .from('challenge_participants')
    .select('*, challenge:challenges(*)')
    .eq('userId', userId)
    .order('joinedAt', { ascending: false });
  if (error) throw error;
  return (data as ChallengeParticipant[]) || [];
}

export async function getActiveChallenges(): Promise<Challenge[]> {
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .eq('status', 'active')
    .order('endsAt', { ascending: true });
  if (error) throw error;
  return (data as Challenge[]) || [];
}

// ──────────────────────────────────────────────
// SUBSCRIPTIONS (Creator Subscriptions)
// ──────────────────────────────────────────────

export async function getCreatorSubscriptionPlans(creatorId: string): Promise<CreatorSubscriptionPlan[]> {
  const { data, error } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('creatorId', creatorId)
    .eq('isActive', true)
    .order('price', { ascending: true });
  if (error) throw error;
  return (data as CreatorSubscriptionPlan[]) || [];
}

export async function subscribeToCreator(
  subscriberId: string,
  creatorId: string,
  tier: string,
  price: number,
  currency: string,
  currentPeriodEnd: string,
): Promise<void> {
  const { error } = await supabase.from('subscriptions').insert({
    subscriberId,
    creatorId,
    tier,
    price,
    currency,
    currentPeriodEnd,
    status: 'ACTIVE',
  });
  if (error) throw error;
}

export async function getCreatorSubscriptions(creatorId: string): Promise<CreatorSubscription[]> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('creatorId', creatorId)
    .order('createdAt', { ascending: false });
  if (error) throw error;
  return (data as CreatorSubscription[]) || [];
}

export async function getMySubscriptions(userId: string): Promise<CreatorSubscription[]> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*, creator:users!creatorId(id, username, displayName, avatarUrl)')
    .eq('subscriberId', userId)
    .order('createdAt', { ascending: false });
  if (error) throw error;
  return (data as CreatorSubscription[]) || [];
}

export async function cancelSubscription(subscriptionId: string): Promise<void> {
  const { error } = await supabase
    .from('subscriptions')
    .update({ status: 'CANCELLED', cancelledAt: new Date().toISOString(), renewAutomatically: false })
    .eq('id', subscriptionId);
  if (error) throw error;
}

// ──────────────────────────────────────────────
// REFERRAL SYSTEM
// ──────────────────────────────────────────────

export async function getReferralCode(userId: string): Promise<ReferralCode | null> {
  const { data, error } = await supabase
    .from('referral_codes')
    .select('*')
    .eq('userId', userId)
    .maybeSingle();
  if (error) throw error;
  return data as ReferralCode | null;
}

export async function generateReferralCode(userId: string): Promise<ReferralCode> {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  const { data, error } = await supabase
    .from('referral_codes')
    .insert({ userId, code })
    .select()
    .single();
  if (error) throw error;
  return data as ReferralCode;
}

export async function getReferralByCode(code: string): Promise<ReferralCode | null> {
  const { data, error } = await supabase
    .from('referral_codes')
    .select('*')
    .eq('code', code)
    .eq('isActive', true)
    .maybeSingle();
  if (error) throw error;
  return data as ReferralCode | null;
}

export async function createReferral(referrerId: string, referredId: string, referralCodeId: string): Promise<void> {
  const { error } = await supabase.from('referrals').insert({
    referrerId, referredId, referralCodeId,
  });
  if (error) throw error;
}

export async function getMyReferrals(userId: string): Promise<Referral[]> {
  const { data, error } = await supabase
    .from('referrals')
    .select('*, referred:users!referredId(id, username, displayName, avatarUrl)')
    .eq('referrerId', userId)
    .order('createdAt', { ascending: false });
  if (error) throw error;
  return (data as Referral[]) || [];
}

// ──────────────────────────────────────────────
// PK BATTLES & RAIDS
// ──────────────────────────────────────────────

export async function getActivePKBattles(): Promise<PKBattle[]> {
  const { data, error } = await supabase
    .from('pk_battles')
    .select('*, streamA:livestreams!stream_a_id(*), streamB:livestreams!stream_b_id(*)')
    .in('status', ['PENDING', 'ACCEPTED', 'ACTIVE'])
    .order('createdAt', { ascending: false });
  if (error) throw error;
  return (data as PKBattle[]) || [];
}

export async function createPKBattle(streamAId: string, streamBId: string, duration = 300): Promise<void> {
  const { error } = await supabase.from('pk_battles').insert({
    streamAId, streamBId, duration,
  });
  if (error) throw error;
}

export async function updatePKBattleScore(battleId: string, streamA: 'a' | 'b', score: number): Promise<void> {
  const field = streamA === 'a' ? 'scoreA' : 'scoreB';
  const { error } = await supabase
    .from('pk_battles')
    .update({ [field]: score })
    .eq('id', battleId);
  if (error) throw error;
}

export async function endPKBattle(battleId: string, winnerId: string): Promise<void> {
  const { error } = await supabase
    .from('pk_battles')
    .update({ status: 'COMPLETED', winnerId, endedAt: new Date().toISOString() })
    .eq('id', battleId);
  if (error) throw error;
}

export async function createRaid(sourceStreamId: string, targetStreamId: string, viewerCount: number): Promise<void> {
  const { error } = await supabase.from('raids').insert({
    sourceStreamId, targetStreamId, viewerCount,
  });
  if (error) throw error;
}

export async function getActiveRaids(streamId: string): Promise<Raid[]> {
  const { data, error } = await supabase
    .from('raids')
    .select('*')
    .eq('targetStreamId', streamId)
    .eq('status', 'PENDING')
    .order('createdAt', { ascending: false });
  if (error) throw error;
  return (data as Raid[]) || [];
}

// ──────────────────────────────────────────────
// POLLS
// ──────────────────────────────────────────────

export async function getStreamPolls(streamId: string): Promise<Poll[]> {
  const { data, error } = await supabase
    .from('polls')
    .select('*, options:poll_options(*)')
    .eq('streamId', streamId)
    .order('createdAt', { ascending: false });
  if (error) throw error;
  return (data as Poll[]) || [];
}

export async function createPoll(
  streamId: string,
  userId: string,
  question: string,
  options: string[],
  duration = 60,
  isMultiple = false,
): Promise<Poll> {
  const { data: poll, error: pollError } = await supabase
    .from('polls')
    .insert({ streamId, userId, question, duration, isMultiple })
    .select()
    .single();
  if (pollError) throw pollError;

  const pollOptions = options.map(label => ({ pollId: poll.id, label }));
  const { error: optError } = await supabase.from('poll_options').insert(pollOptions);
  if (optError) throw optError;

  return poll as Poll;
}

export async function votePoll(optionId: string, pollId: string, userId: string): Promise<void> {
  const { error } = await supabase.from('poll_votes').insert({ optionId, pollId, userId });
  if (error) throw error;
}

export async function hasVotedPoll(pollId: string, userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('poll_votes')
    .select('id')
    .eq('pollId', pollId)
    .eq('userId', userId)
    .maybeSingle();
  if (error) throw error;
  return data !== null;
}

export async function endPoll(pollId: string): Promise<void> {
  const { error } = await supabase
    .from('polls')
    .update({ isActive: false, endedAt: new Date().toISOString() })
    .eq('id', pollId);
  if (error) throw error;
}

// ──────────────────────────────────────────────
// CLIPS & VODS
// ──────────────────────────────────────────────

export async function getUserClips(userId: string): Promise<Clip[]> {
  const { data, error } = await supabase
    .from('clips')
    .select('*')
    .eq('userId', userId)
    .order('createdAt', { ascending: false });
  if (error) throw error;
  return (data as Clip[]) || [];
}

export async function getStreamClips(streamId: string): Promise<Clip[]> {
  const { data, error } = await supabase
    .from('clips')
    .select('*')
    .eq('streamId', streamId)
    .order('createdAt', { ascending: false });
  if (error) throw error;
  return (data as Clip[]) || [];
}

export async function createClip(
  userId: string,
  streamId: string,
  title: string,
  fileUrl: string,
  duration: number,
  thumbnailUrl?: string,
): Promise<void> {
  const { error } = await supabase.from('clips').insert({
    userId, streamId, title, fileUrl, duration, thumbnailUrl: thumbnailUrl ?? null,
  });
  if (error) throw error;
}

export async function getUserVods(userId: string): Promise<Vod[]> {
  const { data, error } = await supabase
    .from('vods')
    .select('*')
    .eq('userId', userId)
    .eq('isPublished', true)
    .order('createdAt', { ascending: false });
  if (error) throw error;
  return (data as Vod[]) || [];
}

export async function getStreamVods(streamId: string): Promise<Vod[]> {
  const { data, error } = await supabase
    .from('vods')
    .select('*')
    .eq('streamId', streamId)
    .eq('isPublished', true)
    .order('createdAt', { ascending: false });
  if (error) throw error;
  return (data as Vod[]) || [];
}

export async function incrementClipViewCount(clipId: string): Promise<void> {
  const { error } = await supabase.rpc('increment_clip_view_count', { clip_id: clipId });
  if (error) throw error;
}

export async function incrementVodViewCount(vodId: string): Promise<void> {
  const { error } = await supabase.rpc('increment_vod_view_count', { vod_id: vodId });
  if (error) throw error;
}



