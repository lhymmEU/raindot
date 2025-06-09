import {
  ProposeRel,
  RefVotingPowerTurnout,
  VotingPowerInequality,
  ErroneousRateData,
  CategoryData,
} from "@/types/open-gov";

const baseUrl =
  typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:3000";

// Generic fetcher function
const fetcher = async <T>(endpoint: string): Promise<T> => {
  const response = await fetch(`${baseUrl}${endpoint}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();

  if (!result || !result.data) {
    throw new Error("Invalid response format");
  }

  return result.data as T;
};

// API functions
export const fetchMonthlyRefs = () =>
  fetcher<ProposeRel[]>("/api/graph/monthly-refs");
export const fetchRefVotingPowerTurnout = () =>
  fetcher<RefVotingPowerTurnout[]>("/api/graph/ref-voting-power");
export const fetchVotingPowerInequality = () =>
  fetcher<VotingPowerInequality[]>("/api/graph/voting-power-inequality");
export const fetchErroneousRate = () =>
  fetcher<ErroneousRateData>("/api/graph/erroneous-rate");
export const fetchVoterTurnoutCategory = () =>
  fetcher<CategoryData[]>("/api/graph/voter-turnout-category");