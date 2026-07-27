'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className="border-border-color bg-card-bg text-subtitle-color hover:bg-secondary-bg flex h-9 w-9 items-center justify-center rounded-lg border transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
      >
        <span className="h-4 w-4" />
      </button>
    );
  }

  const isDark = (theme === 'system' ? resolvedTheme : theme) === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className="border-border-color bg-card-bg text-subtitle-color hover:bg-secondary-bg hover:text-pure-color flex h-9 w-9 items-center justify-center rounded-lg border transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
    >
      {isDark ? (
        <Sun className="size-[18px] text-amber-400" aria-hidden="true" />
      ) : (
        <Moon className="size-[18px] text-slate-700 dark:text-slate-200" aria-hidden="true" />
      )}
    </button>
  );
}
