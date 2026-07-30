import type { Period } from '@/types/period';
import { CalendarDays, ChevronDown } from 'lucide-react';

const periodFormatter = new Intl.DateTimeFormat('en-BD', {
  month: 'long',
  year: 'numeric',
});

export function PeriodSelect({
  periods,
  value,
  onChange,
  id,
  label = 'Switch month',
}: {
  periods: Period[];
  value: string;
  onChange: (periodId: string) => void;
  id: string;
  label?: string;
}) {
  return (
    <div className="w-full">
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-emerald-100">
        {label}
      </label>
      <div className="relative">
        <CalendarDays
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-emerald-800"
          aria-hidden="true"
        />
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-white/40 bg-white py-2 pr-9 pl-10 text-sm font-semibold text-emerald-950 shadow-sm transition outline-none focus:border-white focus:ring-2 focus:ring-white/50"
        >
          {periods.map((period) => (
            <option key={period.id} value={period.id}>
              {periodFormatter.format(new Date(period.year, period.month - 1))}
              {period.status === 'open' ? ' — Active' : ''}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-emerald-800"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
