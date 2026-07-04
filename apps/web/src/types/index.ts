export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  isVerified: boolean;
  isLive: boolean;
  followerCount: number;
  followingCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Stream {
  id: string;
  userId: string;
  title: string;
  description?: string;
  thumbnail?: string;
  category: string;
  tags: string[];
  isLive: boolean;
  viewerCount: number;
  maxViewers: number;
  startedAt?: Date;
  endedAt?: Date;
  streamKey: string;
  hlsUrl?: string;
  dashUrl?: string;
  webrtcUrl?: string;
  quality: StreamQuality;
  isRecording: boolean;
  recordingUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
}

export type StreamQuality = 'auto' | '1080p' | '720p' | '480p' | '360p';

export interface ChatMessage {
  id: string;
  streamId: string;
  userId: string;
  content: string;
  type: 'text' | 'emote' | 'system' | 'donation' | 'subscription';
  metadata?: Record<string, unknown>;
  createdAt: Date;
  user?: User;
  replyTo?: ChatMessage;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  color: string;
  streamCount: number;
  viewerCount: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'follow' | 'live' | 'chat' | 'donation' | 'subscription' | 'mention' | 'system';
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: Date;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  totalEarned: number;
  totalSpent: number;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  walletId: string;
  type: 'deposit' | 'withdrawal' | 'tip' | 'subscription' | 'payout' | 'refund';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  creatorId: string;
  tier: SubscriptionTier;
  status: 'active' | 'cancelled' | 'expired' | 'paused';
  startedAt: Date;
  expiresAt?: Date;
  autoRenew: boolean;
}

export type SubscriptionTier = 'tier1' | 'tier2' | 'tier3';

export interface Emote {
  id: string;
  name: string;
  url: string;
  animated: boolean;
  tier: SubscriptionTier | 'global';
  creatorId?: string;
}

export interface StreamSettings {
  streamKey: string;
  rtmpUrl: string;
  hlsUrl: string;
  webrtcUrl?: string;
  qualities: StreamQuality[];
  latency: 'low' | 'normal' | 'high';
  dvrEnabled: boolean;
  chatEnabled: boolean;
  chatFollowersOnly: boolean;
  chatSubscribersOnly: boolean;
  chatSlowMode: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface SearchResult {
  users: User[];
  streams: Stream[];
  categories: Category[];
}

export interface WebRTCSignal {
  type: 'offer' | 'answer' | 'ice-candidate';
  payload: RTCSessionDescriptionInit | RTCIceCandidateInit;
  from: string;
  to: string;
}

export interface PresenceData {
  userId: string;
  username: string;
  avatar?: string;
  role: 'viewer' | 'moderator' | 'broadcaster';
  joinedAt: Date;
}

export type Theme = 'light' | 'dark' | 'system';

export interface AppConfig {
  theme: Theme;
  autoplay: boolean;
  muted: boolean;
  quality: StreamQuality;
  chatEnabled: boolean;
  notificationsEnabled: boolean;
  reducedMotion: boolean;
}