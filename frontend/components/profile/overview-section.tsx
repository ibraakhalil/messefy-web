'use client'

import { FiEdit2, FiShield, FiBriefcase, FiSettings, FiClock } from 'react-icons/fi'

type OverviewSectionProps = {
  onNavigate: (tab: string) => void
}

const OverviewSection = ({ onNavigate }: OverviewSectionProps) => {
  // Mock data - replace with actual data from your backend
  const userStats = [
    { label: 'Projects', value: '12', change: '+2' },
    { label: 'Tasks Completed', value: '89', change: '+12' },
    { label: 'Team Members', value: '24', change: '+3' },
    { label: 'Productivity', value: '87%', change: '+5%' },
  ]

  const recentActivities = [
    { id: 1, action: 'Updated profile information', time: '2 hours ago', icon: <FiEdit2 /> },
    { id: 2, action: 'Completed project setup', time: '1 day ago', icon: <FiBriefcase /> },
    { id: 3, action: 'Changed password', time: '3 days ago', icon: <FiShield /> },
    { id: 4, action: 'Joined new workspace', time: '1 week ago', icon: <FiBriefcase /> },
  ]

  const quickActions = [
    { id: 1, label: 'Edit Profile', icon: <FiEdit2 />, tab: 'profile' },
    { id: 2, label: 'Change Password', icon: <FiShield />, tab: 'security' },
    { id: 3, label: 'Manage Workspaces', icon: <FiBriefcase />, tab: 'workspaces' },
    { id: 4, label: 'Account Settings', icon: <FiSettings />, tab: 'profile' },
  ]

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-6 tablet:grid-cols-2 laptop:grid-cols-4">
        {userStats.map((stat, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div className="text-sm font-medium text-gray-500">{stat.label}</div>
            <div className="mt-1 flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
              <span className="ml-2 text-sm font-medium text-green-600">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 laptop:grid-cols-3">
        {/* Quick Actions */}
        <div className="laptop:col-span-1">
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
                  <span className="ml-3">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="laptop:col-span-2">
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
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    {activity.icon}
                  </div>
                  <div className="ml-4">
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
    </div>
  )
}

export default OverviewSection
