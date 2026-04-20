/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createDeposit } from '@/lib/deposit-requests';
import { summaryKeys } from './use-summary';

export function useCreateDeposit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDeposit,
    onSuccess: (deposit) => {
      queryClient.invalidateQueries({ queryKey: summaryKeys.currentWorkspace(deposit.workspaceId) });
      toast.success('Deposit recorded successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Failed to record deposit';
      toast.error(message);
    },
  });
}
