import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import * as api from "@/data/open-gov";
import { ProposeRel, RefVotingPowerTurnout } from "@/types/open-gov";

// Query keys
export const queryKeys = {
    monthlyRefs: ["monthly-refs"] as const,
    refVotingPowerTurnout: ["ref-voting-power-turnout"] as const,
}

// Custom hooks
export const useMonthlyRefs = (options?: UseQueryOptions<ProposeRel[]>) => {
    return useQuery({
        queryKey: queryKeys.monthlyRefs,
        queryFn: api.fetchMonthlyRefs,
        ...options,
    });
}

export const useRefVotingPowerTurnout = (options?: UseQueryOptions<RefVotingPowerTurnout[]>) => {
    return useQuery({
        queryKey: queryKeys.refVotingPowerTurnout,
        queryFn: api.fetchRefVotingPowerTurnout,
        ...options,
    });
}