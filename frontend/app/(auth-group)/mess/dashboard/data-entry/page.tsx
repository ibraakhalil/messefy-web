'use client';

import { useEffect, useState } from 'react';
import { DollarSign, Receipt, Utensils } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import MealEntryForm from '@/components/mess/data-entry/meal-entry-form';
import DepositEntryForm from '@/components/mess/data-entry/deposit-entry-form';
import ExpenseEntryForm from '@/components/mess/data-entry/expense-entry-form';
import { useWorkspace } from '@/providers/workspace-provider';
import { useCurrentPeriod } from '@/hooks/use-periods';
import NoActivePeriodState from '@/components/dashboard/no-active-period-state';

type EntryType = 'meal' | 'deposit' | 'expense';

const ENTRY_STYLES: Record<
  EntryType,
  { headerIcon: string; selectedCard: string; selectedCardIcon: string }
> = {
  meal: {
    headerIcon: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
    selectedCard: 'border-orange-500 bg-orange-50 dark:bg-orange-900/20',
    selectedCardIcon:
      'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
  },
  deposit: {
    headerIcon: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
    selectedCard: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20',
    selectedCardIcon:
      'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
  },
  expense: {
    headerIcon: 'bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400',
    selectedCard: 'border-rose-500 bg-rose-50 dark:bg-rose-900/20',
    selectedCardIcon: 'bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400',
  },
};

export default function DataEntryPage() {
  const workspaceId = useWorkspace().member?.workspaceId || '';
  const { data: currentPeriod, isLoading } = useCurrentPeriod(workspaceId);
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type');
  const selectedMemberId = searchParams.get('member') || undefined;
  const initialType: EntryType =
    typeParam === 'meal' || typeParam === 'deposit' || typeParam === 'expense'
      ? typeParam
      : 'meal';

  const [entryType, setEntryType] = useState<EntryType>(initialType);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (typeParam === 'meal' || typeParam === 'deposit' || typeParam === 'expense') {
      setEntryType(typeParam);
    }
  }, [typeParam]);

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

  const getIcon = (type: string) => {
    switch (type) {
      case 'meal':
        return Utensils;
      case 'deposit':
        return DollarSign;
      case 'expense':
        return Receipt;
      default:
        return Utensils;
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${ENTRY_STYLES[entryType].headerIcon}`}
        >
          {(() => {
            const Icon = getIcon(entryType);
            return <Icon className="h-6 w-6" />;
          })()}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add Data</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Record meals, deposits, and expenses in one place
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="space-y-6">
          {/* Entry Type Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              What do you want to add? *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
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
                { type: 'expense', label: 'Expense', icon: Receipt, description: 'Mess expense' },
              ].map(({ type, label, icon: Icon, description }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setEntryType(type as EntryType)}
                  className={`rounded-lg border p-4 text-left transition-all ${
                    entryType === type
                      ? ENTRY_STYLES[type as EntryType].selectedCard
                      : 'border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                        entryType === type
                          ? ENTRY_STYLES[type as EntryType].selectedCardIcon
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{label}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Common Date Field */}
          <div className="space-y-2">
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Date *
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Form Components */}
          {entryType === 'meal' && <MealEntryForm date={date} />}
          {entryType === 'deposit' && <DepositEntryForm selectedMemberId={selectedMemberId} />}
          {entryType === 'expense' && <ExpenseEntryForm />}
        </div>
      </div>
    </div>
  );
}
