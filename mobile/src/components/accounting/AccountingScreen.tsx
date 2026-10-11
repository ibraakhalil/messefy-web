import React, { useState } from 'react';
import {
  Utensils,
  ShoppingCart,
  Plus,
  Coins,
  Receipt,
  Users,
  TrendingDown,
  TrendingUp,
  Scale,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { haptics } from '@/lib/haptics';
import { toBanglaNumber } from '@/lib/period-utils';
import { MealsScreen } from '@/components/meals/MealsScreen';
import { ExpensesScreen } from '@/components/finances/ExpensesScreen';
import { MealEntryModal } from '@/components/meals/MealEntryModal';
import { ExpenseEntryModal } from '@/components/finances/ExpenseEntryModal';
import { DepositEntryModal } from '@/components/finances/DepositEntryModal';
import type { WorkspaceMember } from '@/types/workspace';

export type AccountingSubTab = 'meals' | 'expenses';

interface AccountingScreenProps {
  workspaceId: string;
  periodId: string;
  periodYear: number;
  periodMonth: number;
  members: WorkspaceMember[];
  currentMemberId: string;
  isManager: boolean;
  mealRate?: number;
  totalMeals?: number;
  totalExpenses?: number;
  totalDeposits?: number;
  netBalance?: number;
  onSuccessToast?: (msg: string) => void;
}

export const AccountingScreen: React.FC<AccountingScreenProps> = ({
  workspaceId,
  periodId,
  periodYear,
  periodMonth,
  members,
  currentMemberId,
  isManager,
  mealRate = 0,
  totalMeals = 0,
  totalExpenses = 0,
  totalDeposits = 0,
  netBalance = 0,
  onSuccessToast,
}) => {
  const [subTab, setSubTab] = useState<AccountingSubTab>('meals');
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

  const handleSubTabChange = (nextTab: AccountingSubTab) => {
    if (subTab !== nextTab) {
      haptics.selection();
      setSubTab(nextTab);
    }
  };

  return (
    <div className="space-y-3.5 pb-6">
      {/* 1. Top Segmented Switcher */}
      <section className="rounded-2xl border border-border-color bg-card-bg p-1.5 shadow-2xs">
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => handleSubTabChange('meals')}
            className={cn(
              'flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition active:scale-98',
              subTab === 'meals'
                ? 'bg-primary text-white shadow-xs'
                : 'text-subtitle-color hover:text-pure-color hover:bg-white/5'
            )}
          >
            <Utensils className="size-4 shrink-0" />
            <span>মিল হিসাব</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubTabChange('expenses')}
            className={cn(
              'flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition active:scale-98',
              subTab === 'expenses'
                ? 'bg-primary text-white shadow-xs'
                : 'text-subtitle-color hover:text-pure-color hover:bg-white/5'
            )}
          >
            <ShoppingCart className="size-4 shrink-0" />
            <span>বাজার খরচ</span>
          </button>
        </div>
      </section>

      {/* 2. Universal 3-in-1 Quick Action Hub */}
      <section className="grid grid-cols-3 gap-2">
        {/* + মিল এন্ট্রি */}
        <button
          type="button"
          onClick={() => {
            haptics.impact();
            setIsMealModalOpen(true);
          }}
          className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-emerald-500/25 bg-emerald-50/70 p-2.5 text-center shadow-2xs transition active:scale-95 hover:bg-emerald-100/70 dark:bg-emerald-950/25 dark:border-emerald-500/20 dark:hover:bg-emerald-900/30"
        >
          <div className="flex size-7 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-2xs">
            <Plus className="size-4" />
          </div>
          <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
            মিল এন্ট্রি
          </span>
        </button>

        {/* + বাজার খরচ */}
        <button
          type="button"
          onClick={() => {
            haptics.impact();
            setIsExpenseModalOpen(true);
          }}
          className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-orange-500/25 bg-orange-50/70 p-2.5 text-center shadow-2xs transition active:scale-95 hover:bg-orange-100/70 dark:bg-orange-950/25 dark:border-orange-500/20 dark:hover:bg-orange-900/30"
        >
          <div className="flex size-7 items-center justify-center rounded-xl bg-orange-600 text-white shadow-2xs">
            <ShoppingCart className="size-3.5" />
          </div>
          <span className="text-[11px] font-bold text-orange-800 dark:text-orange-300">
            বাজার খরচ
          </span>
        </button>

        {/* + টাকা জমা */}
        <button
          type="button"
          onClick={() => {
            haptics.impact();
            setIsDepositModalOpen(true);
          }}
          className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-blue-500/25 bg-blue-50/70 p-2.5 text-center shadow-2xs transition active:scale-95 hover:bg-blue-100/70 dark:bg-blue-950/25 dark:border-blue-500/20 dark:hover:bg-blue-900/30"
        >
          <div className="flex size-7 items-center justify-center rounded-xl bg-blue-600 text-white shadow-2xs">
            <Coins className="size-3.5" />
          </div>
          <span className="text-[11px] font-bold text-blue-800 dark:text-blue-300">
            টাকা জমা
          </span>
        </button>
      </section>

      {/* 3. Compact Metric Strip (Sleek single-row pill stats) */}
      <section className="rounded-2xl border border-border-color bg-card-bg/80 p-3 backdrop-blur-md shadow-2xs">
        {subTab === 'meals' ? (
          <div className="grid grid-cols-3 divide-x divide-border-color/60 text-center">
            <div className="px-1">
              <div className="flex items-center justify-center gap-1 text-subtitle-color">
                <Utensils className="size-3 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[10px] font-medium">মোট মিল</span>
              </div>
              <p className="mt-0.5 text-sm font-black tabular-nums text-pure-color">
                {toBanglaNumber(totalMeals)} টি
              </p>
            </div>

            <div className="px-1">
              <div className="flex items-center justify-center gap-1 text-subtitle-color">
                <Users className="size-3 text-primary" />
                <span className="text-[10px] font-medium">মেম্বার</span>
              </div>
              <p className="mt-0.5 text-sm font-black tabular-nums text-pure-color">
                {toBanglaNumber(members.length)} জন
              </p>
            </div>

            <div className="px-1">
              <div className="flex items-center justify-center gap-1 text-subtitle-color">
                <Receipt className="size-3 text-amber-600 dark:text-amber-400" />
                <span className="text-[10px] font-medium">মিল রেট</span>
              </div>
              <p className="mt-0.5 text-sm font-black tabular-nums text-pure-color">
                ৳{toBanglaNumber(mealRate.toFixed(2))}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 divide-x divide-border-color/60 text-center">
            <div className="px-1">
              <div className="flex items-center justify-center gap-1 text-subtitle-color">
                <TrendingDown className="size-3 text-rose-500" />
                <span className="text-[10px] font-medium">মোট বাজার</span>
              </div>
              <p className="mt-0.5 text-xs font-black tabular-nums text-pure-color truncate">
                ৳{toBanglaNumber(Math.round(totalExpenses).toLocaleString('bn-BD'))}
              </p>
            </div>

            <div className="px-1">
              <div className="flex items-center justify-center gap-1 text-subtitle-color">
                <TrendingUp className="size-3 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[10px] font-medium">মোট জমা</span>
              </div>
              <p className="mt-0.5 text-xs font-black tabular-nums text-pure-color truncate">
                ৳{toBanglaNumber(Math.round(totalDeposits).toLocaleString('bn-BD'))}
              </p>
            </div>

            <div className="px-1">
              <div className="flex items-center justify-center gap-1 text-subtitle-color">
                <Scale className="size-3 text-blue-500" />
                <span className="text-[10px] font-medium">
                  {netBalance >= 0 ? 'ক্যাশ উদ্বৃত্ত' : 'ঘাটতি'}
                </span>
              </div>
              <p
                className={cn(
                  'mt-0.5 text-xs font-black tabular-nums truncate',
                  netBalance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'
                )}
              >
                {netBalance >= 0 ? '+' : '-'}৳
                {toBanglaNumber(Math.abs(Math.round(netBalance)).toLocaleString('bn-BD'))}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* 4. Active Sub-Screen */}
      {subTab === 'meals' ? (
        <MealsScreen
          workspaceId={workspaceId}
          periodId={periodId}
          periodYear={periodYear}
          periodMonth={periodMonth}
          currentMemberId={currentMemberId}
          isManager={isManager}
          hideBanner={true}
          hideActionRow={true}
          onOpenMealEntry={() => setIsMealModalOpen(true)}
          onSuccessToast={onSuccessToast}
        />
      ) : (
        <ExpensesScreen
          workspaceId={workspaceId}
          periodId={periodId}
          periodYear={periodYear}
          periodMonth={periodMonth}
          members={members}
          currentMemberId={currentMemberId}
          isManager={isManager}
          mealRate={mealRate}
          hideBanner={true}
          hideActionRow={true}
          onOpenExpense={() => setIsExpenseModalOpen(true)}
          onOpenDeposit={() => setIsDepositModalOpen(true)}
          onSuccessToast={onSuccessToast}
        />
      )}

      {/* Quick Modals Container */}
      <MealEntryModal
        isOpen={isMealModalOpen}
        onClose={() => setIsMealModalOpen(false)}
        workspaceId={workspaceId}
        periodId={periodId}
        currentMemberId={currentMemberId}
        isManager={isManager}
        onSuccessToast={onSuccessToast}
      />

      <ExpenseEntryModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        workspaceId={workspaceId}
        periodId={periodId}
        onSuccessToast={onSuccessToast}
      />

      <DepositEntryModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        workspaceId={workspaceId}
        periodId={periodId}
        members={members}
        currentMemberId={currentMemberId}
        isManager={isManager}
        onSuccessToast={onSuccessToast}
      />
    </div>
  );
};
