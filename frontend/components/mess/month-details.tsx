'use client';

import Button from '@/components/ui/button';
import { usePeriodSummary } from '@/hooks/use-summary';
import { useWorkspace } from '@/providers/workspace-provider';
import type { RecentDeposit, RecentExpense } from '@/types/summary';
import { formatCurrency } from '@/utils/format-currency';
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CircleDollarSign,
  Receipt,
  Scale,
  Users,
  Utensils,
  WalletCards,
} from 'lucide-react';
import Link from 'next/link';

type ActivityItem = {
  id: string;
  title: string;
  description: string;
  amount: number;
  createdAt: string;
  type: 'deposit' | 'expense';
};

const monthFormatter = new Intl.DateTimeFormat('en-BD', {
  month: 'long',
  year: 'numeric',
});

const dateTimeFormatter = new Intl.DateTimeFormat('en-BD', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

function mapDeposit(deposit: RecentDeposit): ActivityItem {
  return {
    id: `deposit-${deposit.id}`,
    title: deposit.memberName,
    description: deposit.note?.trim() || 'Deposit added',
    amount: deposit.amount,
    createdAt: deposit.createdAt,
    type: 'deposit',
  };
}

function mapExpense(expense: RecentExpense): ActivityItem {
  return {
    id: `expense-${expense.id}`,
    title: expense.title,
    description: expense.note?.trim() || expense.allocationType || 'Expense added',
    amount: expense.amount,
    createdAt: expense.createdAt,
    type: 'expense',
  };
}

function MonthDetailsLoading() {
  return (
    <div className="space-y-6" role="status" aria-live="polite">
      <div className="bg-card-shade h-28 animate-pulse rounded-2xl motion-reduce:animate-none" />
      <div className="tablet:grid-cols-3 grid grid-cols-2 gap-4">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="bg-card-shade h-28 animate-pulse rounded-2xl motion-reduce:animate-none"
          />
        ))}
      </div>
      <span className="sr-only">Loading current month summary…</span>
    </div>
  );
}

function NoWorkspaceState() {
  return (
    <div className="grid min-h-[65vh] place-items-center">
      <div className="border-border-color bg-card-bg w-full max-w-lg rounded-2xl border p-8 text-center shadow-sm">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
          <CalendarDays className="size-7" aria-hidden="true" />
        </div>
        <h1 className="text-pure-color mt-5 text-2xl font-bold text-balance">
          No Active Mess Found
        </h1>
        <p className="text-subtitle-color mt-2 text-sm leading-6">
          Join or create a mess first. Your current month summary will appear here automatically.
        </p>
        <Link
          href="/mess"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
        >
          Go to Personal Hub
        </Link>
      </div>
    </div>
  );
}

export default function MonthDetails({ monthId }: { monthId: string }) {
  const member = useWorkspace((state) => state.member);
  const workspaceId = member?.workspaceId || '';
  const { data: summary, isLoading, error, refetch } = usePeriodSummary(monthId);

  if (!workspaceId) {
    return <NoWorkspaceState />;
  }

  if (isLoading) {
    return <MonthDetailsLoading />;
  }

  if (error || !summary) {
    return (
      <div className="grid min-h-[65vh] place-items-center">
        <div
          className="w-full max-w-lg rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm dark:border-red-900/60 dark:bg-red-950/40"
          role="alert"
        >
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
            <AlertCircle className="size-7" aria-hidden="true" />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-red-950 dark:text-red-100">
            Month Details Are Not Available
          </h1>
          <p className="mt-2 text-sm leading-6 text-red-800 dark:text-red-200">
            This month ID may be invalid, or you may not have access to its mess. Check the link and
            try again.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/mess"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-red-200 bg-white px-4 text-sm font-semibold text-red-800 transition-colors hover:bg-red-100 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:border-red-800 dark:bg-red-950"
            >
              Back to Mess
            </Link>
            <Button onClick={() => refetch()} variant="secondary">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const monthName = monthFormatter.format(new Date(summary.period.year, summary.period.month - 1));
  const sortedMembers = [...summary.members].sort((left, right) => left.balance - right.balance);
  const activity = [
    ...summary.recentDeposits.map(mapDeposit),
    ...summary.recentExpenses.map(mapExpense),
  ].sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());

  const stats = [
    {
      label: 'Total Due',
      value: formatCurrency(summary.totals.totalDue),
      helper: 'Overall member due',
      icon: CircleDollarSign,
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
    },
    {
      label: 'Total Meals',
      value: String(summary.totals.totalMeals),
      helper: 'Recorded this month',
      icon: CalendarDays,
      color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
    },
    {
      label: 'Total Deposits',
      value: formatCurrency(summary.totals.totalDeposits),
      helper: 'Member contributions',
      icon: WalletCards,
      color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
    },
    {
      label: 'Total Expenses',
      value: formatCurrency(summary.totals.totalExpenses),
      helper: 'All recorded costs',
      icon: Receipt,
      color: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
    },
    {
      label: 'Net Balance',
      value: formatCurrency(summary.totals.netBalance),
      helper: summary.totals.netBalance >= 0 ? 'Available balance' : 'Current shortfall',
      icon: Scale,
      color: 'bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300',
    },
    {
      label: 'Members',
      value: String(summary.totals.memberCount),
      helper: 'Active in this mess',
      icon: Users,
      color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300',
    },
  ];

  return (
    <div className="space-y-6">
      <header className="border-border-color bg-card-bg tablet:flex-row tablet:items-center tablet:justify-between tablet:p-7 flex flex-col gap-5 rounded-2xl border p-6 shadow-sm">
        <div className="min-w-0">
          <Link
            href="/mess"
            className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-800 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:text-emerald-400"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to Mess
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-pure-color text-3xl font-bold tracking-tight text-balance">
              {monthName} Summary
            </h1>
            <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 capitalize dark:bg-emerald-950/60 dark:text-emerald-300">
              {summary.period.status}
            </span>
          </div>
          <p className="text-subtitle-color mt-2 text-sm leading-6">
            Complete monthly totals, member balances, and recent financial activity for{' '}
            {member?.workspace.name}.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3 dark:bg-emerald-950/40">
          <Utensils
            className="size-8 text-emerald-700 dark:text-emerald-400"
            aria-hidden="true"
          />
          <div>
            <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Meal Rate</p>
            <p className="text-xl font-bold text-emerald-950 tabular-nums dark:text-emerald-100">
              {formatCurrency(summary.totals.mealRate)}
            </p>
          </div>
        </div>
      </header>

      <section
        className="tablet:grid-cols-3 tablet:gap-4 grid grid-cols-2 gap-3"
        aria-label="Month totals"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <article
              key={stat.label}
              className="border-border-color bg-card-bg tablet:p-5 min-w-0 rounded-2xl border p-4 shadow-sm"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <p className="text-subtitle-color tablet:text-sm tablet:normal-case text-xs font-semibold tracking-wide uppercase">
                  {stat.label}
                </p>
                <span
                  className={`tablet:flex hidden size-9 shrink-0 items-center justify-center rounded-xl ${stat.color}`}
                >
                  <Icon className="size-[18px]" aria-hidden="true" />
                </span>
              </div>
              <p className="text-pure-color tablet:text-2xl truncate text-xl font-bold tabular-nums">
                {stat.value}
              </p>
              <p className="text-subtitle-color mt-1 truncate text-xs">{stat.helper}</p>
            </article>
          );
        })}
      </section>

      <section className="border-border-color bg-card-bg overflow-hidden rounded-2xl border shadow-sm">
        <div className="border-border-color tablet:px-6 border-b px-5 py-4">
          <h2 className="text-pure-color text-lg font-bold">Member Balance Summary</h2>
          <p className="text-subtitle-color mt-1 text-sm">
            Members with the largest outstanding balance appear first.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="divide-border-color min-w-full divide-y">
            <thead className="bg-secondary-bg">
              <tr>
                {['Member', 'Meals', 'Deposits', 'Due', 'Balance'].map((label) => (
                  <th
                    key={label}
                    scope="col"
                    className="text-subtitle-color px-5 py-3 text-left text-xs font-semibold tracking-wide uppercase"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-border-color divide-y">
              {sortedMembers.map((memberItem) => (
                <tr
                  key={memberItem.memberId}
                  className="hover:bg-secondary-bg/70 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="min-w-40">
                      <p className="text-pure-color font-semibold">
                        {memberItem.name}
                        {memberItem.memberId === member?.id ? (
                          <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            You
                          </span>
                        ) : null}
                      </p>
                      <p className="text-subtitle-color mt-0.5 text-xs capitalize">
                        {memberItem.isOffline ? 'Offline member' : memberItem.role}
                      </p>
                    </div>
                  </td>
                  <td className="text-pure-color px-5 py-4 text-sm tabular-nums">
                    {memberItem.meals}
                  </td>
                  <td className="text-pure-color px-5 py-4 text-sm tabular-nums">
                    {formatCurrency(memberItem.deposits)}
                  </td>
                  <td className="text-pure-color px-5 py-4 text-sm tabular-nums">
                    {formatCurrency(memberItem.due)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`font-bold tabular-nums ${
                        memberItem.balance < 0
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-emerald-700 dark:text-emerald-400'
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
      </section>

      <section className="border-border-color bg-card-bg overflow-hidden rounded-2xl border shadow-sm">
        <div className="border-border-color tablet:px-6 border-b px-5 py-4">
          <h2 className="text-pure-color text-lg font-bold">Recent Financial Activity</h2>
          <p className="text-subtitle-color mt-1 text-sm">
            Latest deposits and expenses included in this month’s summary.
          </p>
        </div>
        {activity.length === 0 ? (
          <div className="text-subtitle-color px-6 py-10 text-center text-sm">
            No deposits or expenses have been recorded this month.
          </div>
        ) : (
          <div className="divide-border-color divide-y">
            {activity.map((item) => {
              const isExpense = item.type === 'expense';
              const Icon = isExpense ? Receipt : WalletCards;
              return (
                <article key={item.id} className="tablet:px-6 flex items-center gap-4 px-5 py-4">
                  <span
                    className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                      isExpense
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-pure-color truncate text-sm font-semibold">{item.title}</h3>
                    <p className="text-subtitle-color truncate text-xs">
                      {item.description} <span aria-hidden="true">•</span>{' '}
                      {dateTimeFormatter.format(new Date(item.createdAt))}
                    </p>
                  </div>
                  <p
                    className={`shrink-0 text-sm font-bold tabular-nums ${
                      isExpense
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-emerald-700 dark:text-emerald-400'
                    }`}
                  >
                    {isExpense ? '−' : '+'}
                    {formatCurrency(item.amount)}
                  </p>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
