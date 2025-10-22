/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createPeriod,
  getPeriodsByWorkspace,
  getPeriodById,
  getCurrentPeriod,
  updatePeriod,
  deletePeriod,
} from '@/lib/period-requests';
import { UpdatePeriodRequest } from '@/types/period';
import toast from 'react-hot-toast';

// Query keys
export const periodKeys = {
  all: ['periods'] as const,
  lists: () => [...periodKeys.all, 'list'] as const,
  list: (workspaceId: string) => [...periodKeys.lists(), workspaceId] as const,
  details: () => [...periodKeys.all, 'detail'] as const,
  detail: (id: string) => [...periodKeys.details(), id] as const,
  current: (workspaceId: string) => [...periodKeys.all, 'current', workspaceId] as const,
};

/**
 * Hook to get all periods for a workspace
 */
export function usePeriods(workspaceId: string) {
  return useQuery({
    queryKey: periodKeys.list(workspaceId),
    queryFn: () => getPeriodsByWorkspace(workspaceId),
    enabled: !!workspaceId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get all periods for a workspace (alias for usePeriods)
 */
export function usePeriodsByWorkspace(workspaceId: string) {
  return usePeriods(workspaceId);
}

/**
 * Hook to get current period for a workspace
 */
export function useCurrentPeriod(workspaceId: string) {
  return useQuery({
    queryKey: periodKeys.current(workspaceId),
    queryFn: () => getCurrentPeriod(workspaceId),
    enabled: !!workspaceId,
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Hook to get a specific period by ID
 */
export function usePeriod(periodId: string) {
  return useQuery({
    queryKey: periodKeys.detail(periodId),
    queryFn: () => getPeriodById(periodId),
    enabled: !!periodId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to create a new period
 */
export function useCreatePeriod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPeriod,
    onSuccess: (newPeriod) => {
      queryClient.invalidateQueries({ queryKey: periodKeys.list(newPeriod.workspaceId) });
      queryClient.invalidateQueries({ queryKey: periodKeys.current(newPeriod.workspaceId) });
      toast.success('Period created successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Failed to create period';
      toast.error(message);
    },
  });
}

/**
 * Hook to update a period
 */
export function useUpdatePeriod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ periodId, data }: { periodId: string; data: UpdatePeriodRequest }) =>
      updatePeriod(periodId, data),
    onSuccess: (updatedPeriod) => {
      queryClient.invalidateQueries({ queryKey: periodKeys.list(updatedPeriod.workspaceId) });
      queryClient.invalidateQueries({ queryKey: periodKeys.detail(updatedPeriod.id) });
      queryClient.invalidateQueries({ queryKey: periodKeys.current(updatedPeriod.workspaceId) });
      toast.success('Period updated successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Failed to update period';
      toast.error(message);
    },
  });
}

export function useDeletePeriod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePeriod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: periodKeys.all });
      toast.success('Period deleted successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Failed to delete period';
      toast.error(message);
    },
  });
}
