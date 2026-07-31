import { usePeriods } from '@/hooks/use-periods';
import { usePeriodSelectionStore } from '@/stores/period-selection-store';
import { useCallback, useMemo } from 'react';

export function usePeriodSelection(workspaceId: string) {
  const periodsQuery = usePeriods(workspaceId);
  const requestedPeriodId = usePeriodSelectionStore(
    (state) => state.selectedPeriodIds[workspaceId] ?? '',
  );
  const selectPeriodForWorkspace = usePeriodSelectionStore((state) => state.selectPeriod);
  const selectPeriod = useCallback(
    (periodId: string) => selectPeriodForWorkspace(workspaceId, periodId),
    [selectPeriodForWorkspace, workspaceId],
  );
  const periods = useMemo(
    () =>
      [...(periodsQuery.data || [])].sort(
        (left, right) => right.year - left.year || right.month - left.month,
      ),
    [periodsQuery.data],
  );
  const defaultPeriod =
    periods.find((period) => period.status === 'open') ||
    periods.find((period) => period.status === 'closed');
  const selectedPeriod = periods.find((period) => period.id === requestedPeriodId) || defaultPeriod;

  return {
    periods,
    selectedPeriod,
    selectedPeriodId: selectedPeriod?.id || '',
    selectPeriod,
    isLoading: periodsQuery.isLoading,
    error: periodsQuery.error,
    refetch: periodsQuery.refetch,
  };
}
