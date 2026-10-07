import React from 'react';
import { Bell, Moon, Sun, Building2 } from 'lucide-react';
import type { MessInfo, PeriodSummary } from '@/types/mess';

interface MessHeaderProps {
  messInfo: MessInfo;
  periodSummary: PeriodSummary;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const MessHeader: React.FC<MessHeaderProps> = ({
  messInfo,
  periodSummary,
  isDark,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-card-bg/80 backdrop-blur-md border-b border-border-color px-4 py-3 transition-colors">
      <div className="flex items-center justify-between">
        {/* Mess Title & Location */}
        <div className="flex items-center gap-2.5">
          <div className="size-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-sm ring-2 ring-emerald-500/20">
            <Building2 className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-pure-color text-base leading-tight">
                {messInfo.name}
              </h1>
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-xs text-subtitle-color font-medium">
              {periodSummary.periodName} • {periodSummary.status === 'open' ? 'সক্রিয়' : 'বন্ধ'}
            </p>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2">
          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="size-9 rounded-full bg-secondary-bg hover:bg-card-shade flex items-center justify-center text-icon-color transition-colors active:scale-95"
          >
            {isDark ? <Sun className="size-4 text-amber-400" /> : <Moon className="size-4" />}
          </button>

          {/* Notifications */}
          <button
            aria-label="Notifications"
            className="relative size-9 rounded-full bg-secondary-bg hover:bg-card-shade flex items-center justify-center text-icon-color transition-colors active:scale-95"
          >
            <Bell className="size-4" />
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-rose-500 ring-2 ring-card-bg" />
          </button>

          {/* User Avatar */}
          <div className="size-9 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 text-white font-bold text-xs flex items-center justify-center shadow-xs ring-2 ring-card-bg">
            IK
          </div>
        </div>
      </div>
    </header>
  );
};
