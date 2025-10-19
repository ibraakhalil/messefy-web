'use client'

import Button from '@/components/ui/button'
import {
  AlertCircle,
  Calculator,
  Download,
  Plus,
  Send,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function MemberBalancesPage() {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [showSettlement, setShowSettlement] = useState(false)

  // Mock data
  const memberBalances = [
    {
      id: '1',
      name: 'John Doe',
      meals: 18,
      mealCost: 471.78,
      deposits: 600,
      expenses: 45.5,
      adjustments: 0,
      balance: 82.72,
      status: 'positive',
      lastDeposit: '2024-12-10',
      email: 'john@example.com',
    },
    {
      id: '2',
      name: 'Jane Smith',
      meals: 15,
      mealCost: 393.15,
      deposits: 500,
      expenses: 200.0,
      adjustments: 0,
      balance: -93.15,
      status: 'negative',
      lastDeposit: '2024-12-05',
      email: 'jane@example.com',
    },
    {
      id: '3',
      name: 'Bob Johnson',
      meals: 20,
      mealCost: 524.2,
      deposits: 600,
      expenses: 0,
      adjustments: 0,
      balance: 75.8,
      status: 'positive',
      lastDeposit: '2024-12-12',
      email: 'bob@example.com',
    },
    {
      id: '4',
      name: 'Alice Brown',
      meals: 12,
      mealCost: 314.52,
      deposits: 400,
      expenses: 200.0,
      adjustments: 0,
      balance: -114.52,
      status: 'negative',
      lastDeposit: '2024-12-01',
      email: 'alice@example.com',
    },
    {
      id: '5',
      name: 'Charlie Wilson',
      meals: 16,
      mealCost: 419.36,
      deposits: 600,
      expenses: 24.0,
      adjustments: 0,
      balance: 156.64,
      status: 'positive',
      lastDeposit: '2024-12-08',
      email: 'charlie@example.com',
    },
    {
      id: '6',
      name: 'Diana Prince',
      meals: 22,
      mealCost: 576.62,
      deposits: 650,
      expenses: 0,
      adjustments: 0,
      balance: 73.38,
      status: 'positive',
      lastDeposit: '2024-12-14',
      email: 'diana@example.com',
    },
  ]

  const monthData = {
    currentMonth: 'December 2024',
    totalMembers: memberBalances.length,
    totalPositive: memberBalances.filter((m) => m.status === 'positive').length,
    totalNegative: memberBalances.filter((m) => m.status === 'negative').length,
    totalBalance: memberBalances.reduce((sum, m) => sum + m.balance, 0),
    totalOutstanding: Math.abs(
      memberBalances.filter((m) => m.status === 'negative').reduce((sum, m) => sum + m.balance, 0),
    ),
    mealRate: 26.21,
  }

  const handleMemberSelect = (memberId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId],
    )
  }

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return 'text-green-600 dark:text-green-400'
    if (balance < 0) return 'text-red-600 dark:text-red-400'
    return 'text-gray-600 dark:text-gray-400'
  }

  const getBalanceIcon = (balance: number) => {
    if (balance > 0) return TrendingUp
    if (balance < 0) return TrendingDown
    return Calculator
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Member Balances</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {monthData.currentMonth} • Track and settle member balances
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => setShowSettlement(!showSettlement)}
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            Settlement Mode
          </Button>
          <Button variant="secondary" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="tablet:grid-cols-2 laptop:grid-cols-4 grid grid-cols-1 gap-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/20">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Members</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {monthData.totalMembers}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/20">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Positive Balance</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {monthData.totalPositive}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/20">
              <TrendingDown className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Outstanding</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${monthData.totalOutstanding.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/20">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Net Balance</p>
              <p className={`text-2xl font-bold ${getBalanceColor(monthData.totalBalance)}`}>
                ${monthData.totalBalance.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Outstanding Balances Alert */}
      {monthData.totalNegative > 0 && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Action Required
              </h3>
              <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
                {monthData.totalNegative} members have negative balances totaling $
                {monthData.totalOutstanding.toFixed(2)}. Consider sending payment reminders or
                generating statements.
              </p>
              <div className="mt-2 flex gap-2">
                <Button variant="secondary" className="text-xs">
                  Send Reminders
                </Button>
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

      {/* Member Balances Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Member Balance Details
            </h2>
            {showSettlement && selectedMembers.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedMembers.length} selected
                </span>
                <Button className="text-sm">Process Settlement</Button>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                {showSettlement && (
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMembers(memberBalances.map((m) => m.id))
                        } else {
                          setSelectedMembers([])
                        }
                      }}
                    />
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Meals
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Meal Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Deposits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              {memberBalances.map((member) => {
                const BalanceIcon = getBalanceIcon(member.balance)
                return (
                  <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    {showSettlement && (
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={selectedMembers.includes(member.id)}
                          onChange={() => handleMemberSelect(member.id)}
                        />
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                            member.status === 'positive'
                              ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                              : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                          }`}
                        >
                          <BalanceIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Last deposit: {member.lastDeposit}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {member.meals}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      ${member.mealCost.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      ${member.deposits}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${getBalanceColor(member.balance)}`}>
                          ${member.balance.toFixed(2)}
                        </span>
                        {member.status === 'negative' && (
                          <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900/20 dark:text-red-400">
                            Owes
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {member.status === 'negative' ? (
                          <>
                            <Button variant="secondary" className="text-xs">
                              Send Reminder
                            </Button>
                            <Link href={`/dashboard/data-entry?type=deposit&member=${member.id}`}>
                              <Button className="text-xs">
                                <Plus className="mr-1 h-3 w-3" />
                                Add Deposit
                              </Button>
                            </Link>
                          </>
                        ) : (
                          <Button variant="secondary" className="text-xs">
                            View Details
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Settlement Summary */}
      {showSettlement && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
          <h3 className="mb-4 text-lg font-semibold text-blue-900 dark:text-blue-100">
            Settlement Summary
          </h3>
          <div className="tablet:grid-cols-3 grid grid-cols-1 gap-4">
            <div className="rounded-lg bg-white p-4 dark:bg-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">Members Selected</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedMembers.length}
              </p>
            </div>
            <div className="rounded-lg bg-white p-4 dark:bg-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Outstanding</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                $
                {memberBalances
                  .filter((m) => selectedMembers.includes(m.id) && m.status === 'negative')
                  .reduce((sum, m) => sum + Math.abs(m.balance), 0)
                  .toFixed(2)}
              </p>
            </div>
            <div className="rounded-lg bg-white p-4 dark:bg-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">Settlement Actions</p>
              <div className="mt-2 flex gap-2">
                <Button className="text-xs">Generate Invoices</Button>
                <Button variant="secondary" className="text-xs">
                  Send Statements
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
