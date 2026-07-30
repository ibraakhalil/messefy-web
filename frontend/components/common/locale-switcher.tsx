'use client';

import { Languages, Check } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { startTransition, useState } from 'react';
import { localeLabels, locales, type AppLocale } from '@/i18n/config';
import { cn } from '@/utils/cn';
import { DropdownMenu } from '@/components/ui/drop-down';

interface LocaleSwitcherProps {
  className?: string;
  align?: 'start' | 'center' | 'end';
}

export default function LocaleSwitcher({ className, align = 'end' }: LocaleSwitcherProps) {
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
    } catch (error) {
      console.error('Failed to change locale:', error);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={t('label')}
          title={t('label')}
          disabled={isPending}
          className={cn(
            'border-border-color bg-card-bg text-subtitle-color hover:bg-secondary-bg hover:text-pure-color flex h-9 w-9 items-center justify-center rounded-lg border transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2',
            isPending && 'cursor-not-allowed opacity-60',
            className,
          )}
        >
          <Languages className="size-[18px]" aria-hidden="true" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align={align} className="min-w-[140px]">
        {locales.map((item) => (
          <DropdownMenu.Item
            key={item}
            onClick={() => void changeLocale(item)}
            className={cn(
              'flex cursor-pointer items-center justify-between gap-3 px-3 py-2 text-sm font-medium transition-colors',
              locale === item
                ? 'bg-secondary-bg text-pure-color font-semibold dark:bg-gray-800'
                : 'text-subtitle-color hover:bg-secondary-bg/50 hover:text-pure-color dark:text-gray-300 dark:hover:bg-gray-800/50',
            )}
          >
            <span>{localeLabels[item]}</span>
            {locale === item && <Check className="size-4 text-emerald-500" aria-hidden="true" />}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}

