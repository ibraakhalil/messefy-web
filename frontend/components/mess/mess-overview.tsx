'use client';

import NoActivePeriodState from '@/components/dashboard/no-active-period-state';
import Button from '@/components/ui/button';
import { useCurrentPeriod } from '@/hooks/use-periods';
import { useCurrentWorkspaceSummary } from '@/hooks/use-summary';
import { useWorkspace } from '@/providers/workspace-provider';
import type { RecentDeposit, RecentExpense, SummaryMember } from '@/types/summary';
import { formatCurrency } from '@/utils/format-currency';
import { endOfMonth, formatDistanceToNow } from 'date-fns';
import {
  AlertCircle,
  Calendar,
  Receipt,
  TrendingUp,
  Users,
  Utensils,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';

function getPeriodName(year: number, month: number) {
  return new Date(year, month - 1).toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });
}

function getDaysRemaining(year: number, month: number) {
  const now = new Date();
  const periodEnd = endOfMonth(new Date(year, month - 1));
  const msRemaining = periodEnd.getTime() - now.getTime();

  return Math.max(0, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)));
}

type OverviewActivity = {
  id: string;
  title: string;
  meta: string;
  amount: number;
  createdAt: string;
  type: 'deposit' | 'expense';
};

function mapDepositToActivity(deposit: RecentDeposit): OverviewActivity {
  return {
    id: `deposit-${deposit.id}`,
    title: deposit.memberName,
    meta: deposit.note?.trim() || 'Deposit added',
    amount: deposit.amount,
    createdAt: deposit.createdAt,
    type: 'deposit',
  };
}

function mapExpenseToActivity(expense: RecentExpense): OverviewActivity {
  return {
    id: `expense-${expense.id}`,
    title: expense.title,
    meta: expense.note?.trim() || expense.allocationType || 'Expense added',
    amount: expense.amount,
    createdAt: expense.createdAt,
    type: 'expense',
  };
}

function MemberRow({ member }: { member: SummaryMember }) {
  const balanceClassName =
    member.balance < 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400';

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{member.name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {member.meals} meals • {formatCurrency(member.deposits)} deposits
        </p>
      </div>
      <div className="text-right">
        <p className={`text-sm font-semibold ${balanceClassName}`}>
          {formatCurrency(member.balance)}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Due {formatCurrency(member.due)}
        </p>
      </div>
    </div>
  );
}

export default function MessOverview() {
  const workspaceId = useWorkspace().member?.workspaceId || '';
  const { data: currentPeriod, isLoading: isLoadingPeriod } = useCurrentPeriod(workspaceId);
  const {
    data: summary,
    isLoading: isLoadingSummary,
    error,
    refetch,
  } = useCurrentWorkspaceSummary(workspaceId, !!currentPeriod);

  if (!workspaceId) {
    return (
      <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-yellow-900">
        No active workspace selected.
      </div>
    );
  }

  if (isLoadingPeriod || isLoadingSummary) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center rounded-xl border border-gray-200 bg-white p-6 text-gray-500 shadow-sm">
        Loading live mess stats...
      </div>
    );
  }

  if (!currentPeriod) {
    return (
      <NoActivePeriodState
        title="Live Stats Need An Active Period"
        description="Start a meal month first. Then this page will show current totals, recent deposits, expenses, and member balances."
      />
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 text-red-600" />
          <div>
            <h2 className="font-semibold text-red-900">Failed to load live mess stats.</h2>
            <Button onClick={() => refetch()} variant="secondary" className="mt-3">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  const periodName = getPeriodName(summary.period.year, summary.period.month);
  const daysRemaining = getDaysRemaining(summary.period.year, summary.period.month);
  const recentExpenses = summary.recentExpenses.slice(0, 5);
  const recentDeposits = summary.recentDeposits.slice(0, 5);
  const recentActivity = [
    ...summary.recentDeposits.map(mapDepositToActivity),
    ...summary.recentExpenses.map(mapExpenseToActivity),
  ]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);
  const memberPreview = [...summary.members].sort((a, b) => a.balance - b.balance).slice(0, 6);

  const stats = [
    {
      label: 'Meal Rate',
      value: formatCurrency(summary.totals.mealRate),
      helper: 'Per meal',
      icon: Calendar,
      iconClassName: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Total Meals',
      value: String(summary.totals.totalMeals),
      helper: 'Current period',
      icon: Utensils,
      iconClassName: 'bg-emerald-100 text-emerald-600',
    },
    {
      label: 'Total Expenses',
      value: formatCurrency(summary.totals.totalExpenses),
      helper: 'Shared meal costs',
      icon: Receipt,
      iconClassName: 'bg-rose-100 text-rose-600',
    },
    {
      label: 'Total Deposits',
      value: formatCurrency(summary.totals.totalDeposits),
      helper: 'Member contributions',
      icon: Wallet,
      iconClassName: 'bg-purple-100 text-purple-600',
    },
    {
      label: 'Net Balance',
      value: formatCurrency(summary.totals.netBalance),
      helper: summary.totals.netBalance >= 0 ? 'Surplus' : 'Shortfall',
      icon: TrendingUp,
      iconClassName: 'bg-amber-100 text-amber-600',
    },
    {
      label: 'Active Members',
      value: String(summary.totals.memberCount),
      helper: 'Included in summary',
      icon: Users,
      iconClassName: 'bg-cyan-100 text-cyan-600',
    },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="tablet:flex-row tablet:items-center tablet:justify-between flex flex-col gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Period</p>
            <h2 className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
              {periodName}
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {daysRemaining} days remaining • Status: {summary.period.status}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href={`/mess/dashboard/all-months/${currentPeriod.id}`}>
              <Button variant="secondary">View Details</Button>
            </Link>
            <Link href="/mess/dashboard/data-entry">
              <Button>Add Data</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-6 grid grid-cols-1 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</h3>
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.iconClassName}`}
                >
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{stat.helper}</span>
              </div>
            </div>
          );
        })}
      </section>

      <div className="laptop:grid-cols-3 grid grid-cols-1 gap-6">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Period Snapshot</h2>
            <Link href="/mess/dashboard/member-balances">
              <Button variant="secondary" className="text-sm">
                Balances
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
              <span className="font-medium text-gray-900 capitalize dark:text-white">
                {summary.period.status}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Meal Expenses</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatCurrency(summary.totals.mealExpenses)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Total Due</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatCurrency(summary.totals.totalDue)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Adjustments</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatCurrency(summary.totals.totalAdjustments)}
              </span>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Recent Expenses
          </h2>

          <div className="space-y-3">
            {recentExpenses.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No expenses recorded yet.</p>
            ) : (
              recentExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                      {expense.title}
                    </p>
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                      {expense.note?.trim() || expense.allocationType || 'Expense added'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(expense.amount)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(expense.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Recent Deposits
          </h2>

          <div className="space-y-3">
            {recentDeposits.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No deposits recorded yet.</p>
            ) : (
              recentDeposits.map((deposit) => (
                <div key={deposit.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                      {deposit.memberName}
                    </p>
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                      {deposit.note?.trim() || 'Deposit added'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(deposit.amount)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(deposit.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <div className="laptop:grid-cols-2 grid grid-cols-1 gap-6">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Member Snapshot
            </h2>
            <Link href="/mess/dashboard/member-balances">
              <Button variant="secondary" className="text-sm">
                View All
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {memberPreview.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No members available in this summary yet.
              </p>
            ) : (
              memberPreview.map((member) => <MemberRow key={member.memberId} member={member} />)
            )}
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Activity Snapshot
            </h2>
            <Link href="/mess/dashboard/member-balances">
              <Button variant="secondary" className="text-sm">
                More Activity
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No deposit or expense activity recorded in this period yet.
              </p>
            ) : (
              recentActivity.map((activity) => {
                const isExpense = activity.type === 'expense';
                return (
                  <div
                    key={activity.id}
                    className="flex items-start justify-between gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        {activity.title}
                      </p>
                      <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                        {activity.meta} •{' '}
                        {formatDistanceToNow(new Date(activity.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        isExpense
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {isExpense ? '-' : '+'}
                      {formatCurrency(activity.amount)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
