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

export interface VotesCategoryData {
  category: string;
  total_votes: number | { low: number; high: number };
}

export interface CapitalAllocationCategory {
  category: string;
  total_allocation: number;
}

export interface ProposalTrendData {
  [categoryName: string]: {
    [monthName: string]: number;
  };
}

export interface ApprovalRateData {
  [categoryName: string]: number;
}

export interface ApprovalAmountData {
  [categoryName: string]: number;
}

export interface InitiativeType {
  category: "New" | "Existing" | "Compensation" | "Protocol";
  amount: number;
  refs: number[];
}

export interface FunctionalType {
  category: "Marketing" | "Product" | "Event" | "EducationAndResearch" | "BD" | "Security";
  amount: number;
  refs: number[];
}