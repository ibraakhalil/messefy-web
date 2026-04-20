import api from '@/utils/axios';

export interface CreateDepositRequest {
  workspaceId: string;
  periodId: string;
  memberId: string;
  amount: number;
  note?: string;
}

export async function createDeposit(data: CreateDepositRequest) {
  const response = await api.post('/deposits', data);
  return response.data.deposit;
}
