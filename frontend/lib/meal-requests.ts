import api from '@/utils/axios';

export interface BatchMealEntry {
  memberId: string;
  breakfast?: number;
  lunch?: number;
  dinner?: number;
}

export interface CreateBatchMealRequest {
  workspaceId: string;
  periodId: string;
  date: string;
  meals: BatchMealEntry[];
}

export interface MealEntry {
  id: string;
  workspaceId: string;
  periodId: string;
  memberId: string;
  date: string;
  breakfast: number;
  lunch: number;
  dinner: number;
  createdAt: string;
  updatedAt: string;
  member: {
    id: string;
    name: string | null;
    user: {
      name: string | null;
      email: string;
    } | null;
  };
}

export interface MealChartEntry {
  id: string;
  memberId: string;
  date: string;
  breakfast: number;
  lunch: number;
  dinner: number;
}

export interface MealChartMember {
  id: string;
  name: string;
}

export interface MealChartResponse {
  members: MealChartMember[];
  entries: MealChartEntry[];
}

export async function createBatchMealEntries(data: CreateBatchMealRequest): Promise<void> {
  try {
    await api.post('/meals/batch', data);
  } catch (error) {
    console.error('Error batch creating meals:', error);
    throw error;
  }
}

export async function getMealEntriesByPeriod(periodId: string): Promise<MealEntry[]> {
  const response = await api.get<MealEntry[]>(`/meals/period/${periodId}`);
  return response.data;
}

export async function getMealChartByPeriod(periodId: string): Promise<MealChartResponse> {
  const response = await api.get<MealChartResponse>(`/meals/period/${periodId}/chart`);
  return response.data;
}
