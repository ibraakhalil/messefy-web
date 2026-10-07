export type PeriodStatus = 'open' | 'closed';

export interface MessInfo {
  id: string;
  name: string;
  address?: string;
  totalMembers: number;
}

export interface PeriodSummary {
  periodId: string;
  periodName: string;
  month: number;
  year: number;
  status: PeriodStatus;
  daysRemaining: number;
  totals: {
    mealRate: number;
    totalMeals: number;
    totalExpenses: number;
    totalDeposits: number;
  };
}

export interface UserMessStatus {
  userId: string;
  userName: string;
  role: 'owner' | 'manager' | 'member';
  myMeals: number;
  myDeposit: number;
  myCost: number;
  balance: number; // positive = surplus, negative = due
  isManager: boolean;
}

export interface TodayMeals {
  date: string;
  lunch: number;
  dinner: number;
  status: 'active' | 'off';
}

export interface MessActivity {
  id: string;
  title: string;
  amount: number;
  type: 'deposit' | 'expense' | 'meal';
  author: string;
  timeAgo: string;
}
