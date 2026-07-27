'use client';

import { cn } from '@/utils/cn';
import { useCurrentPeriod } from '@/hooks/use-periods';
import { useWorkspace } from '@/providers/workspace-provider';
import {
  BellIcon,
  Calendar,
  LayoutGrid,
  Menu,
  PieChart,
  PlusCircle,
  Send,
  Settings,
  Users,
  Wallet,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { ComponentType, ReactNode, SVGProps, useState } from 'react';
import { Links } from '../links';
import ThemeToggle from '../common/theme-toggle';
import UserDropdown from '../common/user-dropdown';

interface DashboardLayoutProps {
  children: ReactNode;
}

interface NavItemProps {
  children: ReactNode;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  isActive?: boolean;
}

function NavItem({ children, icon: Icon, isActive = false }: NavItemProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white',
        { 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white': isActive },
      )}
    >
      <Icon className="size-5" />
      {children}
    </div>
  );
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const path = usePathname();
  const workspaceId = useWorkspace().member?.workspaceId || '';
  const { data: currentPeriod } = useCurrentPeriod(workspaceId);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const currentMonthPath = currentPeriod
    ? `/mess/dashboard/all-months/${currentPeriod.id}`
    : '/mess/dashboard/all-months';
  const isCurrentMonthActive = path === currentMonthPath;
  const isAllMonthsActive =
    path === '/mess/dashboard/all-months' ||
    (path.includes('/all-months') && !isCurrentMonthActive);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-10 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform dark:border-gray-700 dark:bg-gray-800 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} tablet:relative tablet:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-700">
          <Links.Mess className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
              <PieChart className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">MessMate</span>
          </Links.Mess>
          <button
            onClick={toggleSidebar}
            className="tablet:hidden rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-2 py-4">
          <Links.Dashboard>
            <NavItem icon={LayoutGrid} isActive={path === '/mess/dashboard'}>
              Dashboard
            </NavItem>
          </Links.Dashboard>
          <Links.Invitations>
            <NavItem icon={Send} isActive={path.includes('/invitations')}>
              Invitations
            </NavItem>
          </Links.Invitations>

          <Links.DataEntry>
            <NavItem icon={PlusCircle} isActive={path.includes('/data-entry')}>
              Data Entry
            </NavItem>
          </Links.DataEntry>

          <Links.CurrentMonth>
            <NavItem icon={Calendar} isActive={isCurrentMonthActive}>
              Current Month
            </NavItem>
          </Links.CurrentMonth>

          <Links.AllMonths>
            <NavItem icon={Calendar} isActive={isAllMonthsActive}>
              All Months
            </NavItem>
          </Links.AllMonths>

          <Links.MemberBalances>
            <NavItem icon={Wallet} isActive={path.includes('/member-balances')}>
              Member Balances
            </NavItem>
          </Links.MemberBalances>

          <Links.Members>
            <NavItem icon={Users} isActive={path.includes('/members')}>
              All Members
            </NavItem>
          </Links.Members>

          <Links.Settings>
            <NavItem icon={Settings} isActive={path.includes('/settings')}>
              Settings
            </NavItem>
          </Links.Settings>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Top header */}
        <header className="tablet:justify-end flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-800">
          <button
            onClick={toggleSidebar}
            className="tablet:hidden rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center space-x-3">
            <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 p-1 text-gray-600 hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white">
              <span className="sr-only">Notifications</span>
              <BellIcon className="h-4 w-4" />
            </button>
            <ThemeToggle />
            <UserDropdown />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[var(--container-width)]">{children}</div>
        </main>
      </div>
    </div>
  );
}
