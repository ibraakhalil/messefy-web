import { Workspace, Member } from '@/types/workspace';
import api from '@/utils/axios';

interface GetValidWorkspaceMemberResponse extends Member {
  workspace: Workspace;
}

export async function getValidWorkspaceMember() {
  try {
    const { data } = await api.get<GetValidWorkspaceMemberResponse>('/workspaces/member');
    return data as GetValidWorkspaceMemberResponse;
  } catch (error) {
    console.error('Error fetching workspace member:', error);
  }
}
