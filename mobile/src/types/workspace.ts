import type { UserProfile } from './api';

export type WorkspaceRole = 'owner' | 'manager' | 'member';

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  ownerId: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: WorkspaceRole;
  isActive: boolean;
  workspace?: Workspace;
  user?: UserProfile;
}

export interface CreateWorkspaceInput {
  name: string;
  slug: string;
  description?: string;
}

export interface JoinWorkspaceInput {
  workspaceId: string;
}
