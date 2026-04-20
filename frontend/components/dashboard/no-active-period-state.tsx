'use client';

import Link from 'next/link';
import { Calendar, Plus } from 'lucide-react';
import Button from '@/components/ui/button';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import { CreateMonthForm } from './new-month-form';

interface NoActivePeriodStateProps {
  title?: string;
  description?: string;
}

export default function NoActivePeriodState({
  title = 'No Active Meal Month',
  description = 'Start a new meal month to access this page and begin tracking meals, deposits, expenses, and balances.',
}: NoActivePeriodStateProps) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
          <Calendar className="h-10 w-10" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-400">{description}</p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ResponsiveDialog>
            <ResponsiveDialog.Trigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Start New Period
              </Button>
            </ResponsiveDialog.Trigger>
            <ResponsiveDialog.Content>
              <CreateMonthForm />
            </ResponsiveDialog.Content>
          </ResponsiveDialog>

          <Link href="/mess/dashboard/all-months">
            <Button variant="secondary">Manage Periods</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
