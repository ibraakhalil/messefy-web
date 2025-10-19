import { Workspace, Member } from '@/types/workspace';
import api from '@/utils/axios';

export interface WorkspaceMember extends Member {
  workspace: Workspace;
  user: {
    id: string;
    email: string;
    name: string;
    image: string;
  };
}

export async function getValidWorkspaceMember() {
  try {
    const { data } = await api.get<WorkspaceMember>('/workspaces/member');
    return data as WorkspaceMember | null;
  } catch (error) {
    console.error('Error fetching workspace member:', error);
  }
}

export async function leaveWorkspace(workspaceId: string) {
  try {
    const { data } = await api.delete(`/members/${workspaceId}/leave`);
    return data;
  } catch (error) {
    console.error('Error leaving workspace:', error);
    throw error;
  }
}
