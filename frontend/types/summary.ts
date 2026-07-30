export interface SummaryPeriod {
  id: string;
  workspaceId: string;
  year: number;
  month: number;
  status: 'open' | 'closed';
  createdAt: string;
  closedAt: string | null;
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
  userId: string | null;
  name: string;
  email: string | null;
  role: string;
  isOffline: boolean;
  meals: number;
  deposits: number;
  due: number;
  balance: number;
}

export interface RecentDeposit {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  note: string | null;
  createdAt: string;
}

export interface RecentExpense {
  id: string;
  title: string;
  amount: number;
  allocationType: string;
  note: string | null;
  createdAt: string;
}

export interface PeriodSummary {
  period: SummaryPeriod;
  totals: SummaryTotals;
  members: SummaryMember[];
  recentDeposits: RecentDeposit[];
  recentExpenses: RecentExpense[];
}
