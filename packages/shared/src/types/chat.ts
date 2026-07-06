import { User } from './user';

export interface ChatMessage {
  id: string;
  streamId: string;
  userId: string;
  message: string;
  isMod: boolean;
  isSubscriber: boolean;
  createdAt: string;
  user: Pick<User, 'id' | 'username' | 'displayName' | 'avatarUrl'>;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Gift {
  id: string;
  senderId: string;
  receiverId: string;
  streamId: string | null;
  giftType: string;
  diamondAmount: number;
  message: string | null;
  createdAt: string;
  sender: Pick<User, 'id' | 'username' | 'displayName' | 'avatarUrl'>;
  receiver: Pick<User, 'id' | 'username' | 'displayName' | 'avatarUrl'>;
}

export interface GiftCatalog {
  id: string;
  name: string;
  icon: string;
  diamondCost: number;
  animation: string | null;
  category: 'simple' | 'premium' | 'luxury';
}
