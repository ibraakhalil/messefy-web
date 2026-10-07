import React, { useState, useEffect, useCallback } from 'react';
import { WorkspaceContext } from '@/context/workspace-context';
import { workspaceService } from '@/services/workspace-service';
import { authStorage } from '@/lib/auth-storage';
import { useAuth } from '@/hooks/use-auth';
import type { WorkspaceMember, Workspace, CreateWorkspaceInput } from '@/types/workspace';

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [member, setMember] = useState<WorkspaceMember | null>(null);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(() => isAuthenticated);

  const fetchWorkspace = useCallback(async () => {
    if (!isAuthenticated) {
      setMember(null);
      setWorkspace(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const activeMember = await workspaceService.getValidMember();
      if (activeMember) {
        setMember(activeMember);
        setWorkspace(activeMember.workspace || null);
        authStorage.setActiveWorkspaceId(activeMember.workspaceId);
      } else {
        setMember(null);
        setWorkspace(null);
        authStorage.removeActiveWorkspaceId();
      }
    } catch (err) {
      console.warn('Failed to fetch workspace membership:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    let isMounted = true;

    if (!isAuthenticated) {
      return;
    }

    const loadInitialWorkspace = async () => {
      try {
        const activeMember = await workspaceService.getValidMember();
        if (isMounted) {
          if (activeMember) {
            setMember(activeMember);
            setWorkspace(activeMember.workspace || null);
            authStorage.setActiveWorkspaceId(activeMember.workspaceId);
          } else {
            setMember(null);
            setWorkspace(null);
            authStorage.removeActiveWorkspaceId();
          }
        }
      } catch (err) {
        console.warn('Failed to fetch workspace membership:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadInitialWorkspace();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const handleCreateWorkspace = async (input: CreateWorkspaceInput): Promise<Workspace> => {
    const result = await workspaceService.createWorkspace(input);
    await fetchWorkspace();
    return result.workspace;
  };

  const handleJoinWorkspace = async (workspaceId: string): Promise<void> => {
    await workspaceService.joinWorkspace(workspaceId);
    await fetchWorkspace();
  };

  return (
    <WorkspaceContext.Provider
      value={{
        member,
        workspace,
        hasWorkspace: Boolean(workspace),
        isLoading: isAuthenticated ? isLoading : false,
        createWorkspace: handleCreateWorkspace,
        joinWorkspace: handleJoinWorkspace,
        refetchWorkspace: fetchWorkspace,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};
