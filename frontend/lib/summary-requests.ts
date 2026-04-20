import { PeriodSummary } from '@/types/summary';
import api from '@/utils/axios';

export async function getCurrentWorkspaceSummary(workspaceId: string): Promise<PeriodSummary> {
  const response = await api.get(`/summary/workspace/${workspaceId}/current`);
  return response.data;
}

export async function getPeriodSummary(periodId: string): Promise<PeriodSummary> {
  const response = await api.get(`/summary/period/${periodId}`);
  return response.data;
}
