export interface Deposit {
  id: string;
  workspaceId: string;
  periodId: string;
  memberId: string;
  amount: string;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  member?: {
    id: string;
    userId: string | null;
    role: string;
    isActive: boolean;
    user?: {
      id: string;
      name: string | null;
      email: string;
    } | null;
  };
}

export interface Expense {
  id: string;
  workspaceId: string;
  periodId: string;
  title: string;
  amount: string;
  allocationType: 'by_meals';
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDepositInput {
  workspaceId: string;
  periodId: string;
  memberId: string;
  amount: number;
  note?: string;
}

export interface CreateExpenseInput {
  workspaceId: string;
  periodId: string;
  title: string;
  amount: number;
  note?: string;
  allocationType?: 'by_meals';
}
