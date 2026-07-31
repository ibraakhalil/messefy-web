'use client';

import Button from '@/components/ui/button';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import { useUpdatePeriod } from '@/hooks/use-periods';
import { usePeriodSummary } from '@/hooks/use-summary';
import { useWorkspace } from '@/providers/workspace-provider';
import { formatCurrency } from '@/utils/format-currency';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import {
  AlertCircle,
  Calculator,
  DollarSign,
  Download,
  LockKeyhole,
  Receipt,
  Utensils,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

function getDaysRemaining(year: number, month: number) {
  const now = new Date();
  const periodEnd = endOfMonth(new Date(year, month - 1));
  const msRemaining = periodEnd.getTime() - now.getTime();

  return Math.max(0, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)));
}

export default function PeriodDetailsPage() {
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false);
  const params = useParams<{ periodId: string }>();
  const periodId = typeof params.periodId === 'string' ? params.periodId : '';
  const member = useWorkspace((state) => state.member);
  const workspaceId = member?.workspaceId || '';
  const { data: summary, isLoading, error, refetch } = usePeriodSummary(periodId);
  const updatePeriodMutation = useUpdatePeriod();

  const handleCloseMonth = async () => {
    try {
      await updatePeriodMutation.mutateAsync({
        periodId,
        data: { status: 'closed' },
      });
      await refetch();
      setIsCloseDialogOpen(false);
    } catch {
      // The mutation displays the API error in a toast.
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

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="text-gray-500">Loading month details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-red-600" />
            <div>
              <h2 className="font-semibold text-red-900">Failed to load month details.</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button onClick={() => refetch()} variant="secondary">
                  Try Again
                </Button>
                <Link href="/mess/dashboard/all-months">
                  <Button variant="secondary">Back to All Months</Button>
                </Link>
              </div>
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
    mealExpenses: summary.totals.mealExpenses,
    status: summary.period.status,
  };

  const memberSummary = [...summary.members].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-6 p-6">
      <div className="tablet:flex-row tablet:items-center tablet:justify-between flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {periodData.currentPeriod}
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {periodData.startDate} to {periodData.endDate}
            {periodData.status === 'open' ? ` • ${periodData.daysRemaining} days remaining` : ''}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {member?.role === 'owner' && periodData.status === 'open' ? (
            <ResponsiveDialog open={isCloseDialogOpen} onOpenChange={setIsCloseDialogOpen}>
              <ResponsiveDialog.Trigger asChild>
                <Button variant="destructive" className="flex items-center gap-2">
                  <LockKeyhole className="h-4 w-4" aria-hidden="true" />
                  Close Month
                </Button>
              </ResponsiveDialog.Trigger>
              <ResponsiveDialog.Content className="max-w-md">
                <ResponsiveDialog.Header>
                  <ResponsiveDialog.Title>Close {periodData.currentPeriod}?</ResponsiveDialog.Title>
                  <ResponsiveDialog.Description>
                    Closing this month will lock new meals, deposits, and expenses. Review the
                    totals before continuing.
                  </ResponsiveDialog.Description>
                </ResponsiveDialog.Header>
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
                  This action finalizes the current month. Only the workspace owner can reopen it
                  later.
                </div>
                <ResponsiveDialog.Footer>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsCloseDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    isLoading={updatePeriodMutation.isPending}
                    onClick={handleCloseMonth}
                  >
                    {updatePeriodMutation.isPending ? 'Closing…' : 'Yes, Close Month'}
                  </Button>
                </ResponsiveDialog.Footer>
              </ResponsiveDialog.Content>
            </ResponsiveDialog>
          ) : null}
          <Button variant="secondary" disabled className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="tablet:grid-cols-2 laptop:grid-cols-4 grid grid-cols-1 gap-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Meals</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {periodData.totalMeals}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">recorded this period</p>
            </div>
            <div className="rounded-full bg-sky-100 p-3 dark:bg-sky-900/20">
              <Utensils className="h-6 w-6 text-sky-600 dark:text-sky-400" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Meal Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(periodData.mealRate)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">per meal</p>
            </div>
            <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900/20">
              <Utensils className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Deposits</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(periodData.totalDeposits)}
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
                {formatCurrency(periodData.totalExpenses)}
              </p>
            </div>
            <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
              <Receipt className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th
                scope="col"
                className="px-4 py-2.5 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
              >
                Member
              </th>
              <th
                scope="col"
                className="px-4 py-2.5 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
              >
                Meals
              </th>
              <th
                scope="col"
                className="px-4 py-2.5 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
              >
                Deposits
              </th>
              <th
                scope="col"
                className="px-4 py-2.5 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
              >
                Due
              </th>
              <th
                scope="col"
                className="px-4 py-2.5 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400"
              >
                Balance
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
            {memberSummary.map((memberItem) => (
              <tr key={memberItem.memberId}>
                <td className="px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white">
                  {memberItem.name}
                </td>
                <td className="px-4 py-2.5 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                  {memberItem.meals}
                </td>
                <td className="px-4 py-2.5 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                  {formatCurrency(memberItem.deposits)}
                </td>
                <td className="px-4 py-2.5 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                  {formatCurrency(memberItem.due)}
                </td>
                <td className="px-4 py-2.5 text-sm whitespace-nowrap">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                      memberItem.balance >= 0
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}
                  >
                    {formatCurrency(memberItem.balance)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="laptop:grid-cols-2 grid grid-cols-1 gap-6">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-2">
            <Wallet className="h-5 w-5 text-emerald-600" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Deposits</h2>
          </div>
          <div className="space-y-3">
            {summary.recentDeposits.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No deposits recorded yet.
              </p>
            ) : (
              summary.recentDeposits.map((deposit) => (
                <div
                  key={deposit.id}
                  className="flex items-center justify-between gap-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-gray-900 dark:text-white">
                      {deposit.memberName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(deposit.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className="shrink-0 font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(deposit.amount)}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-2">
            <Calculator className="h-5 w-5 text-rose-600" aria-hidden="true" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Expenses</h2>
          </div>
          <div className="space-y-3">
            {summary.recentExpenses.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No expenses recorded yet.
              </p>
            ) : (
              summary.recentExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between gap-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-gray-900 dark:text-white">
                      {expense.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(expense.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className="shrink-0 font-semibold text-rose-600 dark:text-rose-400">
                    {formatCurrency(expense.amount)}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
