import { User } from './user';

export interface Notification {
  id: string;
  userId: string;
  type: 'follow' | 'gift' | 'tip' | 'stream_start' | 'achievement' | 'mention' | 'system' | 'verification' | 'payout';
  title: string;
  body: string;
  data: Record<string, string> | null;
  read: boolean;
  createdAt: string;
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
  follower: Pick<User, 'id' | 'username' | 'displayName' | 'avatarUrl'>;
  following: Pick<User, 'id' | 'username' | 'displayName' | 'avatarUrl'>;
}

export interface Achievement {
  id: string;
  userId: string;
  badgeType: string;
  badgeName: string;
  badgeIcon: string;
  earnedAt: string;
}
