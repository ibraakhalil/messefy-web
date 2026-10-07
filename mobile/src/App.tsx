import { useState, useEffect } from 'react';
import { MessHeader } from '@/components/home/MessHeader';
import { PeriodSummaryCard } from '@/components/home/PeriodSummaryCard';
import { MyStatusCard } from '@/components/home/MyStatusCard';
import { TodayMealCard } from '@/components/home/TodayMealCard';
import { QuickActions } from '@/components/home/QuickActions';
import { RecentActivityList } from '@/components/home/RecentActivityList';
import { BottomNavbar, type NavTab } from '@/components/navigation/BottomNavbar';
import type { MessInfo, PeriodSummary, UserMessStatus, TodayMeals, MessActivity } from '@/types/mess';

// Initial Mock Data mirroring Messefy Web backend & DB structure
const INITIAL_MESS_INFO: MessInfo = {
  id: 'mess-01',
  name: 'নূর মঞ্জিল মেস',
  address: 'বাড়ি #১২, রোড #৪, ধানমন্ডি, ঢাকা',
  totalMembers: 8,
};

const INITIAL_PERIOD_SUMMARY: PeriodSummary = {
  periodId: 'period-2026-10',
  periodName: 'মার্চ ২০২৬',
  month: 3,
  year: 2026,
  status: 'open',
  daysRemaining: 23,
  totals: {
    mealRate: 46.5,
    totalMeals: 214,
    totalExpenses: 9951,
    totalDeposits: 14000,
  },
};

const INITIAL_USER_STATUS: UserMessStatus = {
  userId: 'user-01',
  userName: 'ইব্রাহিম খলিল',
  role: 'manager',
  myMeals: 38,
  myDeposit: 3500,
  myCost: 1767, // 38 * 46.5
  balance: 1733, // 3500 - 1767 = +1733 (surplus)
  isManager: true,
};

const INITIAL_ACTIVITIES: MessActivity[] = [
  {
    id: 'act-1',
    title: 'দৈনিক বাজার (মুরগি, ডিম ও সবজি)',
    amount: 1450,
    type: 'expense',
    author: 'শাকিল আহমেদ',
    timeAgo: '২ ঘণ্টা আগে',
  },
  {
    id: 'act-2',
    title: 'মাসের মিল ফি জমা',
    amount: 3000,
    type: 'deposit',
    author: 'রাকিব হাসান',
    timeAgo: '৫ ঘণ্টা আগে',
  },
  {
    id: 'act-3',
    title: 'মশলা ও রান্নার তেল',
    amount: 620,
    type: 'expense',
    author: 'ইব্রাহিম খলিল',
    timeAgo: 'গতকাল',
  },
  {
    id: 'act-4',
    title: 'খাবার পানির জার রিফিল (৪টি)',
    amount: 320,
    type: 'expense',
    author: 'আরিফ হোসেন',
    timeAgo: '২ দিন আগে',
  },
];

const DEFAULT_TODAY_MEALS: TodayMeals = {
  date: 'বুধবার, ২৫ মার্চ',
  lunch: 1,
  dinner: 1,
  status: 'active',
};

export function App() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [todayMeals, setTodayMeals] = useState<TodayMeals>(DEFAULT_TODAY_MEALS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync dark class on document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleUpdateLunch = (delta: number) => {
    setTodayMeals((prev) => ({
      ...prev,
      lunch: Math.max(0, prev.lunch + delta),
    }));
    triggerToast(`দুপুরের মিল আপডেট করা হয়েছে (${delta > 0 ? '+1' : '-1'})`);
  };

  const handleUpdateDinner = (delta: number) => {
    setTodayMeals((prev) => ({
      ...prev,
      dinner: Math.max(0, prev.dinner + delta),
    }));
    triggerToast(`রাতের মিল আপডেট করা হয়েছে (${delta > 0 ? '+1' : '-1'})`);
  };

  const handleToggleMealStatus = () => {
    setTodayMeals((prev) => {
      const nextStatus = prev.status === 'active' ? 'off' : 'active';
      triggerToast(nextStatus === 'off' ? 'আজকের মিল বন্ধ করা হলো' : 'আজকের মিল চালু করা হলো');
      return {
        ...prev,
        status: nextStatus,
        lunch: nextStatus === 'off' ? 0 : 1,
        dinner: nextStatus === 'off' ? 0 : 1,
      };
    });
  };

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'meal-entry':
        triggerToast('মিল এন্ট্রি প্যানেল শীঘ্রই যুক্ত হচ্ছে...');
        break;
      case 'deposit':
        triggerToast('টাকা জমার এন্ট্রি ফর্ম ওপেন হচ্ছে...');
        break;
      case 'expense':
        triggerToast('বাজার খরচের হিসাব এন্ট্রি ফর্ম ওপেন হচ্ছে...');
        break;
      case 'members':
        setActiveTab('members');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-primary-bg text-pure-color transition-colors">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="rounded-full bg-emerald-700 dark:bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-lg">
            {toastMessage}
          </div>
        </div>
      )}

      {/* Mobile Wrapper */}
      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-primary-bg shadow-2xl relative">
        {/* App Top Bar */}
        <MessHeader
          messInfo={INITIAL_MESS_INFO}
          periodSummary={INITIAL_PERIOD_SUMMARY}
          isDark={isDark}
          onToggleTheme={() => setIsDark((prev) => !prev)}
        />

        {/* Main Body Content */}
        <main className="flex-1 space-y-4 px-4 pt-3.5 pb-24 overflow-y-auto">
          {activeTab === 'home' ? (
            <>
              {/* 1. Month Hero Card (Meal rate, Total meals, Total costs) */}
              <PeriodSummaryCard summary={INITIAL_PERIOD_SUMMARY} />

              {/* 2. Personal Status (Balance, Deposits, Meals) */}
              <MyStatusCard userStatus={INITIAL_USER_STATUS} />

              {/* 3. Today's Meal Counter & Status */}
              <TodayMealCard
                todayMeals={todayMeals}
                onUpdateLunch={handleUpdateLunch}
                onUpdateDinner={handleUpdateDinner}
                onToggleStatus={handleToggleMealStatus}
              />

              {/* 4. Quick Action Tiles */}
              <QuickActions onActionClick={handleQuickAction} />

              {/* 5. Recent Activity Feed */}
              <RecentActivityList
                activities={INITIAL_ACTIVITIES}
                onViewAll={() => setActiveTab('expenses')}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="size-16 rounded-2xl bg-secondary-bg flex items-center justify-center text-subtitle-color text-2xl font-bold mb-3">
                🚧
              </div>
              <h2 className="text-base font-bold text-pure-color">কাজ চলমান রয়েছে</h2>
              <p className="mt-1 text-xs text-subtitle-color max-w-xs">
                এই সেকশনটি পরবর্তী ধাপে আমাদের Hono ব্যাকএন্ডের সাথে যুক্ত হবে ইনশাআল্লাহ।
              </p>
              <button
                onClick={() => setActiveTab('home')}
                className="mt-4 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm"
              >
                হোমপেজে ফিরে যান
              </button>
            </div>
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNavbar currentTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}

export default App;
