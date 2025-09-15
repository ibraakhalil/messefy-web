'use client'

import Button from '@/components/ui/button'
import FormInput from '@/components/ui/form-input'
import { CalendarDays, DollarSign, Download, Eye, Search, TrendingUp, Users } from 'lucide-react'
import { useState } from 'react'

export default function AllMonthsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  // Mock data for all months
  const allMonths = [
    {
      id: '1',
      name: 'December 2024',
      period: 'Dec 1 - Dec 31, 2024',
      status: 'active',
      totalMembers: 8,
      totalMeals: 124,
      totalDeposits: 4500,
      totalExpenses: 3250,
      balance: 1250,
      mealRate: 26.21,
    },
    {
      id: '2',
      name: 'November 2024',
      period: 'Nov 1 - Nov 30, 2024',
      status: 'completed',
      totalMembers: 7,
      totalMeals: 118,
      totalDeposits: 4200,
      totalExpenses: 3950,
      balance: 250,
      mealRate: 33.47,
    },
    {
      id: '3',
      name: 'October 2024',
      period: 'Oct 1 - Oct 31, 2024',
      status: 'completed',
      totalMembers: 8,
      totalMeals: 135,
      totalDeposits: 4800,
      totalExpenses: 4600,
      balance: 200,
      mealRate: 34.07,
    },
    {
      id: '4',
      name: 'September 2024',
      period: 'Sep 1 - Sep 30, 2024',
      status: 'completed',
      totalMembers: 6,
      totalMeals: 95,
      totalDeposits: 3600,
      totalExpenses: 3450,
      balance: 150,
      mealRate: 36.32,
    },
    {
      id: '5',
      name: 'August 2024',
      period: 'Aug 1 - Aug 31, 2024',
      status: 'completed',
      totalMembers: 7,
      totalMeals: 110,
      totalDeposits: 4100,
      totalExpenses: 3850,
      balance: 250,
      mealRate: 35.0,
    },
    {
      id: '6',
      name: 'July 2024',
      period: 'Jul 1 - Jul 31, 2024',
      status: 'completed',
      totalMembers: 8,
      totalMeals: 128,
      totalDeposits: 4600,
      totalExpenses: 4200,
      balance: 400,
      mealRate: 32.81,
    },
  ]

  const filteredMonths = allMonths
    .filter(
      (month) =>
        month.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        month.period.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return (
            new Date(b.period.split(' - ')[0]).getTime() -
            new Date(a.period.split(' - ')[0]).getTime()
          )
        case 'oldest':
          return (
            new Date(a.period.split(' - ')[0]).getTime() -
            new Date(b.period.split(' - ')[0]).getTime()
          )
        case 'highest-balance':
          return b.balance - a.balance
        case 'lowest-balance':
          return a.balance - b.balance
        default:
          return 0
      }
    })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const exportMonth = (monthId: string) => {
    console.log('Exporting month:', monthId)
    // Implementation for exporting month data
  }

  const viewMonthDetails = (monthId: string) => {
    console.log('Viewing month details:', monthId)
    // Implementation for viewing month details
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
          <CalendarDays className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Months</h1>
          <p className="text-gray-600 dark:text-gray-400">View and manage all monthly records</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="tablet:flex-row tablet:items-center tablet:justify-between flex flex-col gap-4">
        <div className="relative max-w-md">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <FormInput
            type="text"
            placeholder="Search months..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest-balance">Highest Balance</option>
            <option value="lowest-balance">Lowest Balance</option>
          </select>

          <Button variant="secondary" className="text-sm">
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="tablet:grid-cols-2 laptop:grid-cols-4 grid grid-cols-1 gap-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/20">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Months</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{allMonths.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Balance</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${allMonths.reduce((sum, month) => sum + month.balance, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/20">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Members</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(
                  allMonths.reduce((sum, month) => sum + month.totalMembers, 0) / allMonths.length,
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/20">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Meal Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                $
                {(
                  allMonths.reduce((sum, month) => sum + month.mealRate, 0) / allMonths.length
                ).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Months List */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Monthly Records ({filteredMonths.length})
          </h2>
        </div>

        {filteredMonths.length === 0 ? (
          <div className="p-12 text-center">
            <CalendarDays className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              No months found matching your search.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredMonths.map((month) => (
              <div key={month.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {month.name}
                      </h3>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusBadge(month.status)}`}
                      >
                        {month.status}
                      </span>
                    </div>
                    <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">{month.period}</p>

                    <div className="tablet:grid-cols-4 laptop:grid-cols-6 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Members</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {month.totalMembers}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Meals</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {month.totalMeals}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Deposits</p>
                        <p className="font-semibold text-green-600 dark:text-green-400">
                          ${month.totalDeposits}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Expenses</p>
                        <p className="font-semibold text-red-600 dark:text-red-400">
                          ${month.totalExpenses}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Balance</p>
                        <p
                          className={`font-semibold ${
                            month.balance >= 0
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          ${month.balance}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Meal Rate</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          ${month.mealRate}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="ml-4 flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => viewMonthDetails(month.id)}
                      className="px-3 py-1 text-sm"
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      View
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => exportMonth(month.id)}
                      className="px-3 py-1 text-sm"
                    >
                      <Download className="mr-1 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
