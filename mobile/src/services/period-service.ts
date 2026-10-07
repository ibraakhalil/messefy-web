import { apiClient } from '@/lib/api-client';
import type { CreatePeriodInput, UpdatePeriodStatusInput } from '@/types/member';

export interface PeriodItem {
  id: string;
  workspaceId: string;
  year: number;
  month: number;
  status: 'open' | 'closed';
  managerId: string;
  createdAt: string;
}

export const periodService = {
  // Create a new period
  async createPeriod(input: CreatePeriodInput): Promise<{ message: string; period: PeriodItem }> {
    const response = await apiClient.post<{ message: string; period: PeriodItem }>('/periods', {
      workspaceId: input.workspaceId,
      year: input.year,
      month: input.month,
      managerId: input.managerId,
    });
    return response.data;
  },

  // Update period status (e.g. close period)
  async updatePeriodStatus(
    input: UpdatePeriodStatusInput
  ): Promise<{ message: string; period: PeriodItem }> {
    const response = await apiClient.patch<{ message: string; period: PeriodItem }>(
      `/periods/${input.periodId}`,
      { status: input.status }
    );
    return response.data;
  },

  // Get all periods for workspace
  async getPeriods(workspaceId: string): Promise<PeriodItem[]> {
    const response = await apiClient.get<PeriodItem[]>(`/periods/workspace/${workspaceId}`);
    return response.data;
  },

  // Get current open period
  async getCurrentPeriod(workspaceId: string): Promise<PeriodItem | null> {
    try {
      const response = await apiClient.get<PeriodItem>(`/periods/workspace/${workspaceId}/current`);
      return response.data;
    } catch {
      return null;
    }
  },
};
