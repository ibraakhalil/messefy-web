import { Workspace } from '@/types/workspace';
import api from '@/utils/axios';

export async function getWorkspaceByUser() {
  try {
    const { data } = await api.get<{ workspace: Workspace }>('/workspaces/user');
    return data.workspace;
  } catch (error) {
    console.error('Error fetching workspaces by user:', error);
  }
}
