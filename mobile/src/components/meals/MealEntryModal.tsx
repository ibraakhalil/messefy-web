import React, { useState, useMemo } from 'react';
import {
  X,
  Calendar,
  Plus,
  Minus,
  Loader2,
  Sparkles,
  RotateCcw,
  SunMedium,
  MoonStar,
  Check,
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

interface MealEntryModalProps {
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

export const MealEntryModal: React.FC<MealEntryModalProps> = ({
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

  const { data: chartData, isLoading: isLoadingChart } = useMealChart(periodId);
  const { mutateAsync: batchSaveMeals, isPending: isBatchSaving } = useBatchCreateMeals();
  const { mutateAsync: upsertSingleMeal, isPending: isSingleSaving } = useUpsertMeal();

  const handleDateChange = (newDate: string) => {
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
    const edits: Record<string, { lunch: number; dinner: number }> = {};
    for (const m of membersMeals) {
      edits[m.memberId] = { lunch: lunchVal, dinner: dinnerVal };
    }
    setUserEdits(edits);
  };

  const resetAllToZero = () => {
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-t-3xl sm:rounded-3xl border border-border-color bg-card-bg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-color px-5 py-4">
          <div>
            <h3 className="text-base font-bold text-pure-color flex items-center gap-1.5">
              <span>{isManager ? 'মেস মিল এন্ট্রি ও আপডেট' : 'আমার মিল আপডেট'}</span>
            </h3>
            <p className="text-xs text-subtitle-color">
              {formatBanglaDate(selectedDate)} ({formatBanglaWeekday(selectedDate)})
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full bg-secondary-bg text-subtitle-color hover:text-pure-color transition active:scale-95"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Date Selector Row */}
        <div className="flex items-center justify-between gap-2 border-b border-border-color/60 bg-secondary-bg/50 px-5 py-2.5">
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            <button
              onClick={() => handleDateChange(todayStr)}
              className={cn(
                'rounded-lg px-2.5 py-1 text-xs font-semibold transition active:scale-95',
                selectedDate === todayStr
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-card-bg border border-border-color text-subtitle-color'
              )}
            >
              আজ
            </button>
            <button
              onClick={() => handleDateChange(yesterdayStr)}
              className={cn(
                'rounded-lg px-2.5 py-1 text-xs font-semibold transition active:scale-95',
                selectedDate === yesterdayStr
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-card-bg border border-border-color text-subtitle-color'
              )}
            >
              গতকাল
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <Calendar className="size-3.5 text-subtitle-color" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="rounded-lg border border-border-color bg-card-bg px-2 py-0.5 text-xs font-medium text-pure-color focus:border-primary focus:outline-hidden"
            />
          </div>
        </div>

        {/* Manager Quick Batch Presets */}
        {isManager && membersMeals.length > 1 && (
          <div className="flex items-center justify-between border-b border-border-color/40 px-5 py-2 text-xs">
            <span className="text-[11px] font-medium text-subtitle-color flex items-center gap-1">
              <Sparkles className="size-3 text-amber-500" />
              কুইক সেট:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => applyPresetAll(1, 1)}
                className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 active:scale-95 transition"
              >
                ১+১ সবাই
              </button>
              <button
                onClick={() => applyPresetAll(0, 1)}
                className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 dark:text-indigo-400 border border-indigo-500/20 active:scale-95 transition"
              >
                শুধু রাত ১
              </button>
              <button
                onClick={resetAllToZero}
                className="rounded-md bg-rose-500/10 px-2 py-0.5 text-[11px] font-semibold text-rose-700 dark:text-rose-400 border border-rose-500/20 active:scale-95 transition flex items-center gap-0.5"
              >
                <RotateCcw className="size-2.5" />
                ০
              </button>
            </div>
          </div>
        )}

        {/* Member Meals List */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
          {isLoadingChart ? (
            <div className="flex flex-col items-center justify-center py-12 text-subtitle-color">
              <Loader2 className="size-6 animate-spin text-primary" />
              <p className="mt-2 text-xs">মিল তথ্য লোড হচ্ছে...</p>
            </div>
          ) : membersMeals.length === 0 ? (
            <div className="py-8 text-center text-xs text-subtitle-color">
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
                    'rounded-2xl border p-3.5 transition',
                    isCurrentUser
                      ? 'border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/20'
                      : 'border-border-color bg-card-bg'
                  )}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-border-color/40">
                    <div className="flex items-center gap-2">
                      <div className="flex size-7 items-center justify-center rounded-full bg-secondary-bg text-xs font-bold text-pure-color">
                        {member.name.charAt(0) || 'M'}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-pure-color flex items-center gap-1.5">
                          <span>{member.name}</span>
                          {isCurrentUser && (
                            <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.2 text-[9px] font-medium">
                              আপনি
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="rounded-lg bg-secondary-bg px-2 py-0.5 text-xs font-bold text-pure-color">
                        মোট: {toBanglaNumber(rowTotal)}
                      </span>
                    </div>
                  </div>

                  {/* Meal Steppers */}
                  <div className="mt-2.5 grid grid-cols-2 gap-2">
                    {/* Lunch */}
                    <div className="flex items-center justify-between rounded-xl bg-secondary-bg/80 px-2.5 py-1.5">
                      <div className="flex items-center gap-1.5">
                        <SunMedium className="size-3.5 text-amber-500" />
                        <span className="text-xs font-medium text-pure-color">দুপুর</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => updateMealCount(member.memberId, 'lunch', -1)}
                          disabled={member.lunch <= 0}
                          className="flex size-6 items-center justify-center rounded-md bg-card-bg border border-border-color text-icon-color disabled:opacity-30 active:scale-90"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="w-4 text-center text-xs font-bold text-pure-color">
                          {toBanglaNumber(member.lunch)}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateMealCount(member.memberId, 'lunch', 1)}
                          className="flex size-6 items-center justify-center rounded-md bg-primary text-white shadow-2xs active:scale-90"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                    </div>

                    {/* Dinner */}
                    <div className="flex items-center justify-between rounded-xl bg-secondary-bg/80 px-2.5 py-1.5">
                      <div className="flex items-center gap-1.5">
                        <MoonStar className="size-3.5 text-indigo-500" />
                        <span className="text-xs font-medium text-pure-color">রাত</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => updateMealCount(member.memberId, 'dinner', -1)}
                          disabled={member.dinner <= 0}
                          className="flex size-6 items-center justify-center rounded-md bg-card-bg border border-border-color text-icon-color disabled:opacity-30 active:scale-90"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="w-4 text-center text-xs font-bold text-pure-color">
                          {toBanglaNumber(member.dinner)}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateMealCount(member.memberId, 'dinner', 1)}
                          className="flex size-6 items-center justify-center rounded-md bg-primary text-white shadow-2xs active:scale-90"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with grand total & save button */}
        <div className="border-t border-border-color bg-card-bg px-5 py-3.5 safe-bottom">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] text-subtitle-color">নির্বাচিত দিনের মোট মিল</p>
              <p className="text-base font-bold text-primary">
                {toBanglaNumber(grandTotalMeals)} টি
              </p>
            </div>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-md transition active:scale-95 disabled:opacity-50"
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
        </div>
      </div>
    </div>
  );
};
