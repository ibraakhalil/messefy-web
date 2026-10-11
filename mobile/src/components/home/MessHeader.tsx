import React, { useState } from 'react';
import {
  Bell,
  Moon,
  Sun,
  Building2,
  LogOut,
  RotateCw,
  User,
  ChevronDown,
  Menu,
  Home,
  Utensils,
  Receipt,
  Users,
  ChevronRight,
} from 'lucide-react';
import type { MessInfo, PeriodSummary } from '@/types/mess';
import type { NavTab } from '@/components/navigation/BottomNavbar';
import { cn } from '@/lib/utils';
import { haptics } from '@/lib/haptics';
import { toBanglaNumber } from '@/lib/period-utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface MessHeaderProps {
  messInfo: MessInfo;
  periodSummary: PeriodSummary;
  isDark: boolean;
  onToggleTheme: () => void;
  userName?: string;
  onLogout?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onNavigateProfile?: () => void;
  currentTab?: NavTab;
  onNavigateTab?: (tab: NavTab) => void;
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
  onNavigateProfile,
  currentTab = 'home',
  onNavigateTab,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const sidebarNavItems: {
    tab: NavTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { tab: 'home', label: 'হোম ড্যাশবোর্ড', icon: Home },
    { tab: 'meals', label: 'মিল হিসাব ও শিট', icon: Utensils },
    { tab: 'expenses', label: 'বাজার খরচ ও লেজার', icon: Receipt },
    { tab: 'members', label: 'সদস্য তালিকা ও ব্যালেন্স', icon: Users },
    { tab: 'profile', label: 'আমার প্রোফাইল ও সেটিংস', icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 bg-card-bg/80 backdrop-blur-md border-b border-border-color px-4 py-3 transition-colors">
      <div className="flex items-center justify-between">
        {/* Left Side: Hamburger Menu & Mess Title */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              haptics.selection();
              setIsSidebarOpen(true);
            }}
            aria-label="মেনু খুলুন"
            className="size-10 rounded-xl bg-secondary-bg hover:bg-card-shade flex items-center justify-center text-pure-color border border-border-color shadow-xs active:scale-95 transition"
          >
            <Menu className="size-5" />
          </button>
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
          {/* Notifications */}
          <button
            aria-label="Notifications"
            className="relative size-9 rounded-full bg-secondary-bg hover:bg-card-shade flex items-center justify-center text-icon-color transition-colors active:scale-95"
          >
            <Bell className="size-4" />
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-rose-500 ring-2 ring-card-bg" />
          </button>

          {/* User Avatar with Shadcn DropdownMenu */}
          <DropdownMenu open={showProfileMenu} onOpenChange={setShowProfileMenu}>
            <DropdownMenuTrigger asChild>
              <button
                onClick={() => haptics.selection()}
                aria-label="Profile menu"
                className="relative size-9 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center shadow-xs active:scale-95 transition"
              >
                <span>{getInitials(userName)}</span>
                <span className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full bg-card-bg text-primary border border-border-color flex items-center justify-center shadow-xs transition-colors">
                  <ChevronDown
                    className={cn(
                      'size-2.5 stroke-[2.5] transition-transform duration-200',
                      showProfileMenu && 'rotate-180'
                    )}
                  />
                </span>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48 p-1.5">
              <div className="px-3 py-2 border-b border-border-color/60">
                <p className="text-xs font-bold text-pure-color truncate">{userName}</p>
                <p className="text-[10px] text-subtitle-color">লগইন করা আছে</p>
              </div>

              {/* Profile Link */}
              {onNavigateProfile && (
                <DropdownMenuItem
                  onClick={() => {
                    haptics.selection();
                    onNavigateProfile();
                  }}
                  className="mt-1"
                >
                  <User className="size-3.5 text-primary" />
                  <span>আমার প্রোফাইল</span>
                </DropdownMenuItem>
              )}

              {/* Data Refresh / Reload Button */}
              {onRefresh && (
                <DropdownMenuItem
                  onClick={() => {
                    haptics.selection();
                    onRefresh();
                  }}
                  disabled={isRefreshing}
                >
                  <RotateCw
                    className={cn(
                      'size-3.5 text-primary',
                      isRefreshing && 'animate-spin'
                    )}
                  />
                  <span>{isRefreshing ? 'রিফ্রেশ হচ্ছে...' : 'ডাটা রিফ্রেশ করুন'}</span>
                </DropdownMenuItem>
              )}

              {/* Theme Toggle Button */}
              <DropdownMenuItem
                onClick={() => {
                  haptics.selection();
                  onToggleTheme();
                }}
                className="justify-between"
              >
                <div className="flex items-center gap-2.5">
                  {isDark ? (
                    <Sun className="size-3.5 text-amber-500" />
                  ) : (
                    <Moon className="size-3.5 text-primary" />
                  )}
                  <span>{isDark ? 'লাইট মোড' : 'ডার্ক মোড'}</span>
                </div>
                <span className="text-[10px] text-subtitle-color">
                  {isDark ? 'চালু' : 'বন্ধ'}
                </span>
              </DropdownMenuItem>

              {/* Divider */}
              {onLogout && <DropdownMenuSeparator />}

              {/* Logout Button */}
              {onLogout && (
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => {
                    haptics.warning();
                    onLogout();
                  }}
                >
                  <LogOut className="size-3.5" />
                  <span>লগআউট করুন</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Left Sidebar Drawer via shadcn Sheet */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="p-4 overflow-y-auto">
          {/* Top Section */}
          <div className="space-y-3.5">
            {/* Header Title */}
            <SheetHeader className="pb-3 border-b border-border-color/60 text-left pr-8">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-xs shrink-0">
                  <Building2 className="size-5" />
                </div>
                <div>
                  <SheetTitle className="text-sm font-bold text-pure-color">মেসিফাই</SheetTitle>
                  <SheetDescription className="text-[10px] text-subtitle-color">
                    মেস ম্যানেজমেন্ট সিস্টেম
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            {/* Mess Info Snapshot Card */}
            <div className="rounded-2xl bg-secondary-bg/80 border border-border-color p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold text-subtitle-color">বর্তমান মেস</span>
                <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                  {periodSummary.status === 'open' ? 'সক্রিয়' : 'বন্ধ'}
                </span>
              </div>
              <h3 className="text-xs font-bold text-pure-color truncate">{messInfo.name}</h3>
              <p className="text-[10px] text-subtitle-color mt-0.5">
                {periodSummary.periodName} • {toBanglaNumber(messInfo.totalMembers)} জন সদস্য
              </p>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1">
              <p className="text-[10px] font-bold text-subtitle-color uppercase tracking-wider px-2 py-1">
                গুরুত্বপূর্ণ মেনু
              </p>
              {sidebarNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.tab;
                return (
                  <button
                    key={item.tab}
                    onClick={() => {
                      haptics.selection();
                      setIsSidebarOpen(false);
                      onNavigateTab?.(item.tab);
                    }}
                    className={cn(
                      'flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition active:scale-98',
                      isActive
                        ? 'bg-primary text-white shadow-xs'
                        : 'text-pure-color hover:bg-secondary-bg'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={cn('size-4', isActive ? 'text-white' : 'text-primary')} />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight
                      className={cn(
                        'size-3.5',
                        isActive ? 'text-white/80' : 'text-subtitle-color'
                      )}
                    />
                  </button>
                );
              })}
            </nav>

            {/* Quick Actions & Preferences */}
            <div className="space-y-1 pt-2 border-t border-border-color/60">
              <p className="text-[10px] font-bold text-subtitle-color uppercase tracking-wider px-2 py-1">
                টুলস ও সেটিংস
              </p>

              {/* Refresh */}
              {onRefresh && (
                <button
                  onClick={() => {
                    haptics.selection();
                    onRefresh();
                  }}
                  disabled={isRefreshing}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-pure-color hover:bg-secondary-bg transition active:scale-98 disabled:opacity-50"
                >
                  <RotateCw className={cn('size-4 text-primary', isRefreshing && 'animate-spin')} />
                  <span>{isRefreshing ? 'রিফ্রেশ হচ্ছে...' : 'ডাটা রিফ্রেশ করুন'}</span>
                </button>
              )}

              {/* Theme Toggle */}
              <button
                onClick={() => {
                  haptics.selection();
                  onToggleTheme();
                }}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-pure-color hover:bg-secondary-bg transition active:scale-98"
              >
                <div className="flex items-center gap-3">
                  {isDark ? (
                    <Sun className="size-4 text-amber-500" />
                  ) : (
                    <Moon className="size-4 text-primary" />
                  )}
                  <span>{isDark ? 'লাইট মোড' : 'ডার্ক মোড'}</span>
                </div>
                <span className="text-[10px] text-subtitle-color font-normal">
                  {isDark ? 'চালু' : 'বন্ধ'}
                </span>
              </button>
            </div>
          </div>

          {/* Bottom Footer & Logout */}
          <div className="space-y-2 pt-3 border-t border-border-color/60">
            {onLogout && (
              <button
                onClick={() => {
                  haptics.warning();
                  setIsSidebarOpen(false);
                  onLogout();
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition active:scale-98"
              >
                <LogOut className="size-4" />
                <span>লগআউট করুন</span>
              </button>
            )}

            <div className="px-2 pt-1 text-center">
              <p className="text-[10px] text-subtitle-color">Messefy Mobile v1.0.0</p>
              <p className="text-[9px] text-subtitle-color/70 italic mt-0.5">
                «اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا»
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};


