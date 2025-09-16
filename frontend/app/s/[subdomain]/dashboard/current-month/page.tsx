'use client'

import Button from '@/components/ui/button'
import {
  AlertCircle,
  Calendar,
  DollarSign,
  Download,
  Edit,
  Eye,
  Plus,
  Receipt,
  TrendingUp,
  Users,
  Utensils,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function CurrentMonthPage() {
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data
  const monthData = {
    currentMonth: 'December 2024',
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    daysRemaining: 16,
    totalMembers: 8,
    totalDeposits: 4500,
    totalExpenses: 3250,
    totalMeals: 124,
    balance: 1250,
    mealRate: 26.21,
    status: 'active',
  }

  const memberSummary = [
    { name: 'John Doe', meals: 18, deposit: 600, balance: 128.22, status: 'positive' },
    { name: 'Jane Smith', meals: 15, deposit: 500, balance: -93.15, status: 'negative' },
    { name: 'Bob Johnson', meals: 20, deposit: 600, balance: 75.8, status: 'positive' },
    { name: 'Alice Brown', meals: 12, deposit: 400, balance: -114.52, status: 'negative' },
    { name: 'Charlie Wilson', meals: 16, deposit: 550, balance: 156.64, status: 'positive' },
    { name: 'Diana Prince', meals: 22, deposit: 650, balance: 73.38, status: 'positive' },
    { name: 'Eva Martinez', meals: 11, deposit: 400, balance: -88.31, status: 'negative' },
    { name: 'Frank Davis', meals: 10, deposit: 800, balance: 537.94, status: 'positive' },
  ]

  const recentTransactions = [
    {
      id: 1,
      date: '2024-12-15',
      type: 'expense',
      description: 'Weekly groceries',
      amount: 245.5,
      category: 'Groceries',
      paidBy: 'John Doe',
    },
    {
      id: 2,
      date: '2024-12-14',
      type: 'deposit',
      description: 'Monthly deposit',
      amount: 200.0,
      category: 'Deposit',
      member: 'John Doe',
    },
    {
      id: 3,
      date: '2024-12-13',
      type: 'expense',
      description: 'Vegetables and fruits',
      amount: 85.3,
      category: 'Vegetables',
      paidBy: 'Jane Smith',
    },
    {
      id: 4,
      date: '2024-12-13',
      type: 'meal',
      description: 'Lunch entries for 6 members',
      amount: null,
      category: 'Meal',
      count: 6,
    },
    {
      id: 5,
      date: '2024-12-12',
      type: 'deposit',
      description: 'Monthly deposit',
      amount: 180.0,
      category: 'Deposit',
      member: 'Jane Smith',
    },
  ]

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'members', label: 'Member Summary', icon: Users },
    { id: 'transactions', label: 'Recent Activity', icon: Receipt },
  ]

  const negativeBalanceMembers = memberSummary.filter((m) => m.status === 'negative')

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Current Month</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {monthData.currentMonth} • {monthData.daysRemaining} days remaining
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/data-entry">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Data
            </Button>
          </Link>
          <Button variant="secondary" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Alert for negative balances */}
      {negativeBalanceMembers.length > 0 && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Outstanding Balances
              </h3>
              <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                {negativeBalanceMembers.length} members have negative balances totaling $
                {Math.abs(negativeBalanceMembers.reduce((sum, m) => sum + m.balance, 0)).toFixed(2)}
              </p>
              <div className="mt-2 flex gap-2">
                <Link href="/dashboard/member-balances">
                  <Button variant="secondary" className="text-xs">
                    View Balances
                  </Button>
                </Link>
                <Link href="/dashboard/reports">
                  <Button variant="secondary" className="text-xs">
                    Generate Statements
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="tablet:grid-cols-2 laptop:grid-cols-4 grid grid-cols-1 gap-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Net Balance</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${monthData.balance}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/20">
              <Utensils className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Meal Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${monthData.mealRate}
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
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Meals</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {monthData.totalMeals}
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
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${monthData.totalExpenses}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 border-b-2 px-1 py-2 text-sm font-medium ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Month Overview
              </h2>
              <Link href="/dashboard/period-management">
                <Button variant="secondary" className="text-sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Manage Period
                </Button>
              </Link>
            </div>

            <div className="tablet:grid-cols-2 grid grid-cols-1 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Financial Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
                    <span className="text-gray-600 dark:text-gray-400">Total Deposits</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      +${monthData.totalDeposits}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
                    <span className="text-gray-600 dark:text-gray-400">Total Expenses</span>
                    <span className="font-semibold text-red-600 dark:text-red-400">
                      -${monthData.totalExpenses}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-purple-200 bg-purple-50 p-3 dark:border-purple-800 dark:bg-purple-900/20">
                    <span className="font-medium text-gray-900 dark:text-white">Net Balance</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400">
                      ${monthData.balance}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Meal Statistics
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
                    <span className="text-gray-600 dark:text-gray-400">Active Members</span>
                    <span className="font-semibold">{monthData.totalMembers}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
                    <span className="text-gray-600 dark:text-gray-400">Total Meals</span>
                    <span className="font-semibold">{monthData.totalMeals}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
                    <span className="text-gray-600 dark:text-gray-400">Avg Meals/Member</span>
                    <span className="font-semibold">
                      {(monthData.totalMeals / monthData.totalMembers).toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-orange-200 bg-orange-50 p-3 dark:border-orange-800 dark:bg-orange-900/20">
                    <span className="font-medium text-gray-900 dark:text-white">
                      Current Meal Rate
                    </span>
                    <span className="font-bold text-orange-600 dark:text-orange-400">
                      ${monthData.mealRate}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Member Summary
              </h2>
              <div className="flex gap-2">
                <Link href="/dashboard/member-balances">
                  <Button variant="secondary" className="text-sm">
                    Detailed View
                  </Button>
                </Link>
                <Button variant="secondary" className="text-sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                      Member
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                      Meals
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                      Deposit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                  {memberSummary.map((member) => (
                    <tr key={member.name} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-white">
                        {member.name}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600 dark:text-gray-300">
                        {member.meals}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600 dark:text-gray-300">
                        ${member.deposit}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        <span
                          className={`font-medium ${
                            member.status === 'positive'
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          ${member.balance.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Activity
              </h2>
              <div className="flex gap-2">
                <Button variant="secondary" className="text-sm">
                  Filter
                </Button>
                <Button variant="secondary" className="text-sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                        transaction.type === 'deposit'
                          ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                          : transaction.type === 'expense'
                            ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                            : 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'
                      }`}
                    >
                      {transaction.type === 'deposit' ? (
                        <DollarSign className="h-4 w-4" />
                      ) : transaction.type === 'expense' ? (
                        <Receipt className="h-4 w-4" />
                      ) : (
                        <Utensils className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {transaction.date} • {transaction.category}
                        {transaction.paidBy && ` • Paid by ${transaction.paidBy}`}
                        {transaction.member && ` • ${transaction.member}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {transaction.amount !== null ? (
                      <span
                        className={`font-semibold ${
                          transaction.type === 'deposit'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount}
                      </span>
                    ) : (
                      <span className="font-semibold text-orange-600 dark:text-orange-400">
                        {transaction.count} meals
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
