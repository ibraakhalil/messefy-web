/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBatchMealEntries } from '@/lib/meal-requests';
import toast from 'react-hot-toast';

export function useBatchCreateMeals() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBatchMealEntries,
    onSuccess: (_, variables) => {
      // Invalidate queries related to meals for this period
      queryClient.invalidateQueries({ queryKey: ['meals', variables.periodId] });
      toast.success('Meals saved successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Failed to save meals';
      toast.error(message);
    },
  });
}
