/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createBatchMealEntries,
  getMealChartByPeriod,
  getMealEntriesByPeriod,
} from '@/lib/meal-requests';
import toast from 'react-hot-toast';

export const mealKeys = {
  all: ['meals'] as const,
  period: (periodId: string) => [...mealKeys.all, periodId] as const,
  chart: (periodId: string) => [...mealKeys.period(periodId), 'chart'] as const,
};

export function useMealsByPeriod(periodId: string) {
  return useQuery({
    queryKey: mealKeys.period(periodId),
    queryFn: () => getMealEntriesByPeriod(periodId),
    enabled: Boolean(periodId),
    staleTime: 60 * 1000,
  });
}

export function useMealChart(periodId: string) {
  return useQuery({
    queryKey: mealKeys.chart(periodId),
    queryFn: () => getMealChartByPeriod(periodId),
    enabled: Boolean(periodId),
    staleTime: 60 * 1000,
  });
}

export function useBatchCreateMeals() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBatchMealEntries,
    onSuccess: (_, variables) => {
      // Invalidate queries related to meals for this period
      queryClient.invalidateQueries({ queryKey: mealKeys.period(variables.periodId) });
      toast.success('Meals saved successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Failed to save meals';
      toast.error(message);
    },
  });
}
