'use client';

import NoActivePeriodState from '@/components/dashboard/no-active-period-state';
import Button from '@/components/ui/button';
import { usePeriodSelection } from '@/hooks/use-period-selection';
import { usePeriodSummary } from '@/hooks/use-summary';
import { useWorkspace } from '@/providers/workspace-provider';
import type { RecentDeposit, RecentExpense, SummaryMember } from '@/types/summary';
import { formatCurrency } from '@/utils/format-currency';
import { endOfMonth, formatDistanceToNow } from 'date-fns';
import { bn, enUS } from 'date-fns/locale';
import { AlertCircle, Calendar, Receipt, TrendingUp, Users, Utensils, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { PeriodSelect } from './period-select';

function getPeriodName(year: number, month: number, localeCode: string) {
  return new Date(year, month - 1).toLocaleString(localeCode, {
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

function mapDepositToActivity(deposit: RecentDeposit, defaultMeta: string): OverviewActivity {
  return {
    id: `deposit-${deposit.id}`,
    title: deposit.memberName,
    meta: deposit.note?.trim() || defaultMeta,
    amount: deposit.amount,
    createdAt: deposit.createdAt,
    type: 'deposit',
  };
}

function mapExpenseToActivity(expense: RecentExpense, defaultMeta: string): OverviewActivity {
  return {
    id: `expense-${expense.id}`,
    title: expense.title,
    meta: expense.note?.trim() || expense.allocationType || defaultMeta,
    amount: expense.amount,
    createdAt: expense.createdAt,
    type: 'expense',
  };
}

function MemberRow({ member }: { member: SummaryMember }) {
  const t = useTranslations('Mess.overview');
  const balanceClassName =
    member.balance < 0
      ? 'text-red-600 dark:text-red-400'
      : 'text-emerald-600 dark:text-emerald-400';

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{member.name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {member.meals} {t('meals')} • {formatCurrency(member.deposits)} {t('deposits')}
        </p>
      </div>
      <div className="text-right">
        <p className={`text-sm font-semibold ${balanceClassName}`}>
          {formatCurrency(member.balance)}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {t('due')} {formatCurrency(member.due)}
        </p>
      </div>
    </div>
  );
}

export default function MessOverview() {
  const t = useTranslations('Mess.overview');
  const locale = useLocale();
  const localeCode = locale === 'bn' ? 'bn-BD' : 'en-US';
  const dateFnsLocale = locale === 'bn' ? bn : enUS;

  const member = useWorkspace((state) => state.member);
  const workspaceId = member?.workspaceId || '';
  const canManage = Boolean(member && ['owner', 'manager'].includes(member.role));
  const {
    periods,
    selectedPeriod,
    selectedPeriodId,
    selectPeriod,
    isLoading: isLoadingPeriod,
    error: periodError,
    refetch: refetchPeriods,
  } = usePeriodSelection(workspaceId);
  const {
    data: summary,
    isLoading: isLoadingSummary,
    error: summaryError,
    refetch: refetchSummary,
  } = usePeriodSummary(selectedPeriodId);

  if (!workspaceId) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
        {t('noWorkspace')}
      </div>
    );
  }

  if (isLoadingPeriod || isLoadingSummary) {
    return (
      <div
        className="border-border-color bg-card-bg text-subtitle-color grid min-h-[40vh] place-items-center rounded-2xl border p-6 shadow-sm"
        role="status"
        aria-live="polite"
      >
        <div className="text-center">
          <div className="mx-auto mb-3 size-8 animate-spin rounded-full border-2 border-emerald-600/25 border-t-emerald-600 motion-reduce:animate-none" />
          {t('loadingStats')}
        </div>
      </div>
    );
  }

  if (periodError || summaryError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 text-red-600" />
          <div>
            <h2 className="font-semibold text-red-900">{t('failedToLoad')}</h2>
            <Button
              onClick={() => (periodError ? refetchPeriods() : refetchSummary())}
              variant="secondary"
              className="mt-3"
            >
              {t('tryAgain')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedPeriod) {
    return (
      <NoActivePeriodState
        title={t('noPeriodsTitle')}
        description={t('noPeriodsDesc')}
      />
    );
  }

  if (!summary) {
    return null;
  }

  const periodName = getPeriodName(summary.period.year, summary.period.month, localeCode);
  const daysRemaining = getDaysRemaining(summary.period.year, summary.period.month);
  const isOpenPeriod = selectedPeriod.status === 'open';
  const recentExpenses = summary.recentExpenses.slice(0, 4);
  const recentDeposits = summary.recentDeposits.slice(0, 4);
  const recentActivity = [
    ...summary.recentDeposits.map((d) => mapDepositToActivity(d, t('depositAdded'))),
    ...summary.recentExpenses.map((e) => mapExpenseToActivity(e, t('expenseAdded'))),
  ]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);
  const memberPreview = [...summary.members].sort((a, b) => a.balance - b.balance).slice(0, 6);

  const stats = [
    {
      label: t('stats.mealRate'),
      value: formatCurrency(summary.totals.mealRate),
      helper: t('stats.perMeal'),
      icon: Calendar,
      iconClassName: 'bg-blue-100 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400',
    },
    {
      label: t('stats.totalMeals'),
      value: String(summary.totals.totalMeals),
      helper: periodName,
      icon: Utensils,
      iconClassName: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400',
    },
    {
      label: t('stats.totalExpenses'),
      value: formatCurrency(summary.totals.totalExpenses),
      helper: t('stats.sharedMealCosts'),
      icon: Receipt,
      iconClassName: 'bg-rose-100 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400',
    },
    {
      label: t('stats.totalDeposits'),
      value: formatCurrency(summary.totals.totalDeposits),
      helper: t('stats.memberContributions'),
      icon: Wallet,
      iconClassName: 'bg-purple-100 text-purple-600 dark:bg-purple-950/80 dark:text-purple-400',
    },
    {
      label: t('stats.netBalance'),
      value: formatCurrency(summary.totals.netBalance),
      helper: summary.totals.netBalance >= 0 ? t('stats.surplus') : t('stats.shortfall'),
      icon: TrendingUp,
      iconClassName: 'bg-amber-100 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400',
    },
    {
      label: t('stats.activeMembers'),
      value: String(summary.totals.memberCount),
      helper: t('stats.includedInSummary'),
      icon: Users,
      iconClassName: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-950/80 dark:text-cyan-400',
    },
  ];

  return (
    <div className="space-y-6">
      <section className="tablet:p-7 relative overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-700 to-teal-700 p-6 text-white shadow-sm dark:border-emerald-900">
        <div
          className="pointer-events-none absolute -top-20 -right-16 size-56 rounded-full bg-white/10 blur-2xl"
          aria-hidden="true"
        />
        <div className="tablet:flex-row tablet:items-center tablet:justify-between flex flex-col gap-5">
          <div className="relative">
            <div className="flex items-center gap-2">
              <span
                className="size-2 rounded-full bg-emerald-200 shadow-[0_0_0_4px_rgba(167,243,208,0.15)]"
                aria-hidden="true"
              />
              <p className="text-sm font-semibold text-emerald-50">{t('selectedPeriod')}</p>
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs font-semibold text-white">
                {isOpenPeriod ? t('active') : t('closed')}
              </span>
            </div>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-balance text-white">
              {periodName}
            </h2>
            <p className="mt-2 text-sm text-emerald-50/85">
              {isOpenPeriod
                ? t('daysRemaining', { count: daysRemaining })
                : t('closedPeriod')}
            </p>
          </div>

          <div className="tablet:w-auto relative w-full">
            <div className="tablet:flex-nowrap flex flex-wrap items-end gap-2">
              <div className="tablet:w-56 tablet:flex-none min-w-0 flex-1">
                <PeriodSelect
                  id="overview-period"
                  periods={periods}
                  value={selectedPeriodId}
                  onChange={selectPeriod}
                />
              </div>
              <Link
                href={`/mess/months/${selectedPeriod.id}`}
                className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl border border-white/25 bg-white/10 px-4 text-sm font-semibold text-white transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-700"
              >
                {t('fullSummary')}
              </Link>
              {canManage && isOpenPeriod ? (
                <Link
                  href="/mess/dashboard"
                  className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-white px-4 text-sm font-semibold text-emerald-800 shadow-sm transition-colors hover:bg-emerald-50 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-emerald-700"
                >
                  {t('addData')}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section
        className="tablet:grid-cols-3 tablet:gap-4 grid grid-cols-2 gap-3"
        aria-label="Period summary"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="border-border-color bg-card-bg tablet:p-5 min-w-0 rounded-2xl border p-4 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="text-subtitle-color tablet:text-sm tablet:normal-case truncate text-xs font-semibold tracking-wide uppercase">
                  {stat.label}
                </h3>
                <span
                  className={`tablet:flex hidden size-9 shrink-0 items-center justify-center rounded-xl ${stat.iconClassName}`}
                >
                  <Icon className="size-[18px]" aria-hidden="true" />
                </span>
              </div>
              <p className="text-pure-color tablet:text-2xl truncate text-xl font-bold tabular-nums">
                {stat.value}
              </p>
              <p className="text-subtitle-color mt-1 truncate text-xs">{stat.helper}</p>
            </div>
          );
        })}
      </section>

      <div className="laptop:grid-cols-3 grid grid-cols-1 gap-6">
        <section className="border-border-color bg-card-bg tablet:p-6 rounded-2xl border p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('periodSnapshot')}</h2>
            {canManage ? (
              <Link
                href={`/mess/months/${selectedPeriod.id}`}
                className="border-border-color bg-card-bg text-pure-color hover:bg-secondary-bg rounded-lg border px-3 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              >
                {t('balances')}
              </Link>
            ) : null}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">{t('status')}</span>
              <span className="font-medium text-gray-900 capitalize dark:text-white">
                {summary.period.status === 'open' ? t('active') : t('closed')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">{t('mealExpenses')}</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatCurrency(summary.totals.mealExpenses)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">{t('totalDue')}</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatCurrency(summary.totals.totalDue)}
              </span>
            </div>
          </div>
        </section>

        <section className="border-border-color bg-card-bg tablet:p-6 rounded-2xl border p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            {t('recentExpenses')}
          </h2>

          <div className="space-y-3">
            {recentExpenses.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('noExpenses')}</p>
            ) : (
              recentExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                      {expense.title}
                    </p>
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                      {expense.note?.trim() || expense.allocationType || t('expenseAdded')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(expense.amount)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(expense.createdAt).toLocaleString(localeCode)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="border-border-color bg-card-bg tablet:p-6 rounded-2xl border p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            {t('recentDeposits')}
          </h2>

          <div className="space-y-3">
            {recentDeposits.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('noDeposits')}</p>
            ) : (
              recentDeposits.map((deposit) => (
                <div key={deposit.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                      {deposit.memberName}
                    </p>
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                      {deposit.note?.trim() || t('depositAdded')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(deposit.amount)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(deposit.createdAt).toLocaleString(localeCode)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <div className="laptop:grid-cols-2 grid grid-cols-1 gap-6">
        <section className="border-border-color bg-card-bg tablet:p-6 rounded-2xl border p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('memberSnapshot')}</h2>
            {canManage ? (
              <Link
                href={`/mess/months/${selectedPeriod.id}`}
                className="border-border-color bg-card-bg text-pure-color hover:bg-secondary-bg rounded-lg border px-3 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              >
                {t('viewAll')}
              </Link>
            ) : null}
          </div>

          <div className="space-y-3">
            {memberPreview.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('noMembersSummary')}
              </p>
            ) : (
              memberPreview.map((member) => <MemberRow key={member.memberId} member={member} />)
            )}
          </div>
        </section>

        <section className="border-border-color bg-card-bg tablet:p-6 rounded-2xl border p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('activitySnapshot')}
            </h2>
            {canManage ? (
              <Link
                href={`/mess/months/${selectedPeriod.id}`}
                className="border-border-color bg-card-bg text-pure-color hover:bg-secondary-bg rounded-lg border px-3 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
              >
                {t('moreActivity')}
              </Link>
            ) : null}
          </div>

          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('noActivity')}
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
                          locale: dateFnsLocale,
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
