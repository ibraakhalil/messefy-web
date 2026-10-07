import React from 'react';
import { Home, Utensils, Receipt, Users, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export type NavTab = 'home' | 'meals' | 'expenses' | 'members' | 'profile';

interface BottomNavbarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const BottomNavbar: React.FC<BottomNavbarProps> = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'হোম', icon: Home },
    { id: 'meals' as NavTab, label: 'মিল হিসাব', icon: Utensils },
    { id: 'expenses' as NavTab, label: 'বাজার খরচ', icon: Receipt },
    { id: 'members' as NavTab, label: 'মেম্বারস', icon: Users },
    { id: 'profile' as NavTab, label: 'প্রোফাইল', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border-color bg-card-bg/95 backdrop-blur-lg safe-bottom">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex flex-col items-center justify-center py-1 px-3 rounded-xl transition active:scale-90',
                isActive
                  ? 'text-emerald-700 dark:text-emerald-400 font-semibold'
                  : 'text-subtitle-color hover:text-pure-color'
              )}
            >
              <div className="relative">
                <Icon className={cn('size-5 transition', isActive && 'scale-110')} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-1 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                )}
              </div>
              <span className="mt-1 text-[11px] leading-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
