export type ChallengeType =
  | 'comedy'
  | 'dance'
  | 'cooking'
  | 'music_battle'
  | 'talent_show'
  | 'custom';

export type ChallengeStatus = 'draft' | 'active' | 'judging' | 'completed' | 'cancelled';

export type ChallengePrizeType = 'cash' | 'coins' | 'diamonds' | 'featured_slot' | 'badge' | 'hybrid';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  status: ChallengeStatus;
  prizeType: ChallengePrizeType;
  prizeAmount: number;
  prizeCurrency: string;
  prizeDescription: string | null;
  entryFee: number;
  maxParticipants: number | null;
  startsAt: string;
  endsAt: string;
  judgingEndsAt: string | null;
  rules: string[];
  bannerUrl: string | null;
  sponsorName: string | null;
  sponsorLogoUrl: string | null;
  createdBy: string;
  winnerId: string | null;
  createdAt: string;
  participantCount: number;
}

export interface ChallengeParticipant {
  id: string;
  challengeId: string;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  submissionUrl: string | null;
  submissionTitle: string | null;
  votes: number;
  rank: number | null;
  joinedAt: string;
  submittedAt: string | null;
}

export interface ChallengeVote {
  id: string;
  challengeId: string;
  participantId: string;
  userId: string;
  createdAt: string;
}
