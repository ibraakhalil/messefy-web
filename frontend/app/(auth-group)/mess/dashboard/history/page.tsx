'use client'

import { CalendarDays, Download, Eye, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'

export default function HistoryPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('all')

  // Mock historical data
  const monthHistory = [
    {
      id: '1',
      period: 'November 2024',
      status: 'closed',
      totalMembers: 8,
      totalMeals: 245,
      totalExpenses: 15680,
      mealRate: 64.0,
      settlements: 'completed',
    },
    {
      id: '2',
      period: 'October 2024',
      status: 'closed',
      totalMembers: 7,
      totalMeals: 198,
      totalExpenses: 12760,
      mealRate: 64.44,
      settlements: 'completed',
    },
    {
      id: '3',
      period: 'September 2024',
      status: 'closed',
      totalMembers: 6,
      totalMeals: 156,
      totalExpenses: 9850,
      mealRate: 63.14,
      settlements: 'pending',
    },
    {
      id: '4',
      period: 'August 2024',
      status: 'closed',
      totalMembers: 6,
      totalMeals: 142,
      totalExpenses: 8960,
      mealRate: 63.1,
      settlements: 'completed',
    },
  ]

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
            <CalendarDays className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">History</h1>
            <p className="text-gray-600 dark:text-gray-400">
              View past month records and settlements
            </p>
          </div>
        </div>

        <button className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
          <Download className="h-4 w-4" />
          Export All
        </button>
      </div>

      {/* Filter */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filter by Period:
          </label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Periods</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="closed">Closed Only</option>
            <option value="pending">Pending Settlements</option>
          </select>
        </div>
      </div>

      {/* History List */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Month History</h2>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {monthHistory.map((month) => (
            <div key={month.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {month.period}
                    </h3>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        month.status === 'closed'
                          ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                      }`}
                    >
                      {month.status}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        month.settlements === 'completed'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                      }`}
                    >
                      {month.settlements} settlements
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-4 text-sm text-gray-600 md:grid-cols-4 dark:text-gray-400">
                    <div>
                      <span className="font-medium">Members:</span> {month.totalMembers}
                    </div>
                    <div>
                      <span className="font-medium">Meals:</span> {month.totalMeals}
                    </div>
                    <div>
                      <span className="font-medium">Expenses:</span> ${month.totalExpenses}
                    </div>
                    <div>
                      <span className="font-medium">Rate:</span> ${month.mealRate}/meal
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                    <Eye className="h-4 w-4" />
                    View Details
                  </button>
                  <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                    <Download className="h-4 w-4" />
                    Export
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
    </div>
  )
}
