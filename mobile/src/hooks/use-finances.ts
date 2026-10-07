import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { financeService } from '@/services/finance-service';
import type {
  CreateDepositInput,
  CreateExpenseInput,
} from '@/types/finance';

export const financeKeys = {
  all: ['finances'] as const,
  deposits: (periodId: string) => [...financeKeys.all, 'deposits', periodId] as const,
  expenses: (periodId: string) => [...financeKeys.all, 'expenses', periodId] as const,
};

export function useDeposits(periodId: string) {
  return useQuery({
    queryKey: financeKeys.deposits(periodId),
    queryFn: () => financeService.getDeposits(periodId),
    enabled: Boolean(periodId && periodId !== 'none'),
    staleTime: 30 * 1000,
  });
}

export function useExpenses(periodId: string) {
  return useQuery({
    queryKey: financeKeys.expenses(periodId),
    queryFn: () => financeService.getExpenses(periodId),
    enabled: Boolean(periodId && periodId !== 'none'),
    staleTime: 30 * 1000,
  });
}

export function useCreateDeposit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateDepositInput) => financeService.createDeposit(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: financeKeys.deposits(variables.periodId) });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
    },
  });
}

export function useDeleteDeposit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ depositId }: { depositId: string; periodId: string }) =>
      financeService.deleteDeposit(depositId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: financeKeys.deposits(variables.periodId) });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
    },
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateExpenseInput) => financeService.createExpense(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: financeKeys.expenses(variables.periodId) });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ expenseId }: { expenseId: string; periodId: string }) =>
      financeService.deleteExpense(expenseId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: financeKeys.expenses(variables.periodId) });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
    },
  });
}
