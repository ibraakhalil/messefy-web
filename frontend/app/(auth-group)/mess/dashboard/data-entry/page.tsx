'use client';

import { useEffect, useState, type KeyboardEvent } from 'react';
import { DollarSign, Receipt, Utensils } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import MealEntryForm from '@/components/mess/data-entry/meal-entry-form';
import DepositEntryForm from '@/components/mess/data-entry/deposit-entry-form';
import ExpenseEntryForm from '@/components/mess/data-entry/expense-entry-form';
import { useWorkspace } from '@/providers/workspace-provider';
import { useCurrentPeriod } from '@/hooks/use-periods';
import NoActivePeriodState from '@/components/dashboard/no-active-period-state';
import { cn } from '@/utils/cn';

type EntryType = 'meal' | 'deposit' | 'expense';

const ENTRY_STYLES: Record<
  EntryType,
  { headerIcon: string; activeTab: string; activeTabIcon: string }
> = {
  meal: {
    headerIcon: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
    activeTab:
      'border-orange-500 bg-orange-50/80 text-orange-700 dark:border-orange-400 dark:bg-orange-950/30 dark:text-orange-300',
    activeTabIcon: 'bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400',
  },
  deposit: {
    headerIcon: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
    activeTab:
      'border-emerald-500 bg-emerald-50/80 text-emerald-700 dark:border-emerald-400 dark:bg-emerald-950/30 dark:text-emerald-300',
    activeTabIcon: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
  },
  expense: {
    headerIcon: 'bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400',
    activeTab:
      'border-rose-500 bg-rose-50/80 text-rose-700 dark:border-rose-400 dark:bg-rose-950/30 dark:text-rose-300',
    activeTabIcon: 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400',
  },
};

const ENTRY_TABS = [
  {
    type: 'meal',
    label: 'Meal Entry',
    icon: Utensils,
    description: 'Daily meal counts',
  },
  {
    type: 'deposit',
    label: 'Deposit',
    icon: DollarSign,
    description: 'Member payment',
  },
  {
    type: 'expense',
    label: 'Expense',
    icon: Receipt,
    description: 'Mess expense',
  },
] satisfies ReadonlyArray<{
  type: EntryType;
  label: string;
  icon: typeof Utensils;
  description: string;
}>;

export default function DataEntryPage() {
  const workspaceId = useWorkspace().member?.workspaceId || '';
  const { data: currentPeriod, isLoading } = useCurrentPeriod(workspaceId);
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type');
  const selectedMemberId = searchParams.get('member') || undefined;
  const initialType: EntryType =
    typeParam === 'meal' || typeParam === 'deposit' || typeParam === 'expense' ? typeParam : 'meal';

  const [entryType, setEntryType] = useState<EntryType>(initialType);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (typeParam === 'meal' || typeParam === 'deposit' || typeParam === 'expense') {
      setEntryType(typeParam);
    }
  }, [typeParam]);

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    let nextIndex: number | undefined;

    if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % ENTRY_TABS.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + ENTRY_TABS.length) % ENTRY_TABS.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = ENTRY_TABS.length - 1;
    }

    if (nextIndex === undefined) return;

    event.preventDefault();
    const nextType = ENTRY_TABS[nextIndex].type;
    setEntryType(nextType);
    requestAnimationFrame(() => document.getElementById(`${nextType}-tab`)?.focus());
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="text-gray-500">Checking active period...</div>
      </div>
    );
  }

  if (!currentPeriod) {
    return (
      <NoActivePeriodState
        title="Data Entry Needs An Active Meal Month"
        description="Meal, deposit, and expense entry are only available when a meal month is active."
      />
    );
  }

  const ActiveIcon = ENTRY_TABS.find((tab) => tab.type === entryType)?.icon ?? Utensils;

  return (
    <div className="tablet:space-y-6 tablet:p-6 mx-auto w-full max-w-6xl space-y-5 px-4 py-5">
      <div className="tablet:items-center flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${ENTRY_STYLES[entryType].headerIcon}`}
        >
          <ActiveIcon className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <h1 className="tablet:text-3xl text-2xl leading-tight font-bold text-gray-900 dark:text-white">
            Add Data
          </h1>
          <p className="tablet:text-base mt-1 text-sm leading-5 text-gray-600 dark:text-gray-400">
            Record meals, deposits, and expenses in one place
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Entry type tabs */}
        <div>
          <div
            role="tablist"
            aria-label="Data entry type"
            className="grid grid-cols-3 border-b border-gray-200 dark:border-gray-700"
          >
            {ENTRY_TABS.map(({ type, label, icon: Icon, description }, index) => {
              const isActive = entryType === type;

              return (
                <button
                  key={type}
                  type="button"
                  id={`${type}-tab`}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`${type}-panel`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setEntryType(type)}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                  className={cn(
                    'tablet:flex-row tablet:gap-3 tablet:px-4 tablet:py-4 tablet:text-left -mb-px flex min-w-0 flex-col items-center justify-center gap-1.5 border-b-2 border-transparent px-1 py-2.5 text-center text-gray-600 transition-colors dark:text-gray-400',
                    'hover:bg-gray-50 hover:text-gray-900 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-orange-500 dark:hover:bg-gray-700/40 dark:hover:text-white',
                    isActive && ENTRY_STYLES[type].activeTab,
                  )}
                >
                  <span
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300',
                      isActive && ENTRY_STYLES[type].activeTabIcon,
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="tablet:text-base block text-xs leading-tight font-semibold">
                      {label}
                    </span>
                    <span className="tablet:block hidden text-xs opacity-75">{description}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active tab panel */}
        <div
          id={`${entryType}-panel`}
          role="tabpanel"
          aria-labelledby={`${entryType}-tab`}
          tabIndex={0}
          className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500"
        >
          {entryType === 'meal' && <MealEntryForm date={date} onDateChange={setDate} />}
          {entryType === 'deposit' && <DepositEntryForm selectedMemberId={selectedMemberId} />}
          {entryType === 'expense' && <ExpenseEntryForm />}
        </div>
      </div>
    </div>
  );
}
