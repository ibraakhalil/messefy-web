import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { noticeService } from '@/services/notice-service';
import type { CreateNoticePayload, UpdateNoticePayload } from '@/types/notice';

export const noticeKeys = {
  all: ['notices'] as const,
  workspace: (workspaceId: string) => [...noticeKeys.all, 'workspace', workspaceId] as const,
};

export function useNotices(workspaceId: string | undefined) {
  return useQuery({
    queryKey: noticeKeys.workspace(workspaceId || ''),
    queryFn: () => noticeService.getNotices(workspaceId || ''),
    enabled: Boolean(workspaceId),
    staleTime: 60 * 1000,
  });
}

export function useCreateNotice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateNoticePayload) => noticeService.createNotice(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: noticeKeys.workspace(variables.workspaceId),
      });
    },
  });
}

export function useUpdateNotice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      noticeId,
      payload,
    }: {
      noticeId: string;
      workspaceId: string;
      payload: UpdateNoticePayload;
    }) => noticeService.updateNotice(noticeId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: noticeKeys.workspace(variables.workspaceId),
      });
    },
  });
}

export function useDeleteNotice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      noticeId,
    }: {
      noticeId: string;
      workspaceId: string;
    }) => noticeService.deleteNotice(noticeId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: noticeKeys.workspace(variables.workspaceId),
      });
    },
  });
}
