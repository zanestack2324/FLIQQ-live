export interface ReferralCode {
  id: string;
  userId: string;
  code: string;
  totalReferrals: number;
  totalEarnings: number;
  bonusRate: number;
  isActive: boolean;
  createdAt: string;
}

export interface Referral {
  id: string;
  referrerId: string;
  referredId: string;
  referralCodeId: string | null;
  bonusEarned: number;
  status: 'PENDING' | 'QUALIFIED' | 'COMPLETED' | 'REJECTED';
  createdAt: string;
  qualifiedAt: string | null;
  completedAt: string | null;
}
