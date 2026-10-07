import { useMutation, useQueryClient } from '@tanstack/react-query';
import { periodService } from '@/services/period-service';
import type { CreatePeriodInput, UpdatePeriodStatusInput } from '@/types/member';

export function usePeriodManagement() {
  const queryClient = useQueryClient();

  const createPeriodMutation = useMutation({
    mutationFn: (input: CreatePeriodInput) => periodService.createPeriod(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      queryClient.invalidateQueries({ queryKey: ['finances'] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: (input: UpdatePeriodStatusInput) => periodService.updatePeriodStatus(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      queryClient.invalidateQueries({ queryKey: ['finances'] });
    },
  });

  return {
    createPeriod: createPeriodMutation.mutateAsync,
    isCreating: createPeriodMutation.isPending,
    updateStatus: updateStatusMutation.mutateAsync,
    isUpdatingStatus: updateStatusMutation.isPending,
  };
}
