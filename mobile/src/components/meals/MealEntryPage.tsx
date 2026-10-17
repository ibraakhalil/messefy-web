import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Calendar,
  Plus,
  Minus,
  Loader2,
  Sparkles,
  RotateCcw,
  SunMedium,
  MoonStar,
  Check,
  Utensils,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  getTodayDateString,
  getYesterdayDateString,
  formatBanglaDate,
  formatBanglaWeekday,
  toBanglaNumber,
} from '@/lib/period-utils';
import { useMealChart, useBatchCreateMeals, useUpsertMeal } from '@/hooks/use-meals';
import { haptics } from '@/lib/haptics';

interface MealEntryPageProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  periodId: string;
  currentMemberId: string;
  isManager: boolean;
  onSuccessToast?: (msg: string) => void;
}

interface MemberMealState {
  memberId: string;
  name: string;
  breakfast: number;
  lunch: number;
  dinner: number;
  existingId?: string;
}

export const MealEntryPage: React.FC<MealEntryPageProps> = ({
  isOpen,
  onClose,
  workspaceId,
  periodId,
  currentMemberId,
  isManager,
  onSuccessToast,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [userEdits, setUserEdits] = useState<
    Record<string, { breakfast?: number; lunch?: number; dinner?: number }>
  >({});

  const {
    data: chartData,
    isLoading: isLoadingChart,
    isRefetching,
    refetch,
  } = useMealChart(periodId);
  const { mutateAsync: batchSaveMeals, isPending: isBatchSaving } = useBatchCreateMeals();
  const { mutateAsync: upsertSingleMeal, isPending: isSingleSaving } = useUpsertMeal();

  const handleDateChange = (newDate: string) => {
    haptics.selection();
    setSelectedDate(newDate);
    setUserEdits({});
  };

  // Derive member meals from chart data and any active user edits
  const membersMeals = useMemo<MemberMealState[]>(() => {
    if (!chartData || !isOpen) return [];

    const allMembers = chartData.members || [];
    const dateEntries = chartData.entries.filter((entry) => entry.date === selectedDate);
    const entryMap = new Map(dateEntries.map((e) => [e.memberId, e]));

    const targetMembers = isManager
      ? allMembers
      : allMembers.filter((m) => m.id === currentMemberId);

    return targetMembers.map((member) => {
      const existing = entryMap.get(member.id);
      const edit = userEdits[member.id];
      return {
        memberId: member.id,
        name: member.name,
        breakfast:
          edit?.breakfast !== undefined
            ? edit.breakfast
            : (existing?.breakfast ?? 0),
        lunch:
          edit?.lunch !== undefined
            ? edit.lunch
            : (existing?.lunch ?? (existing ? 0 : 1)),
        dinner:
          edit?.dinner !== undefined
            ? edit.dinner
            : (existing?.dinner ?? (existing ? 0 : 1)),
        existingId: existing?.id,
      };
    });
  }, [chartData, selectedDate, isOpen, isManager, currentMemberId, userEdits]);

  if (!isOpen) return null;

  const todayStr = getTodayDateString();
  const yesterdayStr = getYesterdayDateString();
  const isSaving = isBatchSaving || isSingleSaving;

  const updateMealCount = (
    memberId: string,
    field: 'breakfast' | 'lunch' | 'dinner',
    delta: number
  ) => {
    haptics.impact();
    const current = membersMeals.find((m) => m.memberId === memberId);
    if (!current) return;
    const newVal = Math.max(0, current[field] + delta);
    setUserEdits((prev) => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        [field]: newVal,
      },
    }));
  };

  const applyPresetAll = (lunchVal: number, dinnerVal: number) => {
    haptics.impact();
    const edits: Record<string, { lunch: number; dinner: number }> = {};
    for (const m of membersMeals) {
      edits[m.memberId] = { lunch: lunchVal, dinner: dinnerVal };
    }
    setUserEdits(edits);
  };

  const resetAllToZero = () => {
    haptics.warning();
    const edits: Record<string, { breakfast: number; lunch: number; dinner: number }> = {};
    for (const m of membersMeals) {
      edits[m.memberId] = { breakfast: 0, lunch: 0, dinner: 0 };
    }
    setUserEdits(edits);
  };

  const grandTotalMeals = membersMeals.reduce(
    (sum, m) => sum + m.breakfast + m.lunch + m.dinner,
    0
  );

  const handleSave = async () => {
    if (!periodId || !workspaceId) return;

    try {
      if (isManager) {
        // Manager batch save
        await batchSaveMeals({
          workspaceId,
          periodId,
          date: selectedDate,
          meals: membersMeals.map((m) => ({
            memberId: m.memberId,
            breakfast: m.breakfast,
            lunch: m.lunch,
            dinner: m.dinner,
          })),
        });
        onSuccessToast?.('মাশাআল্লাহ! সব মেম্বারের মিল সংরক্ষিত হয়েছে');
      } else {
        // Single member save
        const myMeal = membersMeals.find((m) => m.memberId === currentMemberId);
        if (myMeal) {
          await upsertSingleMeal({
            workspaceId,
            periodId,
            memberId: myMeal.memberId,
            date: selectedDate,
            breakfast: myMeal.breakfast,
            lunch: myMeal.lunch,
            dinner: myMeal.dinner,
            mealId: myMeal.existingId,
          });
          onSuccessToast?.('আলহামদুলিল্লাহ! আপনার মিল আপডেট সফল হয়েছে');
        }
      }
      onClose();
    } catch (err: unknown) {
      console.error('Failed to save meals:', err);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="মিল এন্ট্রি ও আপডেট"
      className="fixed inset-0 z-50 flex flex-col bg-primary-bg page-slide-in-left select-none overflow-hidden"
    >
      {/* Top Header Bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border-color bg-card-bg/95 px-4 py-3.5 backdrop-blur-md pt-[calc(env(safe-area-inset-top,0px)+0.75rem)]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-xl bg-secondary-bg hover:bg-card-shade text-pure-color transition active:scale-90"
            aria-label="ফিরে যান"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-pure-color flex items-center gap-1.5 leading-tight">
              <Utensils className="size-4 text-primary" />
              <span>{isManager ? 'মেস মিল এন্ট্রি ও আপডেট' : 'আমার মিল আপডেট'}</span>
            </h1>
            <p className="text-[11px] text-subtitle-color">
              {formatBanglaDate(selectedDate)} ({formatBanglaWeekday(selectedDate)})
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isRefetching}
          className="flex size-9 items-center justify-center rounded-xl bg-secondary-bg hover:bg-card-shade text-subtitle-color hover:text-pure-color transition active:scale-90"
          aria-label="রিফ্রেশ করুন"
        >
          <RefreshCw className={cn('size-4', isRefetching && 'animate-spin')} />
        </button>
      </header>

      {/* Date Selector Row */}
      <div className="flex items-center justify-between gap-2 border-b border-border-color/60 bg-card-bg px-4 py-2.5 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <button
            type="button"
            onClick={() => handleDateChange(todayStr)}
            className={cn(
              'rounded-xl px-3 py-1.5 text-xs font-semibold transition active:scale-95',
              selectedDate === todayStr
                ? 'bg-primary text-white shadow-xs'
                : 'bg-secondary-bg border border-border-color text-subtitle-color'
            )}
          >
            আজ
          </button>
          <button
            type="button"
            onClick={() => handleDateChange(yesterdayStr)}
            className={cn(
              'rounded-xl px-3 py-1.5 text-xs font-semibold transition active:scale-95',
              selectedDate === yesterdayStr
                ? 'bg-primary text-white shadow-xs'
                : 'bg-secondary-bg border border-border-color text-subtitle-color'
            )}
          >
            গতকাল
          </button>
        </div>

        <div className="flex items-center gap-1.5 rounded-xl border border-border-color bg-secondary-bg/80 px-2.5 py-1">
          <Calendar className="size-3.5 text-subtitle-color" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className="border-0 bg-transparent text-xs font-medium text-pure-color focus:outline-hidden"
          />
        </div>
      </div>

      {/* Manager Quick Batch Presets */}
      {isManager && membersMeals.length > 1 && (
        <div className="flex items-center justify-between border-b border-border-color/40 bg-secondary-bg/40 px-4 py-2 text-xs">
          <span className="text-[11px] font-medium text-subtitle-color flex items-center gap-1">
            <Sparkles className="size-3 text-amber-500" />
            কুইক সেট:
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => applyPresetAll(1, 1)}
              className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 active:scale-95 transition"
            >
              ১+১ সবাই
            </button>
            <button
              type="button"
              onClick={() => applyPresetAll(0, 1)}
              className="rounded-lg bg-indigo-500/10 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 dark:text-indigo-400 border border-indigo-500/20 active:scale-95 transition"
            >
              শুধু রাত ১
            </button>
            <button
              type="button"
              onClick={resetAllToZero}
              className="rounded-lg bg-rose-500/10 px-2.5 py-1 text-[11px] font-semibold text-rose-700 dark:text-rose-400 border border-rose-500/20 active:scale-95 transition flex items-center gap-1"
            >
              <RotateCcw className="size-2.5" />
              ০
            </button>
          </div>
        </div>
      )}

      {/* Members Meal List */}
      <div className="flex-1 overflow-y-auto px-4 py-3.5 space-y-3 pb-24">
        {isLoadingChart ? (
          <div className="flex flex-col items-center justify-center py-20 text-subtitle-color">
            <Loader2 className="size-7 animate-spin text-primary" />
            <p className="mt-2 text-xs font-medium">মিল তথ্য লোড হচ্ছে...</p>
          </div>
        ) : membersMeals.length === 0 ? (
          <div className="rounded-2xl border border-border-color bg-card-bg py-12 text-center text-xs text-subtitle-color">
            কোনো মেম্বার পাওয়া যায়নি
          </div>
        ) : (
          membersMeals.map((member) => {
            const rowTotal = member.breakfast + member.lunch + member.dinner;
            const isCurrentUser = member.memberId === currentMemberId;

            return (
              <div
                key={member.memberId}
                className={cn(
                  'rounded-2xl border p-3.5 shadow-2xs transition',
                  isCurrentUser
                    ? 'border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/20'
                    : 'border-border-color bg-card-bg'
                )}
              >
                <div className="flex items-center justify-between pb-2 border-b border-border-color/40">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-8 items-center justify-center rounded-full bg-secondary-bg text-xs font-bold text-pure-color">
                      {member.name.charAt(0) || 'M'}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-pure-color flex items-center gap-1.5">
                        <span>{member.name}</span>
                        {isCurrentUser && (
                          <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 text-[9px] font-medium">
                            আপনি
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="rounded-lg bg-secondary-bg px-2.5 py-1 text-xs font-bold text-pure-color border border-border-color/40">
                      মোট: {toBanglaNumber(rowTotal)}
                    </span>
                  </div>
                </div>

                {/* Steppers */}
                <div className="mt-3 grid grid-cols-2 gap-2.5">
                  {/* Lunch */}
                  <div className="flex items-center justify-between rounded-xl bg-secondary-bg/80 px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      <SunMedium className="size-4 text-amber-500" />
                      <span className="text-xs font-medium text-pure-color">দুপুর</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateMealCount(member.memberId, 'lunch', -1)}
                        disabled={member.lunch <= 0}
                        className="flex size-7 items-center justify-center rounded-lg bg-card-bg border border-border-color text-icon-color disabled:opacity-30 active:scale-90"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-4 text-center text-xs font-bold text-pure-color">
                        {toBanglaNumber(member.lunch)}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateMealCount(member.memberId, 'lunch', 1)}
                        className="flex size-7 items-center justify-center rounded-lg bg-primary text-white shadow-2xs active:scale-90"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Dinner */}
                  <div className="flex items-center justify-between rounded-xl bg-secondary-bg/80 px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      <MoonStar className="size-4 text-indigo-500" />
                      <span className="text-xs font-medium text-pure-color">রাত</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateMealCount(member.memberId, 'dinner', -1)}
                        disabled={member.dinner <= 0}
                        className="flex size-7 items-center justify-center rounded-lg bg-card-bg border border-border-color text-icon-color disabled:opacity-30 active:scale-90"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-4 text-center text-xs font-bold text-pure-color">
                        {toBanglaNumber(member.dinner)}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateMealCount(member.memberId, 'dinner', 1)}
                        className="flex size-7 items-center justify-center rounded-lg bg-primary text-white shadow-2xs active:scale-90"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Fixed Sticky Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 border-t border-border-color bg-card-bg/95 backdrop-blur-xl px-4 py-3 pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] shadow-lg">
        <div className="mx-auto flex max-w-md items-center justify-between gap-3">
          <div>
            <p className="text-[11px] text-subtitle-color font-medium">নির্বাচিত দিনের মোট মিল</p>
            <p className="text-lg font-black text-primary">
              {toBanglaNumber(grandTotalMeals)} টি
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-white shadow-md transition active:scale-95 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>সংরক্ষণ হচ্ছে...</span>
              </>
            ) : (
              <>
                <Check className="size-4" />
                <span>সংরক্ষণ করুন</span>
              </>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
};
