import React from 'react';
import { Calendar, Receipt, Utensils, Sparkles, TrendingUp, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface PeriodSummaryCardProps {
  mealRate: number;
  totalMeals: number;
  totalExpenses: number;
  daysRemaining: number;
  periodName: string;
  isOpen: boolean;
  isLoading?: boolean;
}

export const PeriodSummaryCard: React.FC<PeriodSummaryCardProps> = ({
  mealRate,
  totalMeals,
  totalExpenses,
  daysRemaining,
  periodName,
  isOpen,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border-color bg-card-bg p-4 shadow-2xs animate-pulse">
        <div className="h-4 w-32 bg-secondary-bg rounded-md mb-3" />
        <div className="grid grid-cols-3 gap-2">
          <div className="h-16 bg-secondary-bg rounded-xl" />
          <div className="h-16 bg-secondary-bg rounded-xl" />
          <div className="h-16 bg-secondary-bg rounded-xl" />
        </div>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 shadow-2xs">
        <div className="flex items-center gap-2">
          <AlertCircle className="size-4 text-amber-600 dark:text-amber-400" />
          <h2 className="text-xs font-semibold text-pure-color">চলতি মাসের কোনো পিরিয়ড ওপেন নেই</h2>
        </div>
        <p className="mt-1 text-xs text-subtitle-color leading-normal">
          ম্যানেজার নতুন মাস শুরু করলে মিল ও খরচের হিসাব এখানে দৃশ্যমান হবে।
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border-color bg-card-bg p-4 shadow-2xs transition-colors">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border-color/60">
        <div className="flex items-center gap-2">
          <Calendar className="size-4 text-primary shrink-0" />
          <span className="text-xs font-semibold text-pure-color leading-normal">
            {periodName}
          </span>
        </div>
        <span className="rounded-md bg-secondary-bg px-2 py-0.5 text-[11px] font-medium text-subtitle-color">
          বাকি {daysRemaining} দিন
        </span>
      </div>

      {/* 3 Column Stats */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        {/* Meal Rate */}
        <div className="rounded-xl bg-secondary-bg/60 p-2.5">
          <p className="text-sm font-bold text-pure-color tabular-nums">
            {formatCurrency(mealRate)}
          </p>
          <p className="text-[11px] text-subtitle-color mt-0.5">মিল রেট</p>
        </div>

        {/* Total Meals */}
        <div className="rounded-xl bg-secondary-bg/60 p-2.5">
          <p className="text-sm font-bold text-pure-color tabular-nums">
            {totalMeals}
          </p>
          <p className="text-[11px] text-subtitle-color mt-0.5">মোট মিল</p>
        </div>

        {/* Total Expenses */}
        <div className="rounded-xl bg-secondary-bg/60 p-2.5">
          <p className="text-sm font-bold text-pure-color tabular-nums">
            {formatCurrency(totalExpenses)}
          </p>
          <p className="text-[11px] text-subtitle-color mt-0.5">মোট খরচ</p>
        </div>
      </div>
    </div>
  );
};
