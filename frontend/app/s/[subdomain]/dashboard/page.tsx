'use client'

import EmptyStateChecklist from '@/components/dashboard/empty-state-checklist'
import QuickStats from '@/components/dashboard/quick-state'
import Button from '@/components/ui/button'
import { Calendar, DollarSign, Receipt, TrendingUp, UserPlus, Utensils } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function DashboardPage() {
  const [isLoading] = useState(false)

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
    {
      id: 4,
      type: 'member',
      description: 'New member joined - Alice Brown',
      time: '2 days ago',
      icon: UserPlus,
    },
  ]

  const quickActions = [
    {
      title: 'Add Member',
      href: '/dashboard/add-member',
      icon: UserPlus,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      title: 'Add Deposit',
      href: '/dashboard/add-deposit',
      icon: DollarSign,
      color: 'bg-emerald-600 hover:bg-emerald-700',
    },
    {
      title: 'Add Meal',
      href: '/dashboard/add-meal',
      icon: Utensils,
      color: 'bg-orange-600 hover:bg-orange-700',
    },
    {
      title: 'Add Cost',
      href: '/dashboard/add-cost',
      icon: Receipt,
      color: 'bg-red-600 hover:bg-red-700',
    },
  ]

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Welcome back! Here's what's happening with your mess.
          </p>
        </div>
        <Link href="/dashboard/active-month">
          <Button variant="secondary" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            View Month Details
          </Button>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="tablet:grid-cols-4 grid grid-cols-2 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon
          return (
            <Link key={action.title} href={action.href}>
              <div
                className={`${action.color} rounded-lg p-4 text-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-6 w-6" />
                  <span className="font-medium">{action.title}</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Quick Stats Section */}
      <QuickStats isLoading={isLoading} />

      <div className="laptop:grid-cols-3 grid grid-cols-1 gap-8">
        {/* Main Content */}
        <div className="laptop:col-span-2 space-y-6">
          {/* Empty State Checklist Section */}
          <EmptyStateChecklist isLoading={isLoading} />

          {/* Monthly Summary */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                This Month Summary
              </h2>
              <Link href="/dashboard/active-month">
                <Button variant="secondary" className="text-sm">
                  View Details
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20">
                <div className="mb-2 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm text-emerald-700 dark:text-emerald-300">
                    Net Balance
                  </span>
                </div>
                <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">$1,250</p>
              </div>
              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <div className="mb-2 flex items-center gap-2">
                  <Utensils className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-blue-700 dark:text-blue-300">Meal Rate</span>
                </div>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">$26.21</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h2>
            <div className="space-y-3">
              {recentActivity.map((activity) => {
                const Icon = activity.icon
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
                )
              })}
            </div>
            <Link href="/dashboard/all-months">
              <Button variant="secondary" className="mt-4 w-full text-sm">
                View All Activity
              </Button>
            </Link>
          </div>

          {/* Quick Links */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Quick Links
            </h2>
            <div className="space-y-2">
              <Link href="/dashboard/members" className="block">
                <div className="rounded-lg p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">All Members</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Manage member accounts</p>
                </div>
              </Link>
              <Link href="/dashboard/start-new-month" className="block">
                <div className="rounded-lg p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Start New Month
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Begin new billing cycle
                  </p>
                </div>
              </Link>
              <Link href="/dashboard/settings" className="block">
                <div className="rounded-lg p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Settings</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Configure your mess</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
