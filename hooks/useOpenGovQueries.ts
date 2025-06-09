import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import * as api from "@/data/open-gov";
import { ProposeRel } from "@/types/open-gov";

// Query keys
export const queryKeys = {
    monthlyRefs: ["monthly-refs"] as const,
}

// Custom hooks
export const useMonthlyRefs = (options?: UseQueryOptions<ProposeRel[]>) => {
    return useQuery({
        queryKey: queryKeys.monthlyRefs,
        queryFn: api.fetchMonthlyRefs,
        ...options,
    });
}