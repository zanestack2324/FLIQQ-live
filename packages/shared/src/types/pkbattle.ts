export type PKBattleStatus = 'PENDING' | 'ACCEPTED' | 'ACTIVE' | 'COMPLETED' | 'DECLINED' | 'CANCELLED';

export interface PKBattle {
  id: string;
  streamAId: string;
  streamBId: string;
  status: PKBattleStatus;
  duration: number;
  startedAt: string | null;
  endedAt: string | null;
  winnerId: string | null;
  scoreA: number;
  scoreB: number;
  prizePool: number | null;
  createdAt: string;
}

export interface Raid {
  id: string;
  sourceStreamId: string;
  targetStreamId: string;
  viewerCount: number;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED';
  createdAt: string;
}
