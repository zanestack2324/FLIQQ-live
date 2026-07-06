export type LeaderboardCategory =
  | 'fastest_growing'
  | 'top_musician'
  | 'top_comedian'
  | 'best_educator'
  | 'best_food_creator'
  | 'most_gifted'
  | 'most_viewed'
  | 'top_streamer';

export type LeaderboardPeriod = 'all_time' | 'this_month' | 'this_week' | 'today';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  score: number;
  metric: string;
  category: LeaderboardCategory;
  period: LeaderboardPeriod;
  isVerified: boolean;
  followerCount: number;
}

export interface Leaderboard {
  id: string;
  category: LeaderboardCategory;
  period: LeaderboardPeriod;
  entries: LeaderboardEntry[];
  updatedAt: string;
}
