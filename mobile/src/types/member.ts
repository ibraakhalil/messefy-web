export interface AddMemberInput {
  workspaceId: string;
  type: 'online' | 'offline';
  email?: string;
  name?: string;
}

export interface CreatePeriodInput {
  workspaceId: string;
  year: number;
  month: number;
  managerId: string;
}

export interface UpdatePeriodStatusInput {
  periodId: string;
  status: 'open' | 'closed';
}

export interface WorkspaceInvitation {
  id: string;
  workspaceId: string;
  userId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  user?: {
    id: string;
    name: string | null;
    email: string;
  };
}
