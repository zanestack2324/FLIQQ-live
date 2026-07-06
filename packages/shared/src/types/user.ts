export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  role: 'user' | 'creator' | 'admin';
  accountStatus: 'active' | 'suspended' | 'banned';
  isVerified: boolean;
  followerCount: number;
  followingCount: number;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  coverUrl: string | null;
  location: string | null;
  website: string | null;
  socialLinks: Record<string, string>;
  isVerifiedBadge: boolean;
}

export interface UserSettings {
  id: string;
  userId: string;
  pushEnabled: boolean;
  emailEnabled: boolean;
  liveStart: boolean;
  newFollower: boolean;
  giftReceived: boolean;
  chatMention: boolean;
  streamReminder: boolean;
  weeklyDigest: boolean;
  marketing: boolean;
}

export interface CreatorSettings {
  id: string;
  userId: string;
  streamTitle: string;
  streamCategory: string | null;
  streamTags: string[];
  chatSlowMode: number;
  chatSubOnly: boolean;
  enableGifts: boolean;
  enableReactions: boolean;
  autoMod: boolean;
  allowedGenders: string[];
  minFollowerAge: number;
  minAccountAge: number;
}
