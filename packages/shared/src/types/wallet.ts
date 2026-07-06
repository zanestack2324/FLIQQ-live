export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  diamondBalance: number;
  lifetimeEarnings: number;
  lifetimeSpent: number;
}

export interface Transaction {
  id: string;
  walletId: string;
  userId: string;
  type: 'purchase' | 'tip' | 'withdraw' | 'reward' | 'refund';
  amount: number;
  currency: string;
  diamondAmount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  referenceType: string | null;
  referenceId: string | null;
  description: string | null;
  createdAt: string;
}

export interface DiamondPackage {
  id: string;
  name: string;
  diamondAmount: number;
  bonusAmount: number;
  price: number;
  currency: string;
  stripePriceId: string | null;
  revenueCatProductId: string | null;
  isPopular: boolean;
}

export interface Payout {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  diamondAmount: number;
  method: 'paypal' | 'bank_transfer' | 'crypto';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  accountDetails: Record<string, string>;
  fee: number;
  netAmount: number;
  createdAt: string;
  completedAt: string | null;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  revenueCatProductId: string;
  features: string[];
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'expired' | 'past_due';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  revenueCatEntitlement: string;
  autoRenew: boolean;
}
