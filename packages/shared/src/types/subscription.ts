export type SubscriptionTier = 'TIER_1' | 'TIER_2' | 'TIER_3';

export type CreatorSubscriptionStatus = 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'PAST_DUE';

export interface CreatorSubscriptionPlan {
  id: string;
  creatorId: string;
  tier: SubscriptionTier;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  benefits: string[];
  badgeId: string | null;
  isActive: boolean;
}

export interface CreatorSubscription {
  id: string;
  subscriberId: string;
  creatorId: string;
  tier: SubscriptionTier;
  price: number;
  currency: string;
  status: CreatorSubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelledAt: string | null;
  renewAutomatically: boolean;
  createdAt: string;
}
