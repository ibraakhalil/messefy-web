import { apiClient } from '@/lib/api-client';

export interface SummaryPeriod {
  id: string;
  workspaceId: string;
  year: number;
  month: number;
  status: 'open' | 'closed';
  createdAt: string;
  closedAt?: string | null;
}

export interface SummaryTotals {
  memberCount: number;
  totalMeals: number;
  totalDeposits: number;
  totalExpenses: number;
  mealExpenses: number;
  totalDue: number;
  mealRate: number;
  netBalance: number;
}

export interface SummaryMember {
  memberId: string;
  userId: string;
  name: string;
  email: string | null;
  role: 'owner' | 'manager' | 'member';
  isOffline: boolean;
  meals: number;
  deposits: number;
  due: number;
  balance: number;
}

export interface RecentDepositItem {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  note?: string | null;
  createdAt: string;
}

export interface RecentExpenseItem {
  id: string;
  title: string;
  amount: number;
  allocationType: string;
  note?: string | null;
  createdAt: string;
}

export interface WorkspaceSummaryResponse {
  period: SummaryPeriod;
  totals: SummaryTotals;
  members: SummaryMember[];
  recentDeposits: RecentDepositItem[];
  recentExpenses: RecentExpenseItem[];
}

export const summaryService = {
  // Get current workspace summary
  async getCurrentWorkspaceSummary(workspaceId: string): Promise<WorkspaceSummaryResponse | null> {
    try {
      const response = await apiClient.get<WorkspaceSummaryResponse>(
        `/summary/workspace/${workspaceId}/current`
      );
      return response.data;
    } catch (err: unknown) {
      // 404 means no active period for this workspace yet
      if (err instanceof Error && err.message.includes('404')) {
        return null;
      }
      return null;
    }
  },

  // Get specific period summary by periodId
  async getPeriodSummary(periodId: string): Promise<WorkspaceSummaryResponse> {
    const response = await apiClient.get<WorkspaceSummaryResponse>(`/summary/period/${periodId}`);
    return response.data;
  },
};
