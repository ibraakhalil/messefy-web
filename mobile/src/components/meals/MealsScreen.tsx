import React, { useState, useMemo } from 'react';
import {
  Utensils,
  CalendarDays,
  Users,
  TrendingUp,
  Plus,
  Search,
  RefreshCw,
  SunMedium,
  MoonStar,
  Edit2,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  getBanglaPeriodName,
  getTodayDateString,
  formatBanglaDate,
  formatBanglaWeekday,
  toBanglaNumber,
} from '@/lib/period-utils';
import { useMealChart } from '@/hooks/use-meals';
import { MealEntryModal } from './MealEntryModal';
import type { MealChartEntry } from '@/types/meal';

interface MealsScreenProps {
  workspaceId: string;
  periodId: string;
  periodYear: number;
  periodMonth: number;
  currentMemberId: string;
  isManager: boolean;
  onSuccessToast?: (msg: string) => void;
}

interface DaySummary {
  date: string;
  total: number;
  isToday: boolean;
  memberEntries: Array<{
    memberId: string;
    memberName: string;
    breakfast: number;
    lunch: number;
    dinner: number;
    total: number;
  }>;
}

function getDaysCountInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function createDateKey(year: number, month: number, day: number): string {
  const m = String(month).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

export const MealsScreen: React.FC<MealsScreenProps> = ({
  workspaceId,
  periodId,
  periodYear,
  periodMonth,
  currentMemberId,
  isManager,
  onSuccessToast,
}) => {
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [searchMember, setSearchMember] = useState('');

  const {
    data: chartData,
    isLoading,
    isRefetching,
    error,
    refetch,
  } = useMealChart(periodId);

  const todayStr = getTodayDateString();

  // Generate all days in the period from 1st to today (or end of month)
  const daysList = useMemo<DaySummary[]>(() => {
    if (!chartData) return [];

    const memberMap = new Map<string, string>(
      (chartData.members || []).map((m) => [m.id, m.name])
    );

    // Group entries by date
    const entriesByDate = new Map<string, MealChartEntry[]>();
    for (const entry of chartData.entries || []) {
      const list = entriesByDate.get(entry.date) || [];
      list.push(entry);
      entriesByDate.set(entry.date, list);
    }

    // Determine day range for the month
    const [todayYear, todayMonth, todayDay] = todayStr.split('-').map(Number);
    const isCurrentMonthPeriod =
      todayYear === periodYear && todayMonth === periodMonth;

    const lastDayOfMonth = getDaysCountInMonth(periodYear, periodMonth);
    const maxDay = isCurrentMonthPeriod
      ? Math.min(todayDay || 1, lastDayOfMonth)
      : lastDayOfMonth;

    const days: DaySummary[] = [];

    // Walk backwards from maxDay down to 1
    for (let day = maxDay; day >= 1; day--) {
      const dateKey = createDateKey(periodYear, periodMonth, day);
      const dayEntries = entriesByDate.get(dateKey) || [];

      let dayTotal = 0;
      const memberEntries = dayEntries
        .map((entry) => {
          const total = entry.breakfast + entry.lunch + entry.dinner;
          dayTotal += total;
          return {
            memberId: entry.memberId,
            memberName: memberMap.get(entry.memberId) || 'সদস্য',
            breakfast: entry.breakfast,
            lunch: entry.lunch,
            dinner: entry.dinner,
            total,
          };
        })
        .filter((item) => item.total > 0);

      days.push({
        date: dateKey,
        total: dayTotal,
        isToday: dateKey === todayStr,
        memberEntries,
      });
    }

    return days;
  }, [chartData, periodYear, periodMonth, todayStr]);

  // Filtered by search input
  const filteredDays = useMemo(() => {
    if (!searchMember.trim()) return daysList;
    const query = searchMember.trim().toLowerCase();

    return daysList.map((day) => ({
      ...day,
      memberEntries: day.memberEntries.filter((m) =>
        m.memberName.toLowerCase().includes(query)
      ),
    }));
  }, [daysList, searchMember]);

  // Overall Statistics
  const totalMeals = useMemo(() => {
    if (!chartData?.entries) return 0;
    return chartData.entries.reduce(
      (sum, e) => sum + e.breakfast + e.lunch + e.dinner,
      0
    );
  }, [chartData]);

  const recordedDays = useMemo(() => {
    return daysList.filter((d) => d.total > 0).length;
  }, [daysList]);

  const avgMealsPerDay = recordedDays > 0 ? (totalMeals / recordedDays).toFixed(1) : '০';

  const periodName = getBanglaPeriodName(periodYear, periodMonth);

  return (
    <div className="space-y-4 pb-6">
      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-emerald-800/40 bg-gradient-to-br from-emerald-800 via-teal-800 to-emerald-950 p-5 text-white shadow-lg">
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-100">
                মিল শিট ও হিসাব
              </span>
              <span className="rounded-full bg-emerald-500/30 px-2 py-0.5 text-[11px] font-medium text-emerald-200">
                চলতি মাস
              </span>
            </div>
            <h1 className="mt-1.5 text-2xl font-black tracking-tight">{periodName}</h1>
            <p className="mt-0.5 text-xs text-emerald-100/80">
              প্রতিদিনের মিল গণনা ও মাসিক শিট
            </p>
          </div>

          <button
            onClick={() => refetch()}
            disabled={isRefetching}
            className="flex size-9 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95"
            aria-label="রিফ্রেশ করুন"
          >
            <RefreshCw className={cn('size-4', isRefetching && 'animate-spin')} />
          </button>
        </div>

        {/* 4 Stats Cards */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div className="rounded-2xl bg-white/10 p-2.5 backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-emerald-200">
              <Utensils className="size-3.5" />
              <span className="text-[10px] font-medium">মোট মিল</span>
            </div>
            <p className="mt-1 text-lg font-bold tabular-nums">
              {toBanglaNumber(totalMeals)}
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-2.5 backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-emerald-200">
              <CalendarDays className="size-3.5" />
              <span className="text-[10px] font-medium">রেকর্ডকৃত দিন</span>
            </div>
            <p className="mt-1 text-lg font-bold tabular-nums">
              {toBanglaNumber(recordedDays)} দিন
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-2.5 backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-emerald-200">
              <TrendingUp className="size-3.5" />
              <span className="text-[10px] font-medium">দৈনিক গড়</span>
            </div>
            <p className="mt-1 text-lg font-bold tabular-nums">
              {toBanglaNumber(avgMealsPerDay)}
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 p-2.5 backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-emerald-200">
              <Users className="size-3.5" />
              <span className="text-[10px] font-medium">মেম্বার সংখ্যা</span>
            </div>
            <p className="mt-1 text-lg font-bold tabular-nums">
              {toBanglaNumber(chartData?.members.length || 0)} জন
            </p>
          </div>
        </div>
      </section>

      {/* Action Row & Search */}
      <div className="flex items-center justify-between gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-subtitle-color" />
          <input
            type="text"
            placeholder="মেম্বার খুঁজুন..."
            value={searchMember}
            onChange={(e) => setSearchMember(e.target.value)}
            className="w-full rounded-2xl border border-border-color bg-card-bg py-2 pl-8.5 pr-3 text-xs text-pure-color placeholder:text-subtitle-color focus:border-primary focus:outline-hidden"
          />
        </div>

        <button
          onClick={() => setIsEntryModalOpen(true)}
          className="flex shrink-0 items-center gap-1.5 rounded-2xl bg-primary px-3.5 py-2 text-xs font-bold text-white shadow-xs transition active:scale-95"
        >
          <Plus className="size-4" />
          <span>মিল এন্ট্রি</span>
        </button>
      </div>

      {/* Daily Breakdown List */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-subtitle-color">
            প্রতিদিনের মিল তালিকা
          </h2>
          <span className="text-[11px] text-subtitle-color">
            {toBanglaNumber(filteredDays.length)} দিন প্রদর্শিত
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 rounded-2xl border border-border-color bg-card-bg p-4 animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center dark:border-rose-900/60 dark:bg-rose-950/30">
            <AlertCircle className="mx-auto size-7 text-rose-500" />
            <p className="mt-2 text-xs font-bold text-rose-900 dark:text-rose-100">
              মিল তালিকা লোড করা যায়নি
            </p>
            <button
              onClick={() => refetch()}
              className="mt-3 rounded-xl bg-card-bg px-3.5 py-1.5 text-xs font-semibold text-pure-color shadow-xs border border-border-color"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        ) : filteredDays.length === 0 ? (
          <div className="rounded-2xl border border-border-color bg-card-bg p-8 text-center">
            <Utensils className="mx-auto size-8 text-subtitle-color opacity-50" />
            <p className="mt-2 text-xs font-semibold text-pure-color">কোনো মিল রেকর্ড পাওয়া যায়নি</p>
          </div>
        ) : (
          filteredDays.map((day) => {
            return (
              <article
                key={day.date}
                className={cn(
                  'rounded-2xl border p-4 shadow-2xs transition-colors',
                  day.isToday
                    ? 'border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/20'
                    : 'border-border-color bg-card-bg'
                )}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between pb-3 border-b border-border-color/50">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-pure-color">
                        {formatBanglaDate(day.date)}
                      </p>
                      {day.isToday && (
                        <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.2 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                          আজ
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-subtitle-color">
                      {formatBanglaWeekday(day.date)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-1 text-xs font-bold tabular-nums',
                        day.total > 0
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-secondary-bg text-subtitle-color'
                      )}
                    >
                      মোট {toBanglaNumber(day.total)} মিল
                    </span>

                    {/* Quick Edit Button */}
                    <button
                      onClick={() => setIsEntryModalOpen(true)}
                      className="flex size-7 items-center justify-center rounded-lg bg-secondary-bg text-subtitle-color hover:text-pure-color transition active:scale-90"
                      title="এডিট করুন"
                    >
                      <Edit2 className="size-3.5" />
                    </button>
                  </div>
                </div>

                {/* Member Breakdown Grid */}
                {day.memberEntries.length === 0 ? (
                  <p className="pt-3 text-center text-xs text-subtitle-color italic">
                    {day.total === 0 ? 'এই দিনে কোনো মিল রেকর্ড করা হয়নি' : 'কোনো তথ্য নেই'}
                  </p>
                ) : (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {day.memberEntries.map((m) => {
                      const isMe = m.memberId === currentMemberId;
                      return (
                        <div
                          key={m.memberId}
                          className={cn(
                            'flex items-center justify-between rounded-xl px-2.5 py-1.5 transition',
                            isMe
                              ? 'bg-emerald-500/10 border border-emerald-500/20'
                              : 'bg-secondary-bg/80'
                          )}
                        >
                          <div className="min-w-0 pr-1">
                            <p className="truncate text-xs font-semibold text-pure-color">
                              {m.memberName}
                            </p>
                            <div className="flex items-center gap-1.5 text-[10px] text-subtitle-color">
                              {m.lunch > 0 && (
                                <span className="flex items-center gap-0.5">
                                  <SunMedium className="size-2.5 text-amber-500" />
                                  {toBanglaNumber(m.lunch)}
                                </span>
                              )}
                              {m.dinner > 0 && (
                                <span className="flex items-center gap-0.5">
                                  <MoonStar className="size-2.5 text-indigo-500" />
                                  {toBanglaNumber(m.dinner)}
                                </span>
                              )}
                            </div>
                          </div>

                          <span className="shrink-0 rounded-lg bg-card-bg px-2 py-0.5 text-xs font-bold text-pure-color border border-border-color/60">
                            {toBanglaNumber(m.total)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </article>
            );
          })
        )}
      </section>

      {/* Meal Entry Modal */}
      <MealEntryModal
        isOpen={isEntryModalOpen}
        onClose={() => setIsEntryModalOpen(false)}
        workspaceId={workspaceId}
        periodId={periodId}
        currentMemberId={currentMemberId}
        isManager={isManager}
        onSuccessToast={onSuccessToast}
      />
    </div>
  );
};
