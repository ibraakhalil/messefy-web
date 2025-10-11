'use client';

import Button from '@/components/ui/button';
import {
  AlertCircle,
  Calendar,
  DollarSign,
  FileText,
  Plus,
  Receipt,
  Settings,
  TrendingUp,
  Users,
  Utensils,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  // Mock current month data
  const currentMonth = {
    name: 'December 2024',
    totalMembers: 8,
    totalMeals: 124,
    totalDeposits: 4500,
    totalExpenses: 3250,
    balance: 1250,
    mealRate: 26.21,
    daysRemaining: 16,
  };

  // Mock recent activity data
  const recentActivity = [
    { id: 1, type: 'meal', description: 'John Doe - Lunch', time: '2 hours ago', icon: Utensils },
    {
      id: 2,
      type: 'deposit',
      description: 'Jane Smith - $200 deposit',
      time: '5 hours ago',
      icon: DollarSign,
    },
    {
      id: 3,
      type: 'expense',
      description: 'Weekly groceries - $245',
      time: '1 day ago',
      icon: Receipt,
    },
  ];

  // Mock member balances (top outstanding)
  const memberBalances = [
    { name: 'Alice Brown', balance: -114.52, status: 'negative' },
    { name: 'Jane Smith', balance: -93.15, status: 'negative' },
    { name: 'Eva Martinez', balance: -88.31, status: 'negative' },
  ];

  const quickActions = [
    {
      title: 'Add Data',
      description: 'Meals, deposits & expenses',
      href: '/dashboard/data-entry',
      icon: Plus,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      title: 'Members',
      description: 'Manage mess members',
      href: '/dashboard/members',
      icon: Users,
      color: 'bg-emerald-600 hover:bg-emerald-700',
    },
    {
      title: 'Reports',
      description: 'Monthly statements',
      href: '/dashboard/reports',
      icon: FileText,
      color: 'bg-purple-600 hover:bg-purple-700',
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            {currentMonth.name} • {currentMonth.daysRemaining} days remaining
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/period-management">
            <Button variant="secondary" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Manage Period
            </Button>
          </Link>
          <Link href="/dashboard/settings">
            <Button variant="secondary" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* Current Month Summary */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {currentMonth.name} Overview
          </h2>
          <Link href="/dashboard/current-month">
            <Button variant="secondary" className="text-sm">
              View Details
            </Button>
          </Link>
        </div>

        <div className="laptop:grid-cols-4 grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20">
            <div className="mb-2 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm text-emerald-700 dark:text-emerald-300">Net Balance</span>
            </div>
            <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
              ${currentMonth.balance}
            </p>
          </div>

          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <div className="mb-2 flex items-center gap-2">
              <Utensils className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm text-blue-700 dark:text-blue-300">Meal Rate</span>
            </div>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              ${currentMonth.mealRate}
            </p>
          </div>

          <div className="rounded-lg bg-orange-50 p-4 dark:bg-orange-900/20">
            <div className="mb-2 flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <span className="text-sm text-orange-700 dark:text-orange-300">Active Members</span>
            </div>
            <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              {currentMonth.totalMembers}
            </p>
          </div>

          <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
            <div className="mb-2 flex items-center gap-2">
              <Receipt className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span className="text-sm text-purple-700 dark:text-purple-300">Total Meals</span>
            </div>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {currentMonth.totalMeals}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="tablet:grid-cols-3 grid grid-cols-1 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.title} href={action.href}>
              <div
                className={`${action.color} rounded-lg p-6 text-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{action.title}</h3>
                    <p className="text-sm opacity-90">{action.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="laptop:grid-cols-3 grid grid-cols-1 gap-6">
        {/* Main Content */}
        <div className="laptop:col-span-2 space-y-6">
          {/* Outstanding Balances Alert */}
          {memberBalances.some((m) => m.status === 'negative') && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Outstanding Balances
                  </h3>
                  <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                    {memberBalances.filter((m) => m.status === 'negative').length} members have
                    negative balances that need attention.
                  </p>
                  <Link href="/dashboard/member-balances">
                    <Button variant="secondary" className="mt-2 text-xs">
                      View All Balances
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Activity
              </h2>
              <Link href="/dashboard/current-month">
                <Button variant="secondary" className="text-sm">
                  View All
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-gray-600">
                      <Icon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Outstanding Balances */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Outstanding Balances
            </h2>
            <div className="space-y-3">
              {memberBalances.map((member) => (
                <div
                  key={member.name}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {member.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Owes</p>
                  </div>
                  <span className="font-semibold text-red-600 dark:text-red-400">
                    ${Math.abs(member.balance)}
                  </span>
                </div>
              ))}
            </div>
            <Link href="/dashboard/member-balances">
              <Button variant="secondary" className="mt-4 w-full text-sm">
                View All Balances
              </Button>
            </Link>
          </div>

          {/* Quick Navigation */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Quick Navigation
            </h2>
            <div className="space-y-2">
              <Link href="/dashboard/history" className="block">
                <div className="rounded-lg p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">All Months</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">View historical data</p>
                </div>
              </Link>
              <Link href="/dashboard/reports" className="block">
                <div className="rounded-lg p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Generate Reports
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Export statements</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
