import { useState, useEffect, useMemo } from 'react';
import { Building2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useWorkspace, useWorkspaceMembers } from '@/hooks/use-workspace';
import { useCurrentWorkspaceSummary } from '@/hooks/use-dashboard-summary';
import {
  getBanglaPeriodName,
  getDaysRemainingInPeriod,
  formatTimeAgo,
  getTodayDateString,
  formatBanglaDate,
  formatBanglaWeekday,
} from '@/lib/period-utils';
import { useMealChart, useUpsertMeal } from '@/hooks/use-meals';
import { AuthScreen } from '@/components/auth/AuthScreen';
import { NoWorkspaceView } from '@/components/workspace/NoWorkspaceView';
import { MessHeader } from '@/components/home/MessHeader';
import { PeriodSummaryCard } from '@/components/home/PeriodSummaryCard';
import { MyStatusCard } from '@/components/home/MyStatusCard';
import { TodayMealCard } from '@/components/home/TodayMealCard';
import { QuickActions } from '@/components/home/QuickActions';
import { RecentActivityList } from '@/components/home/RecentActivityList';
import { MealsScreen } from '@/components/meals/MealsScreen';
import { MealEntryModal } from '@/components/meals/MealEntryModal';
import { ExpensesScreen } from '@/components/finances/ExpensesScreen';
import { DepositEntryModal } from '@/components/finances/DepositEntryModal';
import { ExpenseEntryModal } from '@/components/finances/ExpenseEntryModal';
import { BottomNavbar, type NavTab } from '@/components/navigation/BottomNavbar';
import type { TodayMeals, MessActivity } from '@/types/mess';

export function App() {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const {
    member,
    workspace,
    hasWorkspace,
    isLoading: workspaceLoading,
    refetchWorkspace,
  } = useWorkspace();

  const {
    data: summary,
    isLoading: isSummaryLoading,
    isRefetching: isSummaryRefetching,
    refetch: refetchSummary,
  } = useCurrentWorkspaceSummary(workspace?.id);

  const [isDark, setIsDark] = useState<boolean>(() => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isMealEntryModalOpen, setIsMealEntryModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Workspace members query for deposits and meal assignments
  const { data: workspaceMembers = [] } = useWorkspaceMembers(workspace?.id);

  // Meal Chart & Upsert hooks for active period
  const activePeriodId = summary?.period?.id || '';
  const { data: mealChart } = useMealChart(activePeriodId);
  const { mutateAsync: upsertMeal, isPending: isUpdatingMeal } = useUpsertMeal();

  const isManager = member ? ['owner', 'admin', 'manager'].includes(member.role) : false;

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

  // Compute today's meal entry from live backend chart
  const todayDateStr = getTodayDateString();
  const todayEntry = useMemo(() => {
    if (!mealChart?.entries || !member?.id) return null;
    return mealChart.entries.find(
      (e) => e.memberId === member.id && e.date === todayDateStr
    );
  }, [mealChart, member, todayDateStr]);

  const todayMeals: TodayMeals = useMemo(() => {
    const lunch = todayEntry?.lunch ?? 0;
    const dinner = todayEntry?.dinner ?? 0;
    const status = lunch > 0 || dinner > 0 ? 'active' : 'off';
    return {
      date: `${formatBanglaWeekday(todayDateStr)}, ${formatBanglaDate(todayDateStr)}`,
      lunch,
      dinner,
      status,
    };
  }, [todayEntry, todayDateStr]);

  // Derive user's member stats from live backend summary
  const myMemberSummary =
    summary?.members && user ? summary.members.find((m) => m.userId === user.id) : null;

  // Map live recent deposits and expenses into activity list
  const liveActivities = useMemo<MessActivity[]>(() => {
    if (!summary) return [];
    const deposits = summary.recentDeposits.map((d) => ({
      id: `dep-${d.id}`,
      title: `${d.memberName} (টাকা জমা)`,
      amount: d.amount,
      type: 'deposit' as const,
      author: d.memberName,
      timeAgo: formatTimeAgo(d.createdAt),
      rawTime: new Date(d.createdAt).getTime(),
    }));

    const expenses = summary.recentExpenses.map((e) => ({
      id: `exp-${e.id}`,
      title: e.title,
      amount: e.amount,
      type: 'expense' as const,
      author: e.note || 'বাজার খরচ',
      timeAgo: formatTimeAgo(e.createdAt),
      rawTime: new Date(e.createdAt).getTime(),
    }));

    return [...deposits, ...expenses]
      .sort((a, b) => b.rawTime - a.rawTime)
      .slice(0, 6)
      .map((item) => ({
        id: item.id,
        title: item.title,
        amount: item.amount,
        type: item.type,
        author: item.author,
        timeAgo: item.timeAgo,
      }));
  }, [summary]);

  const periodName = summary?.period
    ? getBanglaPeriodName(summary.period.year, summary.period.month)
    : 'চলতি মাস';

  const daysRemaining = summary?.period
    ? getDaysRemainingInPeriod(summary.period.year, summary.period.month)
    : 0;

  const handleUpdateLunch = async (delta: number) => {
    if (!workspace || !summary?.period || !member) {
      triggerToast('মেস বা পিরিয়ড পাওয়া যায়নি');
      return;
    }
    const newLunch = Math.max(0, todayMeals.lunch + delta);
    try {
      await upsertMeal({
        workspaceId: workspace.id,
        periodId: summary.period.id,
        memberId: member.id,
        date: todayDateStr,
        breakfast: todayEntry?.breakfast ?? 0,
        lunch: newLunch,
        dinner: todayMeals.dinner,
        mealId: todayEntry?.id,
      });
      triggerToast(`দুপুরের মিল আপডেট করা হয়েছে (${delta > 0 ? '+১' : '-১'})`);
    } catch (err: unknown) {
      console.error('Failed to update lunch:', err);
      triggerToast('মিল আপডেট করতে সমস্যা হয়েছে');
    }
  };

  const handleUpdateDinner = async (delta: number) => {
    if (!workspace || !summary?.period || !member) {
      triggerToast('মেস বা পিরিয়ড পাওয়া যায়নি');
      return;
    }
    const newDinner = Math.max(0, todayMeals.dinner + delta);
    try {
      await upsertMeal({
        workspaceId: workspace.id,
        periodId: summary.period.id,
        memberId: member.id,
        date: todayDateStr,
        breakfast: todayEntry?.breakfast ?? 0,
        lunch: todayMeals.lunch,
        dinner: newDinner,
        mealId: todayEntry?.id,
      });
      triggerToast(`রাতের মিল আপডেট করা হয়েছে (${delta > 0 ? '+১' : '-১'})`);
    } catch (err: unknown) {
      console.error('Failed to update dinner:', err);
      triggerToast('মিল আপডেট করতে সমস্যা হয়েছে');
    }
  };

  const handleToggleMealStatus = async () => {
    if (!workspace || !summary?.period || !member) {
      triggerToast('মেস বা পিরিয়ড পাওয়া যায়নি');
      return;
    }
    const nextStatus = todayMeals.status === 'active' ? 'off' : 'active';
    const nextLunch = nextStatus === 'off' ? 0 : 1;
    const nextDinner = nextStatus === 'off' ? 0 : 1;
    try {
      await upsertMeal({
        workspaceId: workspace.id,
        periodId: summary.period.id,
        memberId: member.id,
        date: todayDateStr,
        breakfast: nextStatus === 'off' ? 0 : (todayEntry?.breakfast ?? 0),
        lunch: nextLunch,
        dinner: nextDinner,
        mealId: todayEntry?.id,
      });
      triggerToast(nextStatus === 'off' ? 'আজকের মিল বন্ধ করা হলো' : 'আজকের মিল চালু করা হলো');
    } catch (err: unknown) {
      console.error('Failed to toggle meal status:', err);
      triggerToast('মিল স্ট্যাটাস পরিবর্তন করা সম্ভব হয়নি');
    }
  };

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'meal-entry':
        setIsMealEntryModalOpen(true);
        break;
      case 'deposit':
        setIsDepositModalOpen(true);
        break;
      case 'expense':
        setIsExpenseModalOpen(true);
        break;
      case 'members':
        setActiveTab('members');
        break;
      default:
        break;
    }
  };

  const handleRefresh = async () => {
    await Promise.all([refetchWorkspace(), refetchSummary()]);
    triggerToast('ডাটা সফলভাবে রিফ্রেশ করা হয়েছে');
  };

  // 1. Loading Splash Screen
  if (authLoading || (isAuthenticated && workspaceLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-lg animate-pulse">
            <Building2 className="size-7" />
          </div>
          <p className="text-xs font-semibold text-subtitle-color">মেসিফাই চালু হচ্ছে...</p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated: Auth Screen (Login / Register)
  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  // 3. Authenticated but No Mess/Workspace: Onboarding View
  if (!hasWorkspace || !workspace) {
    return <NoWorkspaceView onSuccess={refetchWorkspace} />;
  }

  // 4. Authenticated & In a Mess: Mobile Dashboard
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
          messInfo={{
            id: workspace.id,
            name: workspace.name,
            address: workspace.description || undefined,
            totalMembers: summary?.totals.memberCount || 1,
          }}
          periodSummary={{
            periodId: summary?.period.id || 'none',
            periodName: periodName,
            month: summary?.period.month || 1,
            year: summary?.period.year || 2026,
            status: summary?.period.status || 'open',
            daysRemaining,
            totals: {
              mealRate: summary?.totals.mealRate || 0,
              totalMeals: summary?.totals.totalMeals || 0,
              totalExpenses: summary?.totals.totalExpenses || 0,
              totalDeposits: summary?.totals.totalDeposits || 0,
            },
          }}
          isDark={isDark}
          onToggleTheme={() => setIsDark((prev) => !prev)}
          userName={user?.name || 'ব্যবহারকারী'}
          onLogout={logout}
          onRefresh={handleRefresh}
          isRefreshing={isSummaryRefetching}
        />

        {/* Main Body Content */}
        <main className="flex-1 space-y-4 px-4 pt-3.5 pb-24 overflow-y-auto">
          {activeTab === 'home' ? (
            <>
              {/* 1. Live Period Hero Card (Meal rate, Total meals, Total costs) */}
              <PeriodSummaryCard
                mealRate={summary?.totals.mealRate || 0}
                totalMeals={summary?.totals.totalMeals || 0}
                totalExpenses={summary?.totals.totalExpenses || 0}
                daysRemaining={daysRemaining}
                periodName={periodName}
                isOpen={Boolean(summary?.period.status === 'open')}
                isLoading={isSummaryLoading}
              />

              {/* 2. Live Personal Status (Balance, Deposits, Meals) */}
              <MyStatusCard
                myMeals={myMemberSummary?.meals || 0}
                myDeposit={myMemberSummary?.deposits || 0}
                balance={myMemberSummary?.balance || 0}
                role={member?.role || 'member'}
                isLoading={isSummaryLoading}
              />

              {/* 3. Today's Meal Counter & Status */}
              <TodayMealCard
                todayMeals={todayMeals}
                onUpdateLunch={handleUpdateLunch}
                onUpdateDinner={handleUpdateDinner}
                onToggleStatus={handleToggleMealStatus}
                isUpdating={isUpdatingMeal}
              />

              {/* 4. Quick Action Tiles */}
              <QuickActions onActionClick={handleQuickAction} />

              {/* 5. Live Recent Activity Feed */}
              <RecentActivityList
                activities={liveActivities}
                onViewAll={() => setActiveTab('expenses')}
                isLoading={isSummaryLoading}
              />

              {/* Quick Meal Entry Modal triggered from Home Quick Actions */}
              <MealEntryModal
                isOpen={isMealEntryModalOpen}
                onClose={() => setIsMealEntryModalOpen(false)}
                workspaceId={workspace.id}
                periodId={activePeriodId}
                currentMemberId={member.id}
                isManager={isManager}
                onSuccessToast={triggerToast}
              />

              {/* Quick Deposit Modal triggered from Home Quick Actions */}
              <DepositEntryModal
                isOpen={isDepositModalOpen}
                onClose={() => setIsDepositModalOpen(false)}
                workspaceId={workspace.id}
                periodId={activePeriodId}
                members={workspaceMembers}
                currentMemberId={member.id}
                isManager={isManager}
                onSuccessToast={triggerToast}
              />

              {/* Quick Expense Modal triggered from Home Quick Actions */}
              <ExpenseEntryModal
                isOpen={isExpenseModalOpen}
                onClose={() => setIsExpenseModalOpen(false)}
                workspaceId={workspace.id}
                periodId={activePeriodId}
                onSuccessToast={triggerToast}
              />
            </>
          ) : activeTab === 'meals' ? (
            <MealsScreen
              workspaceId={workspace.id}
              periodId={activePeriodId}
              periodYear={summary?.period.year || 2026}
              periodMonth={summary?.period.month || 1}
              currentMemberId={member.id}
              isManager={isManager}
              onSuccessToast={triggerToast}
            />
          ) : activeTab === 'expenses' ? (
            <ExpensesScreen
              workspaceId={workspace.id}
              periodId={activePeriodId}
              periodYear={summary?.period.year || 2026}
              periodMonth={summary?.period.month || 1}
              members={workspaceMembers}
              currentMemberId={member.id}
              isManager={isManager}
              mealRate={summary?.totals.mealRate || 0}
              onSuccessToast={triggerToast}
            />
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
