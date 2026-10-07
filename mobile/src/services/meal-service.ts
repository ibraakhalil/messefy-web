import { apiClient } from '@/lib/api-client';
import type {
  MealChartResponse,
  MealEntry,
  CreateMealInput,
  UpdateMealInput,
  BatchCreateMealInput,
} from '@/types/meal';

export const mealService = {
  // Get entire meal matrix/chart for a period (includes zero-meal members)
  async getMealChart(periodId: string): Promise<MealChartResponse> {
    const response = await apiClient.get<MealChartResponse>(`/meals/period/${periodId}/chart`);
    return response.data;
  },

  // Get raw meal entries list for a period
  async getMealEntriesByPeriod(periodId: string): Promise<MealEntry[]> {
    const response = await apiClient.get<MealEntry[]>(`/meals/period/${periodId}`);
    return response.data;
  },

  // Get entries for a specific member in a period
  async getMealEntriesByMember(periodId: string, memberId: string): Promise<MealEntry[]> {
    const response = await apiClient.get<MealEntry[]>(`/meals/period/${periodId}/member/${memberId}`);
    return response.data;
  },

  // Create a single meal entry
  async createMeal(input: CreateMealInput): Promise<{ message: string; entry: MealEntry }> {
    const response = await apiClient.post<{ message: string; entry: MealEntry }>('/meals', {
      workspaceId: input.workspaceId,
      periodId: input.periodId,
      memberId: input.memberId,
      date: input.date,
      breakfast: input.breakfast ?? 0,
      lunch: input.lunch ?? 0,
      dinner: input.dinner ?? 0,
    });
    return response.data;
  },

  // Update an existing meal entry
  async updateMeal(input: UpdateMealInput): Promise<{ message: string; entry: MealEntry }> {
    const response = await apiClient.patch<{ message: string; entry: MealEntry }>(
      `/meals/${input.mealId}`,
      {
        breakfast: input.breakfast,
        lunch: input.lunch,
        dinner: input.dinner,
      }
    );
    return response.data;
  },

  // Upsert a meal entry (updates if mealId provided, otherwise creates)
  async upsertMeal(
    input: CreateMealInput & { mealId?: string }
  ): Promise<{ message: string; entry: MealEntry }> {
    if (input.mealId) {
      return this.updateMeal({
        mealId: input.mealId,
        breakfast: input.breakfast,
        lunch: input.lunch,
        dinner: input.dinner,
      });
    }

    try {
      return await this.createMeal(input);
    } catch (err: unknown) {
      // If backend reports entry already exists, fetch entries and update
      if (err instanceof Error && err.message.toLowerCase().includes('already exists')) {
        const memberMeals = await this.getMealEntriesByMember(input.periodId, input.memberId);
        const existing = memberMeals.find((m) => m.date === input.date);
        if (existing) {
          return this.updateMeal({
            mealId: existing.id,
            breakfast: input.breakfast,
            lunch: input.lunch,
            dinner: input.dinner,
          });
        }
      }
      throw err;
    }
  },

  // Batch create/update meals for all members (managers only)
  async batchCreateMeals(input: BatchCreateMealInput): Promise<void> {
    await apiClient.post('/meals/batch', {
      workspaceId: input.workspaceId,
      periodId: input.periodId,
      date: input.date,
      meals: input.meals,
    });
  },

  // Delete a meal entry
  async deleteMeal(mealId: string): Promise<void> {
    await apiClient.delete(`/meals/${mealId}`);
  },
};
