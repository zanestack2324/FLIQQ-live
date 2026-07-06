import { User } from './user';

export interface Stream {
  id: string;
  userId: string;
  title: string;
  category: string | null;
  tags: string[];
  thumbnailUrl: string | null;
  isLive: boolean;
  viewerCount: number;
  totalViews: number;
  startedAt: string | null;
  endedAt: string | null;
  user: Pick<User, 'id' | 'username' | 'displayName' | 'avatarUrl'>;
}

export interface StreamCategory {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  viewerCount: number;
  streamCount: number;
}

export interface StreamReaction {
  id: string;
  streamId: string;
  userId: string;
  type: 'like' | 'heart' | 'fire' | 'clap';
  createdAt: string;
}

export interface Clip {
  id: string;
  streamId: string;
  userId: string;
  title: string;
  url: string;
  thumbnailUrl: string | null;
  viewCount: number;
  createdAt: string;
}

export interface Vod {
  id: string;
  streamId: string;
  userId: string;
  title: string;
  url: string;
  thumbnailUrl: string | null;
  duration: number;
  viewCount: number;
  createdAt: string;
}
