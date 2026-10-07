import { apiClient } from '@/lib/api-client';
import type { AddMemberInput, WorkspaceInvitation } from '@/types/member';

export const memberService = {
  // Add member to workspace (online by email or offline by name)
  async addMember(input: AddMemberInput): Promise<{ message?: string; member: unknown }> {
    const response = await apiClient.post(`/members/${input.workspaceId}`, {
      type: input.type,
      email: input.email?.trim() || undefined,
      name: input.name?.trim() || undefined,
    });
    return response.data;
  },

  // Remove member from workspace (owner check)
  async removeMember(workspaceId: string, memberId: string): Promise<void> {
    await apiClient.delete(`/members/${workspaceId}/member/${memberId}`);
  },

  // Member leaves workspace
  async leaveWorkspace(workspaceId: string): Promise<void> {
    await apiClient.delete(`/members/${workspaceId}/leave`);
  },

  // Get pending invitations for workspace
  async getInvitations(workspaceId: string): Promise<WorkspaceInvitation[]> {
    const response = await apiClient.get<WorkspaceInvitation[]>(
      `/workspaces/${workspaceId}/invitations`
    );
    return response.data;
  },

  // Accept invitation
  async acceptInvitation(workspaceId: string, invitationId: string): Promise<void> {
    await apiClient.post(`/workspaces/${workspaceId}/invitations/${invitationId}/accept`);
  },

  // Cancel/reject invitation
  async cancelInvitation(workspaceId: string, invitationId: string): Promise<void> {
    await apiClient.delete(`/workspaces/${workspaceId}/invitations/${invitationId}/cancel`);
  },
};
