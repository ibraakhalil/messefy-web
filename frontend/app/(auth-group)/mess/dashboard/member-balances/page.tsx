'use client';

import Link from 'next/link';
import {
  AlertCircle,
  Calculator,
  Download,
  Receipt,
  Users,
  Utensils,
  Wallet,
} from 'lucide-react';
import Button from '@/components/ui/button';
import { useWorkspace } from '@/providers/workspace-provider';
import { useCurrentWorkspaceSummary } from '@/hooks/use-summary';
import { useCurrentPeriod } from '@/hooks/use-periods';
import NoActivePeriodState from '@/components/dashboard/no-active-period-state';
import { formatCurrency } from '@/utils/format-currency';

export default function MemberBalancesPage() {
  const workspaceId = useWorkspace().member?.workspaceId || '';
  const { data: currentPeriod, isLoading: isLoadingPeriod } = useCurrentPeriod(workspaceId);
  const {
    data: summary,
    isLoading,
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

  if (isLoadingPeriod || isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="text-gray-500">Loading current balance summary...</div>
      </div>
    );
  }

  if (!currentPeriod) {
    return (
      <NoActivePeriodState
        title="Balances Are Available After Starting A Meal Month"
        description="Member due and balance statements are calculated only for an active meal month."
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
              <h2 className="font-semibold text-red-900">Failed to load member balances.</h2>
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

  const outstandingMembers = summary.members.filter((member) => member.balance < 0);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Member Balances</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Current period: {summary.period.month}/{summary.period.year}
          </p>
        </div>

        <Button variant="secondary" disabled className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          CSV Export
        </Button>
      </div>

      <div className="tablet:grid-cols-2 laptop:grid-cols-4 grid grid-cols-1 gap-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Members</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {summary.totals.memberCount}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-orange-100 p-3 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400">
              <Utensils className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Meals</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {summary.totals.totalMeals}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Deposits</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(summary.totals.totalDeposits)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-rose-100 p-3 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Meal Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(summary.totals.mealRate)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="tablet:flex-row tablet:items-center tablet:justify-between flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Period Totals</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Net balance: {formatCurrency(summary.totals.netBalance)}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
              Expenses: {formatCurrency(summary.totals.totalExpenses)}
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
              Due: {formatCurrency(summary.totals.totalDue)}
            </span>
          </div>
        </div>
      </div>

      {outstandingMembers.length > 0 && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Outstanding balances detected
              </h3>
              <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                {outstandingMembers.length} member currently owes money in this period.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Balance Breakdown
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-2.5 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Member
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Meals
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Deposits
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Due
                </th>
                <th className="px-4 py-2.5 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Balance
                </th>
                <th className="px-4 py-2.5 text-right text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              {summary.members.map((member) => (
                <tr key={member.memberId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white">
                    {member.name}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300">
                    {member.meals}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300">
                    {formatCurrency(member.deposits)}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300">
                    {formatCurrency(member.due)}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`font-semibold ${
                        member.balance < 0
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {formatCurrency(member.balance)}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    {member.balance < 0 ? (
                      <Link
                        href={`/mess/dashboard?type=deposit&member=${member.memberId}`}
                      >
                        <Button className="text-xs">Add Deposit</Button>
                      </Link>
                    ) : (
                      <span className="text-sm text-gray-400">Balanced</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="laptop:grid-cols-2 grid grid-cols-1 gap-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-2">
            <Wallet className="h-5 w-5 text-emerald-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Deposits</h3>
          </div>
          <div className="space-y-3">
            {summary.recentDeposits.length === 0 ? (
              <p className="text-sm text-gray-500">No deposits recorded yet.</p>
            ) : (
              summary.recentDeposits.map((deposit) => (
                <div
                  key={deposit.id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {deposit.memberName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(deposit.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(deposit.amount)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-2">
            <Calculator className="h-5 w-5 text-rose-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Expenses</h3>
          </div>
          <div className="space-y-3">
            {summary.recentExpenses.length === 0 ? (
              <p className="text-sm text-gray-500">No expenses recorded yet.</p>
            ) : (
              summary.recentExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{expense.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(expense.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className="font-semibold text-rose-600 dark:text-rose-400">
                    {formatCurrency(expense.amount)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
