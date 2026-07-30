'use client';

import type { Workspace } from '@/types/workspace';
import { cn } from '@/utils/cn';
import type { User } from 'next-auth';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Bell, CalendarRange, CircleUserRound, LayoutGrid, ShieldCheck, Users } from 'lucide-react';

import OverviewTab from './overview-tab';

const ProfileSection = dynamic(() => import('@/components/profile/profile-section'), {
  loading: () => <SectionSkeleton />,
});
const NotificationsSection = dynamic(() => import('@/components/profile/notifications-section'), {
  loading: () => <SectionSkeleton />,
});
const SecuritySection = dynamic(() => import('@/components/profile/security-section'), {
  loading: () => <SectionSkeleton />,
});
const MealChartTab = dynamic(() => import('./meal-chart-tab'), {
  loading: () => <SectionSkeleton />,
});
const TotalMessMembers = dynamic(() => import('./total-mess-members'), {
  loading: () => <SectionSkeleton />,
});

const tabs = [
  {
    id: 'overview',
    label: 'Overview',
    icon: LayoutGrid,
    description: 'Your mess at a glance',
  },
  {
    id: 'meal-chart',
    label: 'Meal Chart',
    icon: CalendarRange,
    description: 'Daily member meals',
  },
  {
    id: 'members',
    label: 'Members',
    icon: Users,
    description: 'Everyone in your mess',
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: CircleUserRound,
    description: 'Personal details',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    description: 'Invitations & alerts',
  },
  {
    id: 'security',
    label: 'Security',
    icon: ShieldCheck,
    description: 'Password & sessions',
  },
] as const;

type TabId = (typeof tabs)[number]['id'];

interface UserData {
  user: User | undefined;
  workspace: Workspace | undefined;
}

function SectionSkeleton() {
  return (
    <div className="space-y-4" aria-label="Loading section" role="status">
      <div className="bg-card-shade h-10 w-2/5 animate-pulse rounded-lg motion-reduce:animate-none" />
      <div className="bg-card-shade h-28 animate-pulse rounded-xl motion-reduce:animate-none" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export function MessPageContents({
  userData,
  initialTab = 'overview',
}: {
  userData: UserData;
  initialTab?: TabId;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);
  const visibleTabs = userData.workspace
    ? tabs
    : tabs.filter((tab) => tab.id !== 'meal-chart' && tab.id !== 'members');
  const selectedTab = visibleTabs.find((tab) => tab.id === activeTab) ?? visibleTabs[0];

  const selectTab = (tab: TabId) => {
    setActiveTab(tab);
    router.replace(tab === 'overview' ? pathname : `${pathname}?tab=${tab}`, { scroll: false });
  };

  return (
    <>
      <section className="tablet:mb-8 tablet:flex-row tablet:items-center tablet:justify-between mb-6 flex flex-col gap-4">
        <div>
          <p className="mb-2 text-sm font-semibold tracking-wide text-emerald-700 uppercase dark:text-emerald-400">
            Personal Hub
          </p>
          <h1 className="text-pure-color tablet:text-4xl text-3xl font-bold tracking-tight text-balance">
            {userData.workspace ? userData.workspace.name : 'Welcome to Mess Mate'}
          </h1>
          <p className="text-subtitle-color tablet:text-base mt-2 max-w-2xl text-sm leading-6">
            {userData.workspace
              ? 'Mess stats, account preferences, and controls in one place.'
              : 'Set up your account, create a mess, or join your friends with an invitation.'}
          </p>
        </div>

        {userData.workspace && (
          <Link
            href="/mess/dashboard"
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            <LayoutGrid className="size-4" aria-hidden="true" />
            <span>Dashboard</span>
          </Link>
        )}
      </section>

      <div className="laptop:grid-cols-[248px_minmax(0,1fr)] grid items-start gap-6">
        <aside className="border-border-color bg-card-bg laptop:sticky laptop:top-20 laptop:block laptop:h-[calc(100dvh-7rem)] laptop:overflow-y-auto laptop:overscroll-contain hidden rounded-2xl border p-2 shadow-sm">
          <nav aria-label="Account sections">
            <div className="space-y-1" role="tablist" aria-orientation="vertical">
              {visibleTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = selectedTab.id === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`tab-${tab.id}`}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`panel-${tab.id}`}
                    onClick={() => selectTab(tab.id)}
                    className={cn(
                      'flex w-full touch-manipulation items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2',
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                        : 'text-subtitle-color hover:bg-secondary-bg hover:text-pure-color',
                    )}
                  >
                    <span
                      className={cn(
                        'flex size-9 shrink-0 items-center justify-center rounded-lg',
                        isActive ? 'bg-emerald-600 text-white' : 'bg-card-shade text-icon-color',
                      )}
                    >
                      <Icon className="size-[18px]" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">{tab.label}</span>
                      <span className="block truncate text-xs opacity-75">{tab.description}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>
        </aside>

        <nav
          aria-label="Account sections"
          className="border-border-color bg-card-bg laptop:hidden -mx-4 overflow-x-auto border-y px-4"
        >
          <div className="flex min-w-max gap-1" role="tablist">
            {visibleTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = selectedTab.id === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`mobile-tab-${tab.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.id}`}
                  onClick={() => selectTab(tab.id)}
                  className={cn(
                    'flex min-h-14 touch-manipulation items-center gap-2 border-b-2 px-3 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-inset',
                    isActive
                      ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                      : 'text-subtitle-color hover:text-pure-color border-transparent',
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </nav>

        <section
          id={`panel-${selectedTab.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${selectedTab.id}`}
          className="min-w-0"
        >
          {selectedTab.id === 'overview' ? (
            <OverviewTab userData={userData} />
          ) : selectedTab.id === 'meal-chart' ? (
            <MealChartTab />
          ) : selectedTab.id === 'members' ? (
            <TotalMessMembers />
          ) : (
            <div className="border-border-color bg-card-bg tablet:p-7 rounded-2xl border p-5 shadow-sm">
              <div className="border-border-color mb-7 border-b pb-5">
                <h2 className="text-pure-color text-xl font-bold text-balance">
                  {selectedTab.label}
                </h2>
                <p className="text-subtitle-color mt-1 text-sm">{selectedTab.description}</p>
              </div>
              {selectedTab.id === 'profile' ? <ProfileSection /> : null}
              {selectedTab.id === 'notifications' ? <NotificationsSection /> : null}
              {selectedTab.id === 'security' ? <SecuritySection /> : null}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
