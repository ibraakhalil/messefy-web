'use client';

import * as React from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export interface DatePickerProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value?: string;
  onChange?: (e: any) => void;
  label?: string;
  error?: string;
  containerClassName?: string;
  placeholder?: string;
}

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      value,
      onChange,
      label,
      error,
      id,
      name,
      disabled,
      className,
      containerClassName,
      placeholder = 'Pick a date',
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);

    const selectedDate = React.useMemo(() => {
      if (!value) return undefined;
      try {
        if (typeof value === 'string') {
          const parsed = parseISO(value);
          if (!isNaN(parsed.getTime())) return parsed;
        }
      } catch {
        return undefined;
      }
      return undefined;
    }, [value]);

    const handleSelectDate = (date: Date | undefined) => {
      if (!date) return;
      const formattedString = format(date, 'yyyy-MM-dd');

      if (onChange) {
        if (typeof onChange === 'function') {
          const syntheticEvent = {
            target: {
              name: name || id || '',
              value: formattedString,
            },
          } as React.ChangeEvent<HTMLInputElement>;

          onChange(syntheticEvent);
        }
      }
      setOpen(false);
    };

    return (
      <div className={cn('w-full space-y-1.5', containerClassName)}>
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              id={id}
              disabled={disabled}
              className={cn(
                'flex w-full cursor-pointer items-center gap-2 rounded-lg border border-orange-500/40 bg-orange-50/50 px-3 py-1.5 text-left font-semibold text-gray-900 shadow-sm transition-all hover:border-orange-500 hover:bg-orange-100/60 focus:outline-none focus:ring-2 focus:ring-orange-500/30 dark:border-orange-500/40 dark:bg-orange-950/30 dark:text-white dark:hover:border-orange-400 dark:hover:bg-orange-950/50',
                disabled && 'cursor-not-allowed opacity-50 hover:border-orange-500/40 hover:bg-orange-50/50',
                error && 'border-red-500 hover:border-red-500 focus:ring-red-500/30 dark:border-red-500',
                className,
              )}
            >
              <CalendarIcon className="h-4 w-4 shrink-0 text-orange-600 dark:text-orange-400" />
              <span className="text-xs sm:text-sm">
                {selectedDate ? format(selectedDate, 'MMMM dd, yyyy') : placeholder}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleSelectDate}
            />
          </PopoverContent>
        </Popover>

        <input
          ref={ref}
          type="hidden"
          id={id}
          name={name}
          value={value || ''}
          {...props}
        />

        {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>
    );
  },
);

DatePicker.displayName = 'DatePicker';

export default DatePicker;
