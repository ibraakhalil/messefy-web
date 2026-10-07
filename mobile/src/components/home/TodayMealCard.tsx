import React from 'react';
import { SunMedium, MoonStar, Plus, Minus, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import type { TodayMeals } from '@/types/mess';
import { cn } from '@/lib/utils';
import { toBanglaNumber } from '@/lib/period-utils';

interface TodayMealCardProps {
  todayMeals: TodayMeals;
  onUpdateLunch: (delta: number) => void;
  onUpdateDinner: (delta: number) => void;
  onToggleStatus: () => void;
  isUpdating?: boolean;
}

export const TodayMealCard: React.FC<TodayMealCardProps> = ({
  todayMeals,
  onUpdateLunch,
  onUpdateDinner,
  onToggleStatus,
  isUpdating = false,
}) => {
  const isOff = todayMeals.status === 'off';

  return (
    <div className="rounded-2xl border border-border-color bg-card-bg p-4.5 shadow-xs transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
            <SunMedium className="size-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-pure-color">আজকের মিল</h2>
            <p className="text-[11px] text-subtitle-color">
              {todayMeals.date}
            </p>
          </div>
        </div>

        {/* Quick Toggle On / Off */}
        <button
          onClick={onToggleStatus}
          disabled={isUpdating}
          className={cn(
            'flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition active:scale-95 disabled:opacity-50',
            isOff
              ? 'bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-900'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900'
          )}
        >
          {isUpdating ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span>আপডেট হচ্ছে...</span>
            </>
          ) : isOff ? (
            <>
              <XCircle className="size-3.5" />
              <span>মিল অফ</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="size-3.5" />
              <span>মিল অন</span>
            </>
          )}
        </button>
      </div>

      {/* Meals Counter Grid */}
      <div className="mt-3.5 grid grid-cols-2 gap-3">
        {/* Lunch */}
        <div
          className={cn(
            'flex items-center justify-between rounded-xl p-3 transition',
            isOff ? 'bg-secondary-bg/40 opacity-60' : 'bg-secondary-bg'
          )}
        >
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <SunMedium className="size-3.5" />
            </div>
            <div>
              <p className="text-xs font-medium text-pure-color">দুপুর</p>
              <p className="text-[10px] text-subtitle-color">Lunch</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onUpdateLunch(-1)}
              disabled={isOff || todayMeals.lunch <= 0 || isUpdating}
              className="flex size-6.5 items-center justify-center rounded-lg bg-card-bg border border-border-color text-icon-color disabled:opacity-30 active:scale-90"
            >
              <Minus className="size-3" />
            </button>
            <span className="w-5 text-center text-sm font-bold text-pure-color tabular-nums">
              {toBanglaNumber(todayMeals.lunch)}
            </span>
            <button
              onClick={() => onUpdateLunch(1)}
              disabled={isOff || isUpdating}
              className="flex size-6.5 items-center justify-center rounded-lg bg-primary text-white shadow-xs disabled:opacity-30 active:scale-90"
            >
              <Plus className="size-3" />
            </button>
          </div>
        </div>

        {/* Dinner */}
        <div
          className={cn(
            'flex items-center justify-between rounded-xl p-3 transition',
            isOff ? 'bg-secondary-bg/40 opacity-60' : 'bg-secondary-bg'
          )}
        >
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
              <MoonStar className="size-3.5" />
            </div>
            <div>
              <p className="text-xs font-medium text-pure-color">রাত</p>
              <p className="text-[10px] text-subtitle-color">Dinner</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onUpdateDinner(-1)}
              disabled={isOff || todayMeals.dinner <= 0 || isUpdating}
              className="flex size-6.5 items-center justify-center rounded-lg bg-card-bg border border-border-color text-icon-color disabled:opacity-30 active:scale-90"
            >
              <Minus className="size-3" />
            </button>
            <span className="w-5 text-center text-sm font-bold text-pure-color tabular-nums">
              {toBanglaNumber(todayMeals.dinner)}
            </span>
            <button
              onClick={() => onUpdateDinner(1)}
              disabled={isOff || isUpdating}
              className="flex size-6.5 items-center justify-center rounded-lg bg-primary text-white shadow-xs disabled:opacity-30 active:scale-90"
            >
              <Plus className="size-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
