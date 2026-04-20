import api from '@/utils/axios';

export interface CreateExpenseRequest {
  workspaceId: string;
  periodId: string;
  title: string;
  amount: number;
  note?: string;
  allocationType?: 'by_meals';
}

export async function createExpense(data: CreateExpenseRequest) {
  const response = await api.post('/expenses', data);
  return response.data.expense;
}
