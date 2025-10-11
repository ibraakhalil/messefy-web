'use client';

import Button from '@/components/ui/button';
import FormInput from '@/components/ui/form-input';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, ChefHat, DollarSign, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const mealEntrySchema = z.object({
  breakfast: z.boolean(),
  lunch: z.boolean(),
  dinner: z.boolean(),
  guestMeals: z.number().min(0, 'Guest meals cannot be negative').max(10, 'Maximum 10 guest meals'),
  date: z.string(),
});

type MealEntryFormValues = z.infer<typeof mealEntrySchema>;

interface MessSectionProps {
  isLoading?: boolean;
}

// Mock data
const userMesses = [
  {
    id: 'mess-1',
    name: 'Office Mess',
    role: 'Member',
    status: 'active',
    members: 12,
    monthlyAverage: 285,
    currentBalance: -45,
    lastMealEntry: '2024-01-15',
    messCode: 'OFF-2024-001',
  },
  {
    id: 'mess-2',
    name: 'Community Kitchen',
    role: 'Admin',
    status: 'active',
    members: 8,
    monthlyAverage: 195,
    currentBalance: 25,
    lastMealEntry: '2024-01-14',
    messCode: 'COM-2024-002',
  },
  {
    id: 'mess-3',
    name: 'Student Hostel',
    role: 'Member',
    status: 'inactive',
    members: 15,
    monthlyAverage: 150,
    currentBalance: 0,
    lastMealEntry: '2023-12-30',
    messCode: 'STU-2024-003',
  },
];

const todaysMeals = {
  breakfast: true,
  lunch: false,
  dinner: false,
  guestMeals: 0,
};

export default function MessSection({ isLoading = false }: MessSectionProps) {
  const [isSubmittingMeal, setIsSubmittingMeal] = useState(false);
  const [selectedMess, setSelectedMess] = useState(userMesses[0]);

  const mealForm = useForm<MealEntryFormValues>({
    resolver: zodResolver(mealEntrySchema),
    defaultValues: {
      breakfast: todaysMeals.breakfast,
      lunch: todaysMeals.lunch,
      dinner: todaysMeals.dinner,
      guestMeals: todaysMeals.guestMeals,
      date: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmitMealEntry = async (data: MealEntryFormValues) => {
    setIsSubmittingMeal(true);
    try {
      console.log('Meal entry submitted:', data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Success notification would go here
    } catch (error) {
      console.error('Meal entry failed:', error);
    } finally {
      setIsSubmittingMeal(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-md bg-gray-200"></div>
        <div className="tablet:grid-cols-2 grid gap-4">
          <div className="h-32 animate-pulse rounded-md bg-gray-200"></div>
          <div className="h-32 animate-pulse rounded-md bg-gray-200"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Tab */}
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="tablet:grid-cols-3 grid gap-4">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Messes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userMesses.filter((m) => m.status === 'active').length}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                <ChefHat className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Average</p>
                <p className="text-2xl font-bold text-gray-900">
                  $
                  {userMesses.reduce((acc, mess) => acc + mess.monthlyAverage, 0) /
                    userMesses.length}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Balance</p>
                <p
                  className={`text-2xl font-bold ${
                    userMesses.reduce((acc, mess) => acc + mess.currentBalance, 0) >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  ${userMesses.reduce((acc, mess) => acc + mess.currentBalance, 0)}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Meal Entry Tab */}

      <div className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Quick Meal Entry</h3>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>

          {/* Mess Selection */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">Select Mess</label>
            <select
              value={selectedMess.id}
              onChange={(e) =>
                setSelectedMess(userMesses.find((m) => m.id === e.target.value) || userMesses[0])
              }
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            >
              {userMesses
                .filter((m) => m.status === 'active')
                .map((mess) => (
                  <option key={mess.id} value={mess.id}>
                    {mess.name}
                  </option>
                ))}
            </select>
          </div>

          <form onSubmit={mealForm.handleSubmit(onSubmitMealEntry)} className="space-y-6">
            <FormInput id="date" type="date" label="Date" {...mealForm.register('date')} />

            {/* Meal Checkboxes */}
            <div>
              <label className="mb-3 block text-sm font-medium text-gray-700">Meals</label>
              <div className="space-y-3">
                {[
                  { key: 'breakfast', label: 'Breakfast', icon: '🌅' },
                  { key: 'lunch', label: 'Lunch', icon: '☀️' },
                  { key: 'dinner', label: 'Dinner', icon: '🌙' },
                ].map(({ key, label, icon }) => (
                  <div key={key} className="flex items-center">
                    <input
                      id={key}
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      {...mealForm.register(key as 'breakfast' | 'lunch' | 'dinner')}
                    />
                    <label
                      htmlFor={key}
                      className="ml-3 flex items-center text-sm font-medium text-gray-700"
                    >
                      <span className="mr-2">{icon}</span>
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <FormInput
              id="guestMeals"
              type="number"
              min="0"
              max="10"
              label="Guest Meals"
              placeholder="0"
              icon={<Users className="h-5 w-5 text-gray-400" />}
              error={mealForm.formState.errors.guestMeals?.message}
              {...mealForm.register('guestMeals', { valueAsNumber: true })}
            />

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700"
              disabled={isSubmittingMeal}
            >
              {isSubmittingMeal ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Save Meal Entry
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
