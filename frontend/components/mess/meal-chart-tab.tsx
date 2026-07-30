'use client';

import Button from '@/components/ui/button';
import { useMealChart } from '@/hooks/use-meals';
import { usePeriodSelection } from '@/hooks/use-period-selection';
import { useWorkspace } from '@/providers/workspace-provider';
import { AlertCircle, CalendarDays, ChartNoAxesColumn, Users, Utensils } from 'lucide-react';
import { useMemo } from 'react';
import { PeriodSelect } from './period-select';

type MemberSummary = {
  id: string;
  name: string;
  total: number;
};

type DailySummary = {
  date: string;
  total: number;
  byMember: Map<string, number>;
};

const periodFormatter = new Intl.DateTimeFormat('en-BD', {
  month: 'long',
  year: 'numeric',
});

const dayFormatter = new Intl.DateTimeFormat('en-BD', {
  day: 'numeric',
  month: 'short',
});

const weekdayFormatter = new Intl.DateTimeFormat('en-BD', {
  weekday: 'short',
});

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function fromDateKey(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function getPeriodDays(year: number, month: number) {
  const today = new Date();
  const periodStart = new Date(year, month - 1, 1);
  const periodEnd = new Date(year, month, 0);
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const rangeEnd = todayStart < periodEnd ? todayStart : periodEnd;

  if (periodStart > rangeEnd) {
    return [];
  }

  const days: string[] = [];
  for (
    const cursor = new Date(periodStart);
    cursor <= rangeEnd;
    cursor.setDate(cursor.getDate() + 1)
  ) {
    days.push(toDateKey(cursor));
  }
  return days.reverse();
}

function MealChartLoading() {
  return (
    <div className="space-y-4" role="status" aria-live="polite">
      <div className="bg-card-shade h-32 animate-pulse rounded-2xl motion-reduce:animate-none" />
      <div className="tablet:grid-cols-4 grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="bg-card-shade h-24 animate-pulse rounded-2xl motion-reduce:animate-none"
          />
        ))}
      </div>
      <div className="bg-card-shade h-80 animate-pulse rounded-2xl motion-reduce:animate-none" />
      <span className="sr-only">Loading meal chart…</span>
    </div>
  );
}

export default function MealChartTab() {
  const workspaceId = useWorkspace().member?.workspaceId || '';
  const {
    periods,
    selectedPeriod,
    selectedPeriodId,
    selectPeriod,
    isLoading: isLoadingPeriods,
    error: periodError,
    refetch: refetchPeriods,
  } = usePeriodSelection(workspaceId);
  const {
    data: mealChart,
    isLoading: isLoadingMeals,
    error: mealsError,
    refetch: refetchMeals,
  } = useMealChart(selectedPeriod?.id || '');

  const chart = useMemo(() => {
    if (!selectedPeriod) {
      return null;
    }

    const memberMap = new Map<string, MemberSummary>(
      (mealChart?.members || []).map((member) => [
        member.id,
        { id: member.id, name: member.name, total: 0 },
      ]),
    );
    const mealMap = new Map<string, Map<string, number>>();

    for (const entry of mealChart?.entries || []) {
      const mealCount = entry.breakfast + entry.lunch + entry.dinner;
      const existingMember = memberMap.get(entry.memberId);
      if (existingMember) {
        existingMember.total += mealCount;
      }

      const dayMeals = mealMap.get(entry.date) || new Map<string, number>();
      dayMeals.set(entry.memberId, (dayMeals.get(entry.memberId) || 0) + mealCount);
      mealMap.set(entry.date, dayMeals);
    }

    const members = Array.from(memberMap.values()).sort(
      (left, right) => right.total - left.total || left.name.localeCompare(right.name),
    );
    const days = getPeriodDays(selectedPeriod.year, selectedPeriod.month).map((date) => {
      const byMember = mealMap.get(date) || new Map<string, number>();
      let total = 0;
      for (const count of byMember.values()) {
        total += count;
      }
      return { date, total, byMember } satisfies DailySummary;
    });
    const totalMeals = members.reduce((sum, member) => sum + member.total, 0);
    const recordedDays = days.reduce((count, day) => count + (day.total > 0 ? 1 : 0), 0);

    return {
      members,
      days,
      totalMeals,
      recordedDays,
      average: days.length > 0 ? totalMeals / days.length : 0,
    };
  }, [selectedPeriod, mealChart]);

  if (isLoadingPeriods || (selectedPeriod && isLoadingMeals)) {
    return <MealChartLoading />;
  }

  if (periodError || mealsError) {
    return (
      <div
        className="rounded-2xl border border-red-200 bg-red-50 p-7 text-center dark:border-red-900/60 dark:bg-red-950/40"
        role="alert"
      >
        <AlertCircle className="mx-auto size-8 text-red-600 dark:text-red-400" aria-hidden="true" />
        <h2 className="mt-3 font-bold text-red-950 dark:text-red-100">Meal chart could not load</h2>
        <p className="mt-1 text-sm text-red-800 dark:text-red-200">
          Please check your connection and try again.
        </p>
        <Button
          variant="secondary"
          className="mt-4"
          onClick={() => (periodError ? refetchPeriods() : refetchMeals())}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!selectedPeriod || !chart) {
    return (
      <div className="border-border-color bg-card-bg rounded-2xl border p-8 text-center shadow-sm">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
          <CalendarDays className="size-7" aria-hidden="true" />
        </span>
        <h2 className="text-pure-color mt-4 text-xl font-bold">No meal periods yet</h2>
        <p className="text-subtitle-color mx-auto mt-2 max-w-md text-sm leading-6">
          Start a meal period first. Its daily meal chart will appear here automatically.
        </p>
      </div>
    );
  }

  const periodDate = new Date(selectedPeriod.year, selectedPeriod.month - 1);
  const todayKey = toDateKey(new Date());
  const isOpenPeriod = selectedPeriod.status === 'open';
  const selectedMonthLabel = periodFormatter.format(periodDate);
  const statItems = [
    { label: 'Total meals', value: chart.totalMeals, icon: Utensils },
    { label: 'Days recorded', value: chart.recordedDays, icon: CalendarDays },
    { label: 'Average / day', value: chart.average.toFixed(1), icon: ChartNoAxesColumn },
    { label: 'Members', value: chart.members.length, icon: Users },
  ];

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-2xl border border-emerald-800 bg-gradient-to-br from-emerald-800 to-teal-700 p-6 text-white shadow-sm">
        <div
          className="pointer-events-none absolute -top-20 -right-12 size-52 rounded-full bg-white/10 blur-2xl"
          aria-hidden="true"
        />
        <div className="tablet:flex-row tablet:items-end tablet:justify-between relative flex flex-col gap-5">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-emerald-100">Meal period</p>
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs font-semibold text-white">
                {isOpenPeriod ? 'Active' : 'Closed'}
              </span>
            </div>
            <h2 className="mt-1 text-2xl font-bold">{selectedMonthLabel} Meal Chart</h2>
          </div>

          <div className="tablet:w-56 w-full shrink-0">
            <PeriodSelect
              id="meal-chart-period"
              periods={periods}
              value={selectedPeriodId}
              onChange={selectPeriod}
            />
          </div>
        </div>
      </section>

      <section
        className="tablet:grid-cols-4 grid grid-cols-2 gap-3"
        aria-label="Meal chart summary"
      >
        {statItems.map((item) => {
          const Icon = item.icon;
          return (
            <article
              key={item.label}
              className="border-border-color bg-card-bg min-w-0 rounded-2xl border p-4 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-subtitle-color truncate text-xs font-semibold tracking-wide uppercase">
                  {item.label}
                </p>
                <span className="tablet:flex hidden size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
              </div>
              <p className="text-pure-color mt-2 text-2xl font-bold tabular-nums">{item.value}</p>
            </article>
          );
        })}
      </section>

      {chart.members.length === 0 ? (
        <section className="border-border-color bg-card-bg rounded-2xl border p-10 text-center shadow-sm">
          <Utensils className="text-subtitle-color mx-auto size-8" aria-hidden="true" />
          <h3 className="text-pure-color mt-3 font-bold">No meals recorded yet</h3>
          <p className="text-subtitle-color mt-1 text-sm">
            Daily member breakdowns will appear as soon as the first meal is added.
          </p>
        </section>
      ) : (
        <section className="border-border-color bg-card-bg overflow-hidden rounded-2xl border shadow-sm">
          <div className="tablet:hidden divide-border-color divide-y">
            {chart.days.map((day) => {
              const date = fromDateKey(day.date);
              return (
                <article key={day.date} className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-pure-color font-bold">
                        {day.date === todayKey ? 'Today' : dayFormatter.format(date)}
                      </p>
                      <p className="text-subtitle-color text-xs">{weekdayFormatter.format(date)}</p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-800 tabular-nums dark:bg-emerald-950 dark:text-emerald-300">
                      {day.total} total
                    </span>
                  </div>
                  {day.total === 0 ? (
                    <p className="text-subtitle-color mt-4 text-sm">No meals recorded.</p>
                  ) : (
                    <dl className="mt-4 grid grid-cols-2 gap-2">
                      {chart.members.map((member) => {
                        const count = day.byMember.get(member.id) || 0;
                        return count > 0 ? (
                          <div
                            key={member.id}
                            className="bg-secondary-bg flex min-w-0 items-center justify-between gap-2 rounded-lg px-3 py-2"
                          >
                            <dt className="text-pure-color truncate text-sm">{member.name}</dt>
                            <dd className="text-pure-color font-bold tabular-nums">{count}</dd>
                          </div>
                        ) : null;
                      })}
                    </dl>
                  )}
                </article>
              );
            })}
          </div>

          <div className="tablet:block hidden overflow-x-auto">
            <table className="w-full min-w-max border-collapse text-left text-sm">
              <caption className="sr-only">
                Daily total meals and individual member meal counts for {selectedMonthLabel}
              </caption>
              <thead className="bg-secondary-bg text-subtitle-color">
                <tr>
                  <th
                    scope="col"
                    className="bg-secondary-bg sticky left-0 z-20 min-w-32 px-5 py-3 font-semibold"
                  >
                    Date
                  </th>
                  <th scope="col" className="px-4 py-3 text-center font-semibold">
                    Day total
                  </th>
                  {chart.members.map((member) => (
                    <th
                      key={member.id}
                      scope="col"
                      className="min-w-32 px-4 py-3 text-center font-semibold"
                    >
                      <span className="text-pure-color block max-w-36 truncate">{member.name}</span>
                      <span className="mt-0.5 block text-xs font-normal">
                        {member.total} in period
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-border-color divide-y">
                {chart.days.map((day) => {
                  const date = fromDateKey(day.date);
                  const isToday = day.date === todayKey;
                  return (
                    <tr
                      key={day.date}
                      className={isToday ? 'bg-emerald-50/60 dark:bg-emerald-950/20' : ''}
                    >
                      <th
                        scope="row"
                        className={`sticky left-0 z-10 px-5 py-3 font-semibold ${
                          isToday ? 'bg-emerald-50 dark:bg-emerald-950' : 'bg-card-bg'
                        }`}
                      >
                        <span className="text-pure-color block">
                          {isToday ? 'Today' : dayFormatter.format(date)}
                        </span>
                        <span className="text-subtitle-color block text-xs font-normal">
                          {weekdayFormatter.format(date)}
                        </span>
                      </th>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex min-w-9 justify-center rounded-full bg-emerald-100 px-2.5 py-1 font-bold text-emerald-800 tabular-nums dark:bg-emerald-950 dark:text-emerald-300">
                          {day.total}
                        </span>
                      </td>
                      {chart.members.map((member) => {
                        const count = day.byMember.get(member.id) || 0;
                        return (
                          <td
                            key={member.id}
                            className={`px-4 py-3 text-center font-semibold tabular-nums ${
                              count > 0 ? 'text-pure-color' : 'text-subtitle-secondary'
                            }`}
                          >
                            {count || '—'}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
