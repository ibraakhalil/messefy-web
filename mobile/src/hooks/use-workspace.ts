import { useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WorkspaceContext, type WorkspaceContextType } from '@/context/workspace-context';
import { workspaceService, type UpdateWorkspaceInput } from '@/services/workspace-service';

export function useWorkspace(): WorkspaceContextType {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}

export function useWorkspaceMembers(workspaceId?: string) {
  return useQuery({
    queryKey: ['workspace', workspaceId, 'members'],
    queryFn: () => (workspaceId ? workspaceService.getWorkspaceMembers(workspaceId) : []),
    enabled: Boolean(workspaceId),
    staleTime: 60 * 1000,
  });
}

export function useUpdateWorkspace() {
  const queryClient = useQueryClient();
  const { refetchWorkspace } = useWorkspace();

  return useMutation({
    mutationFn: ({
      workspaceId,
      input,
    }: {
      workspaceId: string;
      input: UpdateWorkspaceInput;
    }) => workspaceService.updateWorkspace(workspaceId, input),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['workspace'] }),
        queryClient.invalidateQueries({ queryKey: ['workspace', variables.workspaceId] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] }),
        refetchWorkspace(),
      ]);
    },
  });
}
