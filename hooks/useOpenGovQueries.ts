import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import * as api from "@/data/open-gov";
import {
  ProposeRel,
  RefVotingPowerTurnout,
  VotingPowerInequality,
  ErroneousRateData,
  VotesCategoryData,
  CapitalAllocationCategory,
  ProposalTrendData,
  ApprovalRateData,
} from "@/types/open-gov";

// Query keys
export const queryKeys = {
  monthlyRefs: ["monthly-refs"] as const,
  refVotingPowerTurnout: ["ref-voting-power-turnout"] as const,
  votingPowerInequality: ["voting-power-inequality"] as const,
  erroneousRate: ["erroneous-rate"] as const,
  voterTurnoutCategory: ["voter-turnout-category"] as const,
  capitalAllocationCategory: ["capital-allocation-category"] as const,
  proposalTrendCategory: ["proposal-trend-category"] as const,
  approvalRateCategory: ["approval-rate-category"] as const,
};

// Custom hooks
export const useMonthlyRefs = (options?: UseQueryOptions<ProposeRel[]>) => {
  return useQuery({
    queryKey: queryKeys.monthlyRefs,
    queryFn: api.fetchMonthlyRefs,
    ...options,
  });
};

export const useRefVotingPowerTurnout = (
  options?: UseQueryOptions<RefVotingPowerTurnout[]>
) => {
  return useQuery({
    queryKey: queryKeys.refVotingPowerTurnout,
    queryFn: api.fetchRefVotingPowerTurnout,
    ...options,
  });
};

export const useVotingPowerInequality = (
  options?: UseQueryOptions<VotingPowerInequality[]>
) => {
  return useQuery({
    queryKey: queryKeys.votingPowerInequality,
    queryFn: api.fetchVotingPowerInequality,
    ...options,
  });
};

export const useErroneousRate = (options?: UseQueryOptions<ErroneousRateData>) => {
  return useQuery({
    queryKey: queryKeys.erroneousRate,
    queryFn: api.fetchErroneousRate,
    ...options,
  });
};

export const useVoterTurnoutCategory = (options?: UseQueryOptions<VotesCategoryData[]>) => {
  return useQuery({
    queryKey: queryKeys.voterTurnoutCategory,
    queryFn: api.fetchVoterTurnoutCategory,
    ...options,
  });
};

export const useCapitalAllocationCategory = (options?: UseQueryOptions<CapitalAllocationCategory[]>) => {
  return useQuery({
    queryKey: queryKeys.capitalAllocationCategory,
    queryFn: api.fetchCapitalAllocationCategory,
    ...options,
  });
};

export const useProposalTrendCategory = (options?: UseQueryOptions<ProposalTrendData[]>) => {
  return useQuery({
    queryKey: queryKeys.proposalTrendCategory,
    queryFn: api.fetchProposalTrendCategory,
    ...options,
  });
};

export const useApprovalRateCategory = (options?: UseQueryOptions<ApprovalRateData[]>) => {
  return useQuery({
    queryKey: queryKeys.approvalRateCategory,
    queryFn: api.fetchApprovalRateCategory,
    ...options,
  });
};