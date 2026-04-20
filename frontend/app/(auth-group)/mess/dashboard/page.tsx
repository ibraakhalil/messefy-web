'use client';

import Button from '@/components/ui/button';
import NoActivePeriodState from '@/components/dashboard/no-active-period-state';
import { useCurrentPeriod } from '@/hooks/use-periods';
import { useCurrentWorkspaceSummary } from '@/hooks/use-summary';
import { useWorkspace } from '@/providers/workspace-provider';
import type { RecentDeposit, RecentExpense, SummaryMember } from '@/types/summary';
import { endOfMonth, formatDistanceToNow } from 'date-fns';
import {
  AlertCircle,
  Calendar,
  DollarSign,
  FileText,
  Plus,
  Receipt,
  Settings,
  TrendingUp,
  Users,
  Utensils,
} from 'lucide-react';
import Link from 'next/link';

function formatAmount(amount: number) {
  return `$${amount.toFixed(2)}`;
}

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

type DashboardActivity = {
  id: string;
  description: string;
  amount: number;
  createdAt: string;
  icon: typeof DollarSign;
  iconClassName: string;
  amountClassName: string;
  meta: string;
};

function mapDepositToActivity(deposit: RecentDeposit): DashboardActivity {
  return {
    id: `deposit-${deposit.id}`,
    description: deposit.memberName,
    amount: deposit.amount,
    createdAt: deposit.createdAt,
    icon: DollarSign,
    iconClassName: 'text-emerald-600 dark:text-emerald-400',
    amountClassName: 'text-emerald-600 dark:text-emerald-400',
    meta: deposit.note?.trim() || 'Deposit added',
  };
}

function mapExpenseToActivity(expense: RecentExpense): DashboardActivity {
  return {
    id: `expense-${expense.id}`,
    description: expense.title,
    amount: expense.amount,
    createdAt: expense.createdAt,
    icon: Receipt,
    iconClassName: 'text-rose-600 dark:text-rose-400',
    amountClassName: 'text-rose-600 dark:text-rose-400',
    meta: expense.note?.trim() || expense.allocationType || 'Expense added',
  };
}

export default function DashboardPage() {
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
      <div className="p-6">
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-900">
          No active workspace selected.
        </div>
      </div>
    );
  }

  if (isLoadingPeriod || isLoadingSummary) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  if (!currentPeriod) {
    return (
      <NoActivePeriodState
        title="Dashboard Overview Awaits An Active Period"
        description="Start a meal month first. Then the dashboard will show current totals, rate, recent activity, and balance alerts."
      />
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-red-600" />
            <div>
              <h2 className="font-semibold text-red-900">Failed to load dashboard summary.</h2>
              <Button onClick={() => refetch()} variant="secondary" className="mt-3">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  const currentMonth = {
    name: getPeriodName(summary.period.year, summary.period.month),
    daysRemaining: getDaysRemaining(summary.period.year, summary.period.month),
    totalMembers: summary.totals.memberCount,
    totalMeals: summary.totals.totalMeals,
    totalDeposits: summary.totals.totalDeposits,
    totalExpenses: summary.totals.totalExpenses,
    balance: summary.totals.netBalance,
    mealRate: summary.totals.mealRate,
    totalDue: summary.totals.totalDue,
    mealExpenses: summary.totals.mealExpenses,
    totalAdjustments: summary.totals.totalAdjustments,
  };

  const outstandingMembers = [...summary.members]
    .filter((member) => member.balance < 0)
    .sort((a, b) => a.balance - b.balance);
  const topOutstandingMembers = outstandingMembers.slice(0, 5);
  const outstandingAmount = outstandingMembers.reduce(
    (total, member) => total + Math.abs(member.balance),
    0,
  );

  const recentActivity = [...summary.recentDeposits.map(mapDepositToActivity), ...summary.recentExpenses.map(mapExpenseToActivity)]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  const quickActions = [
    {
      title: 'Add Data',
      description: 'Meals, deposits & expenses',
      href: '/mess/dashboard/data-entry',
      icon: Plus,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      title: 'Members',
      description: 'Manage mess members',
      href: '/mess/dashboard/members',
      icon: Users,
      color: 'bg-emerald-600 hover:bg-emerald-700',
    },
    {
      title: 'Reports',
      description: 'Monthly statements',
      href: '/mess/dashboard/member-balances',
      icon: FileText,
      color: 'bg-purple-600 hover:bg-purple-700',
    },
  ];

  const summaryCards = [
    {
      label: 'Net Balance',
      value: formatAmount(currentMonth.balance),
      icon: TrendingUp,
      wrapperClassName: 'bg-emerald-50 dark:bg-emerald-900/20',
      iconClassName: 'text-emerald-600 dark:text-emerald-400',
      labelClassName: 'text-emerald-700 dark:text-emerald-300',
      valueClassName: 'text-emerald-900 dark:text-emerald-100',
    },
    {
      label: 'Meal Rate',
      value: formatAmount(currentMonth.mealRate),
      icon: Utensils,
      wrapperClassName: 'bg-blue-50 dark:bg-blue-900/20',
      iconClassName: 'text-blue-600 dark:text-blue-400',
      labelClassName: 'text-blue-700 dark:text-blue-300',
      valueClassName: 'text-blue-900 dark:text-blue-100',
    },
    {
      label: 'Active Members',
      value: String(currentMonth.totalMembers),
      icon: Users,
      wrapperClassName: 'bg-orange-50 dark:bg-orange-900/20',
      iconClassName: 'text-orange-600 dark:text-orange-400',
      labelClassName: 'text-orange-700 dark:text-orange-300',
      valueClassName: 'text-orange-900 dark:text-orange-100',
    },
    {
      label: 'Total Meals',
      value: String(currentMonth.totalMeals),
      icon: Receipt,
      wrapperClassName: 'bg-purple-50 dark:bg-purple-900/20',
      iconClassName: 'text-purple-600 dark:text-purple-400',
      labelClassName: 'text-purple-700 dark:text-purple-300',
      valueClassName: 'text-purple-900 dark:text-purple-100',
    },
    {
      label: 'Total Deposits',
      value: formatAmount(currentMonth.totalDeposits),
      icon: DollarSign,
      wrapperClassName: 'bg-cyan-50 dark:bg-cyan-900/20',
      iconClassName: 'text-cyan-600 dark:text-cyan-400',
      labelClassName: 'text-cyan-700 dark:text-cyan-300',
      valueClassName: 'text-cyan-900 dark:text-cyan-100',
    },
    {
      label: 'Total Expenses',
      value: formatAmount(currentMonth.totalExpenses),
      icon: Receipt,
      wrapperClassName: 'bg-rose-50 dark:bg-rose-900/20',
      iconClassName: 'text-rose-600 dark:text-rose-400',
      labelClassName: 'text-rose-700 dark:text-rose-300',
      valueClassName: 'text-rose-900 dark:text-rose-100',
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            {currentMonth.name} • {currentMonth.daysRemaining} days remaining
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/mess/dashboard/all-months">
            <Button variant="secondary" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Manage Period
            </Button>
          </Link>
          <Link href="/mess/dashboard/settings">
            <Button variant="secondary" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {currentMonth.name} Overview
          </h2>
          <Link href="/mess/dashboard/current-month">
            <Button variant="secondary" className="text-sm">
              View Details
            </Button>
          </Link>
        </div>

        <div className="tablet:grid-cols-3 grid grid-cols-1 gap-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className={`rounded-lg p-4 ${card.wrapperClassName}`}>
                <div className="mb-2 flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${card.iconClassName}`} />
                  <span className={`text-sm ${card.labelClassName}`}>{card.label}</span>
                </div>
                <p className={`text-2xl font-bold ${card.valueClassName}`}>{card.value}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="tablet:grid-cols-3 grid grid-cols-1 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.title} href={action.href}>
              <div
                className={`${action.color} rounded-lg p-6 text-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{action.title}</h3>
                    <p className="text-sm opacity-90">{action.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="laptop:grid-cols-3 grid grid-cols-1 gap-6">
        <div className="laptop:col-span-2 space-y-6">
          {outstandingMembers.length > 0 && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Outstanding Balances
                  </h3>
                  <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                    {outstandingMembers.length} members currently owe {formatAmount(outstandingAmount)} in total.
                  </p>
                  <Link href="/mess/dashboard/member-balances">
                    <Button variant="secondary" className="mt-2 text-xs">
                      View All Balances
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Activity
              </h2>
              <Link href="/mess/dashboard/member-balances">
                <Button variant="secondary" className="text-sm">
                  View More
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {recentActivity.length === 0 ? (
                <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500 dark:bg-gray-700/50 dark:text-gray-400">
                  No deposit or expense activity recorded in this period yet.
                </div>
              ) : (
                recentActivity.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div
                      key={activity.id}
                      className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-gray-600">
                        <Icon className={`h-4 w-4 ${activity.iconClassName}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                          {activity.description}
                        </p>
                        <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                          {activity.meta} •{' '}
                          {formatDistanceToNow(new Date(activity.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      <span className={`text-sm font-semibold ${activity.amountClassName}`}>
                        {formatAmount(activity.amount)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Outstanding Balances
            </h2>
            <div className="space-y-3">
              {topOutstandingMembers.length === 0 ? (
                <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-500 dark:bg-gray-700/50 dark:text-gray-400">
                  No members currently owe money.
                </div>
              ) : (
                topOutstandingMembers.map((member: SummaryMember) => (
                  <div
                    key={member.memberId}
                    className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        {member.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Due {formatAmount(member.due)} • {member.meals} meals
                      </p>
                    </div>
                    <span className="font-semibold text-red-600 dark:text-red-400">
                      {formatAmount(Math.abs(member.balance))}
                    </span>
                  </div>
                ))
              )}
            </div>
            <Link href="/mess/dashboard/member-balances">
              <Button variant="secondary" className="mt-4 w-full text-sm">
                View All Balances
              </Button>
            </Link>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Period Snapshot
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-500 dark:text-gray-400">Status</span>
                <span className="font-medium text-gray-900 capitalize dark:text-white">
                  {summary.period.status}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-500 dark:text-gray-400">Total Due</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatAmount(currentMonth.totalDue)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-500 dark:text-gray-400">Meal Expenses</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatAmount(currentMonth.mealExpenses)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-500 dark:text-gray-400">Adjustments</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatAmount(currentMonth.totalAdjustments)}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Quick Navigation
            </h2>
            <div className="space-y-2">
              <Link href="/mess/dashboard/all-months" className="block">
                <div className="rounded-lg p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">All Months</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">View historical data</p>
                </div>
              </Link>
              <Link href="/mess/dashboard/member-balances" className="block">
                <div className="rounded-lg p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Generate Reports
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Export statements</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
