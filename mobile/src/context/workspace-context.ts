import { createContext } from 'react';
import type { WorkspaceMember, Workspace, CreateWorkspaceInput } from '@/types/workspace';

export interface WorkspaceContextType {
  member: WorkspaceMember | null;
  workspace: Workspace | null;
  hasWorkspace: boolean;
  isLoading: boolean;
  createWorkspace: (input: CreateWorkspaceInput) => Promise<Workspace>;
  joinWorkspace: (workspaceId: string) => Promise<void>;
  refetchWorkspace: () => Promise<void>;
}

export const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);
