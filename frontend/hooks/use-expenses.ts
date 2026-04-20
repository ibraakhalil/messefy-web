/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createExpense } from '@/lib/expense-requests';
import { summaryKeys } from './use-summary';

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExpense,
    onSuccess: (expense) => {
      queryClient.invalidateQueries({ queryKey: summaryKeys.currentWorkspace(expense.workspaceId) });
      toast.success('Expense recorded successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Failed to record expense';
      toast.error(message);
    },
  });
}
