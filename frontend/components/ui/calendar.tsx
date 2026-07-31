'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { cn } from '@/utils/cn';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        month_caption: 'flex justify-between pt-1 relative items-center px-1',
        caption_label: 'text-sm font-semibold text-gray-900 dark:text-gray-100',
        nav: 'flex items-center gap-1',
        button_previous:
          'h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300',
        button_next:
          'h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300',
        month_grid: 'w-full border-collapse space-y-1',
        weekdays: 'flex',
        weekday:
          'text-gray-500 dark:text-gray-400 rounded-md w-9 font-medium text-[0.8rem] text-center',
        week: 'flex w-full mt-2',
        day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md hover:bg-orange-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors text-gray-900 dark:text-white',
        selected:
          'bg-orange-600 text-white hover:bg-orange-600 hover:text-white focus:bg-orange-600 focus:text-white font-medium dark:bg-orange-500 dark:text-white',
        today: 'bg-gray-100 text-orange-600 font-bold dark:bg-gray-800 dark:text-orange-400',
        outside:
          'text-gray-400 opacity-40 dark:text-gray-500 aria-selected:bg-orange-50/50 aria-selected:text-gray-500',
        disabled: 'text-gray-400 opacity-30 dark:text-gray-600',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === 'left' ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
