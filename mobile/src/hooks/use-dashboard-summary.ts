import { useQuery } from '@tanstack/react-query';
import { summaryService, type WorkspaceSummaryResponse } from '@/services/summary-service';

export function useCurrentWorkspaceSummary(workspaceId: string | undefined | null) {
  return useQuery<WorkspaceSummaryResponse | null>({
    queryKey: ['summary', 'workspace', workspaceId, 'current'],
    queryFn: async () => {
      if (!workspaceId) return null;
      return summaryService.getCurrentWorkspaceSummary(workspaceId);
    },
    enabled: Boolean(workspaceId),
    staleTime: 1000 * 60, // 1 minute
  });
}
