import { usePeriods } from '@/hooks/use-periods';
import { useMemo, useState } from 'react';

export function usePeriodSelection(workspaceId: string) {
  const periodsQuery = usePeriods(workspaceId);
  const [requestedPeriodId, setRequestedPeriodId] = useState('');
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
    selectPeriod: setRequestedPeriodId,
    isLoading: periodsQuery.isLoading,
    error: periodsQuery.error,
    refetch: periodsQuery.refetch,
  };
}
