import { useQuery } from '@tanstack/react-query';
import { getCurrentWorkspaceSummary, getPeriodSummary } from '@/lib/summary-requests';

export const summaryKeys = {
  all: ['summary'] as const,
  currentWorkspace: (workspaceId: string) =>
    [...summaryKeys.all, 'workspace', workspaceId] as const,
  period: (periodId: string) => [...summaryKeys.all, 'period', periodId] as const,
};

export function useCurrentWorkspaceSummary(workspaceId: string, enabled = true) {
  return useQuery({
    queryKey: summaryKeys.currentWorkspace(workspaceId),
    queryFn: () => getCurrentWorkspaceSummary(workspaceId),
    enabled: !!workspaceId && enabled,
    staleTime: 60 * 1000,
  });
}

export function usePeriodSummary(periodId: string) {
  return useQuery({
    queryKey: summaryKeys.period(periodId),
    queryFn: () => getPeriodSummary(periodId),
    enabled: !!periodId,
    staleTime: 60 * 1000,
  });
}
