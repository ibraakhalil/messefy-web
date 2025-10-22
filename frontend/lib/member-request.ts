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
