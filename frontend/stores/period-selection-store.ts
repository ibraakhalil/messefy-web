import { create } from 'zustand';

interface PeriodSelectionStore {
  selectedPeriodIds: Record<string, string>;
  selectPeriod: (workspaceId: string, periodId: string) => void;
}

export const usePeriodSelectionStore = create<PeriodSelectionStore>()((set) => ({
  selectedPeriodIds: {},
  selectPeriod: (workspaceId, periodId) =>
    set((state) => ({
      selectedPeriodIds: {
        ...state.selectedPeriodIds,
        [workspaceId]: periodId,
      },
    })),
}));
