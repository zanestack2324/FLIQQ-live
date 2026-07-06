export interface Poll {
  id: string;
  streamId: string;
  userId: string;
  question: string;
  duration: number;
  isActive: boolean;
  isMultiple: boolean;
  createdAt: string;
  endedAt: string | null;
  options: PollOption[];
}

export interface PollOption {
  id: string;
  pollId: string;
  label: string;
  voteCount: number;
}

export interface PollVote {
  id: string;
  pollId: string;
  optionId: string;
  userId: string;
  createdAt: string;
}
