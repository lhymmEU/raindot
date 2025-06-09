// For monthly refs
// Define the type for our data items
export interface ProposeRel {
  rel: {
    timestamp: string;
  };
}

export interface MonthlyCount {
  month: string;
  count: number;
}

export interface RefVotingPowerTurnout {
  id: string;
  title: string;
  voteCounts: number;
  totalVotingPowerTurnout: number;
}

export interface VotingPowerInequality {
  walletAddress: string;
  name: string;
  totalVotingPower: number;
}

export interface ErroneousRateData {
  data: ErrorData[];
  countData: CountData[];
}

export interface ErrorData {
  id: string;
  error_timestamp: string;
}

export interface CountData {
  timestamp: string;
}

export interface CategoryData {
  category: string;
  total_votes: number | { low: number; high: number };
}