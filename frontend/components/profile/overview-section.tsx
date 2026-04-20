'use client'

import Button from '@/components/ui/button'
import { Bell, CreditCard, TrendingUp, UserPlus, Utensils } from 'lucide-react'
import { FiClock, FiEdit2 } from 'react-icons/fi'

type OverviewSectionProps = {
  onNavigate: (tab: string) => void
}

const OverviewSection = ({ onNavigate }: OverviewSectionProps) => {
  // Mock data - replace with actual data from your backend
  const userStats = [
    {
      label: 'This Month Meals',
      value: '42',
      change: '+8',
      icon: <Utensils className="h-5 w-5" />,
      color: 'text-blue-600',
    },
    {
      label: 'Outstanding Balance',
      value: '৳125',
      change: '-৳20',
      icon: <CreditCard className="h-5 w-5" />,
      color: 'text-orange-600',
    },
    {
      label: 'Avg. Monthly Cost',
      value: '৳280',
      change: '+5%',
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'text-purple-600',
    },
  ]

  const recentActivities = [
    {
      id: 1,
      action: 'Added lunch and dinner for today',
      time: '2 hours ago',
      icon: <Utensils className="h-4 w-4" />,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      id: 2,
      action: 'Deposited ৳50 to Office Mess',
      time: '1 day ago',
      icon: <CreditCard className="h-4 w-4" />,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      id: 3,
      action: 'Joined Community Kitchen mess',
      time: '3 days ago',
      icon: <UserPlus className="h-4 w-4" />,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      id: 4,
      action: 'Updated profile information',
      time: '1 week ago',
      icon: <FiEdit2 className="h-4 w-4" />,
      color: 'text-gray-600',
      bg: 'bg-gray-50',
    },
  ]

  const quickActions = [
    {
      id: 1,
      label: 'Quick Meal Entry',
      icon: <Utensils className="h-4 w-4" />,
      tab: 'mess',
      action: 'add-meal',
    },
    {
      id: 2,
      label: 'Join New Mess',
      icon: <UserPlus className="h-4 w-4" />,
      tab: 'mess',
      action: 'join-mess',
    },
    {
      id: 3,
      label: 'View Notifications',
      icon: <Bell className="h-4 w-4" />,
      tab: 'notifications',
    },
    { id: 4, label: 'Edit Profile', icon: <FiEdit2 className="h-4 w-4" />, tab: 'profile' },
  ]

  // Mock mess invitations and requests
  const pendingItems = [
    {
      id: 1,
      type: 'invitation',
      messName: 'Tech Office Mess',
      from: 'John Doe',
      time: '2 hours ago',
    },
    { id: 2, type: 'request', messName: 'Community Kitchen', status: 'pending', time: '1 day ago' },
  ]

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="tablet:grid-cols-2 laptop:grid-cols-4 grid gap-6">
        {userStats.map((stat, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-500">{stat.label}</div>
              <div className={`${stat.color}`}>{stat.icon}</div>
            </div>
            <div className="mt-3 flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
              <span
                className={`ml-2 text-sm font-medium ${
                  stat.change.startsWith('+')
                    ? 'text-green-600'
                    : stat.change.startsWith('-')
                      ? 'text-red-600'
                      : 'text-gray-600'
                }`}
              >
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="laptop:grid-cols-12 grid gap-6">
        {/* Quick Actions */}
        <div className="laptop:col-span-4">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-medium text-gray-900">Quick Actions</h3>
            <div className="space-y-2">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => onNavigate(action.tab)}
                  className="flex w-full items-center rounded-lg p-3 text-left text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    {action.icon}
                  </span>
                  <span className="ml-3 text-sm font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pending Items */}
        <div className="laptop:col-span-4">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Pending Items</h3>
              <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                {pendingItems.length}
              </span>
            </div>
            <div className="space-y-3">
              {pendingItems.length > 0 ? (
                pendingItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between rounded-lg bg-amber-50 p-3"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {item.type === 'invitation' ? 'Mess Invitation' : 'Join Request'}
                      </p>
                      <p className="text-xs text-gray-600">
                        {item.type === 'invitation'
                          ? `From ${item.from} to join ${item.messName}`
                          : `Requested to join ${item.messName}`}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">{item.time}</p>
                    </div>
                    <Button
                      className="ml-2 h-6 bg-gradient-to-r from-emerald-600 to-teal-600 px-2 text-xs text-white hover:from-emerald-700 hover:to-teal-700"
                      onClick={() => onNavigate('notifications')}
                    >
                      View
                    </Button>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center">
                  <p className="text-sm text-gray-500">No pending items</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="laptop:col-span-4">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${activity.bg} ${activity.color}`}
                  >
                    {activity.icon}
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="mt-1 flex items-center text-sm text-gray-500">
                      <FiClock className="mr-1.5 h-3.5 w-3.5" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Today's Meal Planning */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Today's Meal Planning</h3>
          <span className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>

        <div className="tablet:grid-cols-3 grid gap-4">
          {['Breakfast', 'Lunch', 'Dinner'].map((meal, index) => {
            const isPlanned = index < 2 // Mock: breakfast and lunch are planned
            return (
              <div
                key={meal}
                className={`rounded-lg border p-4 transition-all ${
                  isPlanned ? 'border-emerald-200 bg-emerald-50' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">{meal}</h4>
                  <div
                    className={`h-3 w-3 rounded-full ${
                      isPlanned ? 'bg-emerald-500' : 'bg-gray-300'
                    }`}
                  />
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  {isPlanned ? 'Planned' : 'Not planned yet'}
                </p>
                {!isPlanned && (
                  <Button
                    className="mt-2 h-7 w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-xs text-white hover:from-emerald-700 hover:to-teal-700"
                    onClick={() => onNavigate('mess')}
                  >
                    Add {meal}
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default OverviewSection
