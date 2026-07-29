'use client';

import { Languages } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { startTransition, useState } from 'react';
import { localeLabels, locales, type AppLocale } from '@/i18n/config';
import { cn } from '@/utils/cn';

interface LocaleSwitcherProps {
  className?: string;
  compact?: boolean;
}

export default function LocaleSwitcher({ className, compact = false }: LocaleSwitcherProps) {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('LocaleSwitcher');
  const [isPending, setIsPending] = useState(false);

  async function changeLocale(nextLocale: AppLocale) {
    if (nextLocale === locale || isPending) return;

    setIsPending(true);

    try {
      const response = await fetch('/api/locale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale: nextLocale }),
      });

      if (!response.ok) throw new Error('Failed to update locale');

      startTransition(() => {
        router.refresh();
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <label
      className={cn(
        'border-border-color bg-card-bg text-pure-color inline-flex h-10 items-center gap-2 rounded-lg border px-2.5 text-sm',
        isPending && 'opacity-60',
        className,
      )}
    >
      <Languages className="text-subtitle-color size-4" aria-hidden="true" />
      <span className="sr-only">{t('label')}</span>
      <select
        aria-label={t('label')}
        className="cursor-pointer bg-transparent font-semibold outline-none"
        disabled={isPending}
        value={locale}
        onChange={(event) => void changeLocale(event.target.value as AppLocale)}
      >
        {locales.map((item) => (
          <option key={item} value={item}>
            {compact ? item.toUpperCase() : localeLabels[item]}
          </option>
        ))}
      </select>
    </label>
  );
}
