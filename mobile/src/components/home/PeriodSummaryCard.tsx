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
      <div className="relative overflow-hidden rounded-2xl bg-emerald-900/60 p-5 text-white shadow-lg animate-pulse">
        <div className="h-4 w-32 bg-white/20 rounded-md mb-4" />
        <div className="grid grid-cols-3 gap-2.5">
          <div className="h-20 bg-white/10 rounded-xl" />
          <div className="h-20 bg-white/10 rounded-xl" />
          <div className="h-20 bg-white/10 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-700 to-orange-800 p-5 text-white shadow-lg">
        <div className="flex items-center gap-2">
          <AlertCircle className="size-5 text-amber-200" />
          <h2 className="text-sm font-bold">চলতি মাসের কোনো পিরিয়ড ওপেন নেই</h2>
        </div>
        <p className="mt-1.5 text-xs text-amber-100/90 leading-relaxed">
          ম্যানেজার নতুন মাস শুরু করলে মিল ও খরচের হিসাব এখানে স্বয়ংক্রিয়ভাবে দৃশ্যমান হবে।
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 p-5 text-white shadow-lg shadow-emerald-950/15">
      {/* Decorative background glows */}
      <div
        className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-white/10 blur-2xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-10 -bottom-10 size-36 rounded-full bg-teal-400/10 blur-xl"
        aria-hidden="true"
      />

      {/* Top Banner inside card */}
      <div className="relative flex items-center justify-between pb-3 border-b border-white/15">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-lg bg-white/20 text-white shadow-xs">
            <Sparkles className="size-3.5" />
          </span>
          <span className="text-xs font-semibold tracking-wide text-emerald-100">
            {periodName}
          </span>
        </div>
        <div className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-medium text-emerald-50 backdrop-blur-xs">
          <Calendar className="size-3" />
          <span>বাকি {daysRemaining} দিন</span>
        </div>
      </div>

      {/* Primary Highlights - 3 Column Stats */}
      <div className="relative mt-4 grid grid-cols-3 gap-2.5 text-center">
        {/* Meal Rate */}
        <div className="rounded-xl bg-white/10 p-3 backdrop-blur-xs transition hover:bg-white/15">
          <div className="mx-auto flex size-8 items-center justify-center rounded-lg bg-emerald-400/20 text-emerald-200">
            <TrendingUp className="size-4" />
          </div>
          <p className="mt-2 text-base font-bold tracking-tight text-white">
            {formatCurrency(mealRate)}
          </p>
          <p className="text-[11px] font-medium text-emerald-100/80">মিল রেট</p>
        </div>

        {/* Total Meals */}
        <div className="rounded-xl bg-white/10 p-3 backdrop-blur-xs transition hover:bg-white/15">
          <div className="mx-auto flex size-8 items-center justify-center rounded-lg bg-amber-400/20 text-amber-200">
            <Utensils className="size-4" />
          </div>
          <p className="mt-2 text-base font-bold tracking-tight text-white">
            {totalMeals}
          </p>
          <p className="text-[11px] font-medium text-emerald-100/80">মোট মিল</p>
        </div>

        {/* Total Expenses */}
        <div className="rounded-xl bg-white/10 p-3 backdrop-blur-xs transition hover:bg-white/15">
          <div className="mx-auto flex size-8 items-center justify-center rounded-lg bg-rose-400/20 text-rose-200">
            <Receipt className="size-4" />
          </div>
          <p className="mt-2 text-base font-bold tracking-tight text-white">
            {formatCurrency(totalExpenses)}
          </p>
          <p className="text-[11px] font-medium text-emerald-100/80">মোট খরচ</p>
        </div>
      </div>
    </div>
  );
};
