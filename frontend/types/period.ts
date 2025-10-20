export interface Period {
  id: string;
  workspaceId: string;
  year: number;
  month: number;
  status: 'open' | 'closed';
  createdAt: string;
  closedAt: string | null;
  updatedAt: string;
  workspace?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface CreatePeriodRequest {
  workspaceId: string;
  year: number;
  month: number;
}

export interface UpdatePeriodRequest {
  status: 'open' | 'closed';
}

export interface PeriodStats {
  totalMembers: number;
  totalDeposits: number;
  totalExpenses: number;
  totalMeals: number;
  balance: number;
  mealRate: number;
}

export interface PeriodMember {
  id: string;
  name: string;
  meals: number;
  deposit: number;
  balance: number;
  status: 'positive' | 'negative';
}

export interface PeriodTransaction {
  id: number;
  date: string;
  type: 'expense' | 'deposit' | 'meal';
  description: string;
  amount: number | null;
  category: string;
  paidBy?: string;
  member?: string;
  count?: number;
}