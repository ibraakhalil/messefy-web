'use client';

import NoActivePeriodState from '@/components/dashboard/no-active-period-state';
import { DeleteModal } from '@/components/modals/delete-modal';
import Button from '@/components/ui/button';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import { useCurrentPeriod, useDeletePeriod, useUpdatePeriod } from '@/hooks/use-periods';
import { usePeriodSummary } from '@/hooks/use-summary';
import { useWorkspace } from '@/providers/workspace-provider';
import type { RecentDeposit, RecentExpense } from '@/types/summary';
import { endOfMonth, format, formatDistanceToNow, startOfMonth } from 'date-fns';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Eye,
  Receipt,
  TrendingUp,
  Users,
  Utensils,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { Fragment, useState } from 'react';

function formatAmount(amount: number) {
  return `$${amount.toFixed(2)}`;
}

function getDaysRemaining(year: number, month: number) {
  const now = new Date();
  const periodEnd = endOfMonth(new Date(year, month - 1));
  const msRemaining = periodEnd.getTime() - now.getTime();

  return Math.max(0, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)));
}

type ActivityRow = {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: 'deposit' | 'expense';
};

function mapDepositToActivity(deposit: RecentDeposit): ActivityRow {
  return {
    id: `deposit-${deposit.id}`,
    description: deposit.memberName,
    amount: deposit.amount,
    date: deposit.createdAt,
    category: deposit.note?.trim() || 'Deposit',
    type: 'deposit',
  };
}

function mapExpenseToActivity(expense: RecentExpense): ActivityRow {
  return {
    id: `expense-${expense.id}`,
    description: expense.title,
    amount: expense.amount,
    date: expense.createdAt,
    category: expense.note?.trim() || expense.allocationType || 'Expense',
    type: 'expense',
  };
}

export default function CurrentMonthPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'transactions'>('overview');
  const { member } = useWorkspace();
  const workspaceId = member?.workspaceId || '';
  const {
    data: currentPeriod,
    isLoading: isLoadingPeriod,
    refetch: refetchCurrentPeriod,
  } = useCurrentPeriod(workspaceId);
  const {
    data: summary,
    isLoading: isLoadingSummary,
    error,
    refetch: refetchSummary,
  } = usePeriodSummary(currentPeriod?.id || '');

  const updatePeriodMutation = useUpdatePeriod();
  const deletePeriodMutation = useDeletePeriod();

  const handleClosePeriod = async () => {
    if (!currentPeriod) return;

    try {
      await updatePeriodMutation.mutateAsync({
        periodId: currentPeriod.id,
        data: { status: 'closed' },
      });
      refetchCurrentPeriod();
      refetchSummary();
    } catch {
      // Error is handled by the mutation
    }
  };

  const handleDeletePeriod = async () => {
    if (!currentPeriod) return;

    try {
      await deletePeriodMutation.mutateAsync(currentPeriod.id);
      refetchCurrentPeriod();
    } catch {
      // Error is handled by the mutation
    }
  };

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
        <div className="text-gray-500">Loading current period...</div>
      </div>
    );
  }

  if (!currentPeriod) {
    return (
      <NoActivePeriodState
        title="Current Month View Needs An Active Period"
        description="Open a meal month first to track current totals, expenses, deposits, and member balances."
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
              <h2 className="font-semibold text-red-900">Failed to load current month data.</h2>
              <Button onClick={() => refetchSummary()} variant="secondary" className="mt-3">
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

  const periodDate = new Date(summary.period.year, summary.period.month - 1);
  const periodData = {
    currentPeriod: format(periodDate, 'MMMM yyyy'),
    startDate: format(startOfMonth(periodDate), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(periodDate), 'yyyy-MM-dd'),
    daysRemaining: getDaysRemaining(summary.period.year, summary.period.month),
    totalMembers: summary.totals.memberCount,
    totalDeposits: summary.totals.totalDeposits,
    totalExpenses: summary.totals.totalExpenses,
    totalMeals: summary.totals.totalMeals,
    balance: summary.totals.netBalance,
    mealRate: summary.totals.mealRate,
    totalDue: summary.totals.totalDue,
    totalAdjustments: summary.totals.totalAdjustments,
    mealExpenses: summary.totals.mealExpenses,
    status: summary.period.status,
  };

  const memberSummary = [...summary.members].sort((a, b) => a.name.localeCompare(b.name));
  const outstandingMembers = memberSummary.filter((memberItem) => memberItem.balance < 0);
  const recentTransactions = [
    ...summary.recentDeposits.map(mapDepositToActivity),
    ...summary.recentExpenses.map(mapExpenseToActivity),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'members', label: 'Member Summary', icon: Users },
    { id: 'transactions', label: 'Recent Activity', icon: Receipt },
  ] as const;

  return (
    <div className="space-y-6 p-6">
      <div className="tablet:flex-row tablet:items-center tablet:justify-between flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {periodData.currentPeriod}
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {periodData.startDate} to {periodData.endDate} • {periodData.daysRemaining} days
            remaining
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {currentPeriod.status === 'open' && (
            <Fragment>
              <ResponsiveDialog>
                <ResponsiveDialog.Trigger asChild>
                  <Button
                    disabled={updatePeriodMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="size-4" />
                    Close Period
                  </Button>
                </ResponsiveDialog.Trigger>
                <ResponsiveDialog.Content>
                  <DeleteModal
                    subtitle="Are you sure you want to close the current period?"
                    onDelete={handleClosePeriod}
                  />
                </ResponsiveDialog.Content>
              </ResponsiveDialog>
              <ResponsiveDialog>
                <ResponsiveDialog.Trigger asChild>
                  <Button
                    disabled={deletePeriodMutation.isPending}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </ResponsiveDialog.Trigger>
                <ResponsiveDialog.Content>
                  <DeleteModal
                    subtitle="Are you sure you want to delete the current period?"
                    onDelete={handleDeletePeriod}
                  />
                </ResponsiveDialog.Content>
              </ResponsiveDialog>
            </Fragment>
          )}

          <Button variant="secondary" disabled className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${
            periodData.status === 'open'
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
          }`}
        >
          {periodData.status === 'open' ? (
            <>
              <CheckCircle className="h-3 w-3" />
              Active
            </>
          ) : (
            <>
              <Clock className="h-3 w-3" />
              Closed
            </>
          )}
        </div>
      </div>

      <div className="tablet:grid-cols-2 laptop:grid-cols-4 grid grid-cols-1 gap-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Members</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {periodData.totalMembers}
              </p>
            </div>
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Deposits</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatAmount(periodData.totalDeposits)}
              </p>
            </div>
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatAmount(periodData.totalExpenses)}
              </p>
            </div>
            <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
              <Receipt className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Current Balance
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatAmount(periodData.balance)}
              </p>
            </div>
            <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/20">
              <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="laptop:grid-cols-3 grid grid-cols-1 gap-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Meal Rate</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatAmount(periodData.mealRate)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">per meal</p>
            </div>
            <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900/20">
              <Utensils className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Meals</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {periodData.totalMeals}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">recorded this period</p>
            </div>
            <div className="rounded-full bg-sky-100 p-3 dark:bg-sky-900/20">
              <Utensils className="h-8 w-8 text-sky-600 dark:text-sky-400" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Due</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatAmount(periodData.totalDue)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">Meal Expenses</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatAmount(periodData.mealExpenses)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">Adjustments</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatAmount(periodData.totalAdjustments)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600 dark:border-purple-400 dark:text-purple-400'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="laptop:grid-cols-2 grid grid-cols-1 gap-6">
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Quick Actions
              </h3>
              <div className="flex flex-col gap-4">
                <Link href="/mess/dashboard/data-entry?type=meal">
                  <Button className="w-full justify-start">
                    <Utensils className="mr-2 h-4 w-4" />
                    Record Meals
                  </Button>
                </Link>
                <Link href="/mess/dashboard/data-entry?type=expense">
                  <Button className="w-full justify-start">
                    <Receipt className="mr-2 h-4 w-4" />
                    Add Expense
                  </Button>
                </Link>
                <Link href="/mess/dashboard/data-entry?type=deposit">
                  <Button className="w-full justify-start">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Record Deposit
                  </Button>
                </Link>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Period Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Status:</span>
                  <span
                    className={`font-medium ${
                      periodData.status === 'open'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {periodData.status === 'open' ? 'Active' : 'Closed'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Start Date:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {periodData.startDate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">End Date:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {periodData.endDate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Days Remaining:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {periodData.daysRemaining}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Outstanding Members:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {outstandingMembers.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                  >
                    Member
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                  >
                    Meals
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                  >
                    Deposits
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                  >
                    Adjustments
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                  >
                    Due
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                  >
                    Balance
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                {memberSummary.map((memberItem) => (
                  <tr key={memberItem.memberId}>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {memberItem.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {memberItem.email ||
                            (memberItem.isOffline ? 'Offline member' : memberItem.role)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                      {memberItem.meals}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                      {formatAmount(memberItem.deposits)}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                      {formatAmount(memberItem.adjustments)}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                      {formatAmount(memberItem.due)}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          memberItem.balance >= 0
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}
                      >
                        {formatAmount(memberItem.balance)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm whitespace-nowrap">
                      {memberItem.balance < 0 ? (
                        <Link
                          href={`/mess/dashboard/data-entry?type=deposit&member=${memberItem.memberId}`}
                        >
                          <Button className="text-xs">Add Deposit</Button>
                        </Link>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">Balanced</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-4">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900 dark:border-blue-900/40 dark:bg-blue-900/20 dark:text-blue-100">
              Recent activity is built from real deposits and expenses. Meal-entry history is not
              available from the current summary API yet.
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
                    >
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                  {recentTransactions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                      >
                        No deposit or expense activity recorded yet.
                      </td>
                    </tr>
                  ) : (
                    recentTransactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-white">
                          {transaction.description}
                        </td>
                        <td
                          className={`px-6 py-4 text-sm whitespace-nowrap ${
                            transaction.type === 'expense'
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-green-600 dark:text-green-400'
                          }`}
                        >
                          {transaction.type === 'expense' ? '-' : '+'}
                          {formatAmount(transaction.amount)}
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                          <div>{format(new Date(transaction.date), 'yyyy-MM-dd')}</div>
                          <div className="text-xs">
                            {formatDistanceToNow(new Date(transaction.date), { addSuffix: true })}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                          {transaction.category}
                        </td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap capitalize text-gray-500 dark:text-gray-400">
                          {transaction.type}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
