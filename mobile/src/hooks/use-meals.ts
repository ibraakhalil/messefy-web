import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { mealService } from '@/services/meal-service';
import type {
  MealChartResponse,
  CreateMealInput,
  BatchCreateMealInput,
} from '@/types/meal';

export const mealKeys = {
  all: ['meals'] as const,
  period: (periodId: string) => [...mealKeys.all, 'period', periodId] as const,
  chart: (periodId: string) => [...mealKeys.all, 'chart', periodId] as const,
};

export function useMealChart(periodId: string) {
  return useQuery({
    queryKey: mealKeys.chart(periodId),
    queryFn: () => mealService.getMealChart(periodId),
    enabled: Boolean(periodId && periodId !== 'none'),
    staleTime: 30 * 1000,
  });
}

export function useMealEntries(periodId: string) {
  return useQuery({
    queryKey: mealKeys.period(periodId),
    queryFn: () => mealService.getMealEntriesByPeriod(periodId),
    enabled: Boolean(periodId && periodId !== 'none'),
    staleTime: 30 * 1000,
  });
}

export function useUpsertMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMealInput & { mealId?: string }) => mealService.upsertMeal(data),
    onMutate: async (newMeal) => {
      // Cancel ongoing queries to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: mealKeys.chart(newMeal.periodId) });

      // Snapshot previous state for rollback
      const previousChart = queryClient.getQueryData<MealChartResponse>(
        mealKeys.chart(newMeal.periodId)
      );

      // Optimistically update the meal chart cache
      if (previousChart) {
        const existingEntryIndex = previousChart.entries.findIndex(
          (entry) => entry.memberId === newMeal.memberId && entry.date === newMeal.date
        );

        let updatedEntries = [...previousChart.entries];
        if (existingEntryIndex >= 0) {
          const old = updatedEntries[existingEntryIndex];
          updatedEntries[existingEntryIndex] = {
            ...old,
            breakfast: newMeal.breakfast !== undefined ? newMeal.breakfast : old.breakfast,
            lunch: newMeal.lunch !== undefined ? newMeal.lunch : old.lunch,
            dinner: newMeal.dinner !== undefined ? newMeal.dinner : old.dinner,
          };
        } else {
          updatedEntries.push({
            id: newMeal.mealId || `optimistic-${Date.now()}`,
            memberId: newMeal.memberId,
            date: newMeal.date,
            breakfast: newMeal.breakfast || 0,
            lunch: newMeal.lunch || 0,
            dinner: newMeal.dinner || 0,
          });
        }

        queryClient.setQueryData<MealChartResponse>(mealKeys.chart(newMeal.periodId), {
          ...previousChart,
          entries: updatedEntries,
        });
      }

      return { previousChart };
    },
    onError: (_err, newMeal, context) => {
      // Rollback on failure
      if (context?.previousChart) {
        queryClient.setQueryData(mealKeys.chart(newMeal.periodId), context.previousChart);
      }
    },
    onSettled: (_data, _error, variables) => {
      // Invalidate chart and dashboard summary so totals recalculate seamlessly
      queryClient.invalidateQueries({ queryKey: mealKeys.chart(variables.periodId) });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
    },
  });
}

export function useBatchCreateMeals() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BatchCreateMealInput) => mealService.batchCreateMeals(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: mealKeys.chart(variables.periodId) });
      queryClient.invalidateQueries({ queryKey: mealKeys.period(variables.periodId) });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
    },
  });
}
