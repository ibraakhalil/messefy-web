import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { WorkspaceContext, type WorkspaceContextType } from '@/context/workspace-context';
import { workspaceService } from '@/services/workspace-service';

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
