/* eslint-disable @typescript-eslint/no-explicit-any */
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

export async function createBatchMealEntries(data: CreateBatchMealRequest): Promise<void> {
  try {
    await api.post('/meals/batch', data);
  } catch (error) {
    console.error('Error batch creating meals:', error);
    throw error;
  }
}
