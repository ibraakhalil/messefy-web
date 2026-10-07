import { apiClient } from '@/lib/api-client';
import type {
  Deposit,
  Expense,
  CreateDepositInput,
  CreateExpenseInput,
} from '@/types/finance';

export const financeService = {
  // Get all deposits for a specific period
  async getDeposits(periodId: string): Promise<Deposit[]> {
    const response = await apiClient.get<Deposit[]>(`/deposits/period/${periodId}`);
    return response.data;
  },

  // Create a new deposit for a member
  async createDeposit(input: CreateDepositInput): Promise<Deposit> {
    const response = await apiClient.post<{ message: string; deposit: Deposit }>(
      '/deposits',
      {
        workspaceId: input.workspaceId,
        periodId: input.periodId,
        memberId: input.memberId,
        amount: input.amount,
        note: input.note?.trim() || undefined,
      }
    );
    return response.data.deposit;
  },

  // Delete a deposit by ID
  async deleteDeposit(depositId: string): Promise<void> {
    await apiClient.delete(`/deposits/${depositId}`);
  },

  // Get all expenses for a specific period
  async getExpenses(periodId: string): Promise<Expense[]> {
    const response = await apiClient.get<Expense[]>(`/expenses/period/${periodId}`);
    return response.data;
  },

  // Create a new expense entry
  async createExpense(input: CreateExpenseInput): Promise<Expense> {
    const response = await apiClient.post<{ message: string; expense: Expense }>(
      '/expenses',
      {
        workspaceId: input.workspaceId,
        periodId: input.periodId,
        title: input.title.trim(),
        amount: input.amount,
        note: input.note?.trim() || undefined,
        allocationType: input.allocationType || 'by_meals',
      }
    );
    return response.data.expense;
  },

  // Delete an expense by ID
  async deleteExpense(expenseId: string): Promise<void> {
    await apiClient.delete(`/expenses/${expenseId}`);
  },
};
