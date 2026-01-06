'use client';

import { useState } from 'react';
import { DollarSign, Receipt, Utensils } from 'lucide-react';
import MealEntryForm from '@/components/mess/data-entry/meal-entry-form';
import DepositEntryForm from '@/components/mess/data-entry/deposit-entry-form';
import ExpenseEntryForm from '@/components/mess/data-entry/expense-entry-form';

export default function DataEntryPage() {
  const [entryType, setEntryType] = useState<'meal' | 'deposit' | 'expense'>('meal');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

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

  const getColor = (type: string) => {
    switch (type) {
      case 'meal':
        return 'orange';
      case 'deposit':
        return 'emerald';
      case 'expense':
        return 'red';
      default:
        return 'blue';
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg bg-${getColor(entryType)}-100 text-${getColor(entryType)}-600 dark:bg-${getColor(entryType)}-900/20 dark:text-${getColor(entryType)}-400`}
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
                  onClick={() => setEntryType(type as 'meal')}
                  className={`rounded-lg border p-4 text-left transition-all ${
                    entryType === type
                      ? `border-${getColor(type)}-500 bg-${getColor(type)}-50 dark:bg-${getColor(type)}-900/20`
                      : 'border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                        entryType === type
                          ? `bg-${getColor(type)}-100 text-${getColor(type)}-600 dark:bg-${getColor(type)}-900/20 dark:text-${getColor(type)}-400`
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
          {entryType === 'deposit' && <DepositEntryForm />}
          {entryType === 'expense' && <ExpenseEntryForm />}
        </div>
      </div>
    </div>
  );
}
