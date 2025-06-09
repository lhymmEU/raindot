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
