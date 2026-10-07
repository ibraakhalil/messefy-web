import { useMutation, useQueryClient } from '@tanstack/react-query';
import { memberService } from '@/services/member-service';
import type { AddMemberInput } from '@/types/member';

export function useMemberActions(workspaceId?: string) {
  const queryClient = useQueryClient();

  const addMemberMutation = useMutation({
    mutationFn: (input: AddMemberInput) => memberService.addMember(input),
    onSuccess: () => {
      if (workspaceId) {
        queryClient.invalidateQueries({ queryKey: ['workspace', workspaceId, 'members'] });
      }
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: ({ memberId }: { memberId: string }) => {
      if (!workspaceId) throw new Error('Workspace ID is missing');
      return memberService.removeMember(workspaceId, memberId);
    },
    onSuccess: () => {
      if (workspaceId) {
        queryClient.invalidateQueries({ queryKey: ['workspace', workspaceId, 'members'] });
      }
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
    },
  });

  return {
    addMember: addMemberMutation.mutateAsync,
    isAdding: addMemberMutation.isPending,
    removeMember: removeMemberMutation.mutateAsync,
    isRemoving: removeMemberMutation.isPending,
  };
}
