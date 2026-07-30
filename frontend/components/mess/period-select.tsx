import type { Period } from '@/types/period';
import { CalendarDays, ChevronDown } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

export function PeriodSelect({
  periods,
  value,
  onChange,
  id,
  label,
}: {
  periods: Period[];
  value: string;
  onChange: (periodId: string) => void;
  id: string;
  label?: string;
}) {
  const t = useTranslations('Mess.periodSelect');
  const locale = useLocale();
  const localeCode = locale === 'bn' ? 'bn-BD' : 'en-US';

  const periodFormatter = new Intl.DateTimeFormat(localeCode, {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-emerald-100">
          {label}
        </label>
      )}
      <div className="relative">
        <CalendarDays
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-emerald-800"
          aria-hidden="true"
        />
        <select
          id={id}
          aria-label={label || t('label')}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-white/40 bg-white py-2 pr-9 pl-10 text-sm font-semibold text-emerald-950 shadow-sm transition outline-none focus:border-white focus:ring-2 focus:ring-white/50"
        >
          {periods.map((period) => (
            <option key={period.id} value={period.id}>
              {periodFormatter.format(new Date(period.year, period.month - 1))}
              {period.status === 'open' ? ` — ${t('active')}` : ''}
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
