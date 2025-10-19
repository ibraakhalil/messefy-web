'use client'

import { Calendar, CheckCircle, MoreHorizontal, Pause, Play, Plus } from 'lucide-react'
import { useState } from 'react'

export default function PeriodsPage() {
  const [isCreatingPeriod, setIsCreatingPeriod] = useState(false)

  // Mock periods data
  const periods = [
    {
      id: '1',
      name: 'December 2024',
      status: 'active',
      startDate: '2024-12-01',
      endDate: '2024-12-31',
      members: 8,
      totalMeals: 145,
      totalExpenses: 9250,
      currentMealRate: 63.79,
    },
    {
      id: '2',
      name: 'November 2024',
      status: 'closed',
      startDate: '2024-11-01',
      endDate: '2024-11-30',
      members: 8,
      totalMeals: 245,
      totalExpenses: 15680,
      finalMealRate: 64.0,
    },
    {
      id: '3',
      name: 'October 2024',
      status: 'closed',
      startDate: '2024-10-01',
      endDate: '2024-10-31',
      members: 7,
      totalMeals: 198,
      totalExpenses: 12760,
      finalMealRate: 64.44,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      case 'closed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play className="h-4 w-4" />
      case 'closed':
        return <CheckCircle className="h-4 w-4" />
      case 'paused':
        return <Pause className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Period Management</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage mess accounting periods and month transitions
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCreatingPeriod(true)}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Start New Period
        </button>
      </div>

      {/* Active Period Alert */}
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 shadow-sm dark:border-green-800 dark:bg-green-900/20">
        <div className="flex items-center gap-3">
          <Play className="h-5 w-5 text-green-600 dark:text-green-400" />
          <div>
            <h3 className="font-medium text-green-900 dark:text-green-200">
              Current Active Period
            </h3>
            <p className="text-sm text-green-700 dark:text-green-300">
              December 2024 is currently active with 8 members and 145 meals recorded
            </p>
          </div>
        </div>
      </div>

      {/* Periods List */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">All Periods</h2>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {periods.map((period) => (
            <div key={period.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {period.name}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(period.status)}`}
                    >
                      {getStatusIcon(period.status)}
                      {period.status}
                    </span>
                  </div>

                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {period.startDate} to {period.endDate}
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-4 text-sm text-gray-600 md:grid-cols-4 dark:text-gray-400">
                    <div>
                      <span className="font-medium">Members:</span> {period.members}
                    </div>
                    <div>
                      <span className="font-medium">Meals:</span> {period.totalMeals}
                    </div>
                    <div>
                      <span className="font-medium">Expenses:</span> ${period.totalExpenses}
                    </div>
                    <div>
                      <span className="font-medium">Meal Rate:</span> $
                      {period.status === 'active' ? period.currentMealRate : period.finalMealRate}
                      /meal
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {period.status === 'active' && (
                    <button className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700">
                      Close Period
                    </button>
                  )}
                  <button className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                    View Details
                  </button>
                  <button className="rounded-lg border border-gray-300 p-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Period Creation Modal Placeholder */}
      {isCreatingPeriod && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
              Start New Period
            </h3>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              This feature will be implemented to handle period transitions and settlements.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setIsCreatingPeriod(false)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsCreatingPeriod(false)}
                className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
              >
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
