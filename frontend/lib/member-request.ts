import { Member } from '@/types/workspace';
import api from '@/utils/axios';

export async function getAllWorkspaceMembers(workspaceId: string): Promise<Member[]> {
  try {
    const response = await api.get(`/workspaces/${workspaceId}/members`);
    return response.data;
  } catch (error) {
    console.error('Error fetching workspace members:', error);
    throw error;
  }
}

export async function removeWorkspaceMember(workspaceId: string, memberId: string) {
  try {
    const response = await api.delete(`/members/${workspaceId}/member/${memberId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing workspace member:', error);
    throw error;
  }
}
