import React from 'react';
import { Home, ReceiptText, BarChart3, Users, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { haptics } from '@/lib/haptics';

export type NavTab = 'home' | 'accounting' | 'reports' | 'members' | 'profile';

interface BottomNavbarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const BottomNavbar: React.FC<BottomNavbarProps> = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: 'accounting' as NavTab, label: 'হিসাব', icon: ReceiptText },
    { id: 'reports' as NavTab, label: 'রিপোর্ট', icon: BarChart3 },
    { id: 'home' as NavTab, label: 'হোম', icon: Home },
    { id: 'members' as NavTab, label: 'সদস্য', icon: Users },
    { id: 'profile' as NavTab, label: 'প্রোফাইল', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border-color bg-card-bg/95 backdrop-blur-xl shadow-lg pb-[env(safe-area-inset-bottom,0px)]">
      <div className="mx-auto grid h-16 max-w-md grid-cols-5 items-center px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                if (currentTab !== tab.id) {
                  haptics.selection();
                }
                onTabChange(tab.id);
              }}
              className="flex h-full flex-col items-center justify-center py-1 px-0.5 transition-all duration-150 active:scale-90"
            >
              <Icon
                className={cn(
                  'size-5 transition-transform duration-200 ease-out',
                  isActive
                    ? 'text-emerald-700 dark:text-emerald-400 scale-110'
                    : 'text-subtitle-color hover:text-pure-color scale-100'
                )}
              />
              <span
                className={cn(
                  'mt-1 text-[11px] leading-normal whitespace-nowrap text-center transition-colors duration-200',
                  isActive
                    ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                    : 'text-subtitle-color font-medium'
                )}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
