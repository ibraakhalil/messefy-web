import React, { useState } from 'react';
import { Bell, Moon, Sun, Building2, LogOut, RotateCw } from 'lucide-react';
import type { MessInfo, PeriodSummary } from '@/types/mess';
import { cn } from '@/lib/utils';

interface MessHeaderProps {
  messInfo: MessInfo;
  periodSummary: PeriodSummary;
  isDark: boolean;
  onToggleTheme: () => void;
  userName?: string;
  onLogout?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const MessHeader: React.FC<MessHeaderProps> = ({
  messInfo,
  periodSummary,
  isDark,
  onToggleTheme,
  userName = 'User',
  onLogout,
  onRefresh,
  isRefreshing = false,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

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
        <div className="flex items-center gap-2 relative">
          {/* Refresh Button */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              aria-label="Refresh data"
              className="size-9 rounded-full bg-secondary-bg hover:bg-card-shade flex items-center justify-center text-icon-color transition-colors active:scale-95 disabled:opacity-50"
            >
              <RotateCw className={cn('size-4', isRefreshing && 'animate-spin text-emerald-600')} />
            </button>
          )}

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

          {/* User Avatar with Dropdown */}
          <button
            onClick={() => setShowProfileMenu((prev) => !prev)}
            aria-label="Profile menu"
            className="size-9 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-700 text-white font-bold text-xs flex items-center justify-center shadow-xs ring-2 ring-emerald-500/30 active:scale-95 transition"
          >
            {getInitials(userName)}
          </button>

          {/* Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 top-11 w-44 rounded-2xl border border-border-color bg-card-bg p-1.5 shadow-xl shadow-black/10 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-border-color/60">
                <p className="text-xs font-bold text-pure-color truncate">{userName}</p>
                <p className="text-[10px] text-subtitle-color">লগইন করা আছে</p>
              </div>

              {onLogout && (
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onLogout();
                  }}
                  className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition text-left"
                >
                  <LogOut className="size-3.5" />
                  <span>লগআউট করুন</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
