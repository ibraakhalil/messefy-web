import {
  Sparkles,
  Calendar,
  Clock,
  Globe,
  ArrowUpDown,
  Receipt,
  TrendingUp,
  Users,
  Utensils,
  Wallet,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import PageWrapper from '@/components/common/page-wrapper'

interface SubdomainPageProps {
  params: Promise<{ subdomain: string }>
}

export default async function SubdomainPage({ params }: SubdomainPageProps) {
  const { subdomain } = await params
  const pageTitle = `Meal Management Dashboard for ${subdomain}`

  const messData = {
    statusNote: 'Please submit all remaining expenses by the 25th of this month.',
    name: subdomain,
    isOpen: true,
    currentPeriod: 'October 2023',
    currency: 'USD',
    timezone: 'UTC+6',
    lastUpdated: new Date().toISOString(),
    mealRate: 2.75,
    totalMeals: {
      breakfast: 120,
      lunch: 150,
      dinner: 160,
      guest: 20,
      total: 450,
    },
    totalExpenses: 1237.5,
    totalDeposits: 1500.0,
    netPosition: 262.5,
    activeMembers: 8,
    members: [
      {
        id: 1,
        name: 'John Doe',
        avatar: '/avatars/john.png',
        isActive: true,
        totalMeals: 62,
        totalDeposits: 200.0,
        balance: 29.5,
      },
      {
        id: 2,
        name: 'Jane Smith',
        avatar: '/avatars/jane.png',
        isActive: true,
        totalMeals: 58,
        totalDeposits: 180.0,
        balance: 20.5,
      },
      {
        id: 3,
        name: 'Mike Johnson',
        avatar: '/avatars/mike.png',
        isActive: false,
        totalMeals: 45,
        totalDeposits: 150.0,
        balance: 26.25,
      },
      {
        id: 4,
        name: 'Sarah Williams',
        avatar: '/avatars/sarah.png',
        isActive: true,
        totalMeals: 60,
        totalDeposits: 170.0,
        balance: -5.0,
      },
      {
        id: 5,
        name: 'David Brown',
        avatar: '/avatars/david.png',
        isActive: true,
        totalMeals: 55,
        totalDeposits: 200.0,
        balance: 48.75,
      },
      {
        id: 6,
        name: 'Emily Davis',
        avatar: '/avatars/emily.png',
        isActive: true,
        totalMeals: 50,
        totalDeposits: 150.0,
        balance: 12.5,
      },
      {
        id: 7,
        name: 'Alex Wilson',
        avatar: '/avatars/alex.png',
        isActive: true,
        totalMeals: 65,
        totalDeposits: 200.0,
        balance: 21.25,
      },
      {
        id: 8,
        name: 'Lisa Taylor',
        avatar: '/avatars/lisa.png',
        isActive: true,
        totalMeals: 55,
        totalDeposits: 150.0,
        balance: -1.25,
      },
    ],
    recentActivity: [
      {
        type: 'meal',
        actor: 'John Doe',
        action: 'added 3 meals',
        timestamp: '2023-10-15T10:30:00Z',
      },
      {
        type: 'expense',
        actor: 'Jane Smith',
        action: 'added expense of $45.75',
        timestamp: '2023-10-14T16:20:00Z',
      },
      {
        type: 'deposit',
        actor: 'Mike Johnson',
        action: 'deposited $50',
        timestamp: '2023-10-14T09:15:00Z',
      },
      {
        type: 'meal',
        actor: 'Sarah Williams',
        action: 'added 2 guest meals',
        timestamp: '2023-10-13T19:45:00Z',
      },
      {
        type: 'expense',
        actor: 'David Brown',
        action: 'added expense of $32.50',
        timestamp: '2023-10-12T14:10:00Z',
      },
    ],
    expenses: [
      { date: '2023-10-15', amount: 45.75, note: 'Vegetables and Fruits' },
      { date: '2023-10-14', amount: 32.5, note: 'Rice and Lentils' },
      { date: '2023-10-13', amount: 28.25, note: 'Chicken and Meat' },
      { date: '2023-10-12', amount: 15.5, note: 'Spices and Oil' },
      { date: '2023-10-11', amount: 22.75, note: 'Bread and Eggs' },
    ],
    deposits: [
      { member: 'John Doe', amount: 50.0, date: '2023-10-15' },
      { member: 'Jane Smith', amount: 40.0, date: '2023-10-14' },
      { member: 'Mike Johnson', amount: 30.0, date: '2023-10-13' },
      { member: 'Sarah Williams', amount: 45.0, date: '2023-10-12' },
      { member: 'David Brown', amount: 35.0, date: '2023-10-11' },
    ],
    mealsOverview: {
      daysWithEntries: 27,
      totalDays: 30,
      averageMealsPerDay: 15,
    },
  }

  return (
    <PageWrapper className="py-8">
      <h1 id="page-title" className="sr-only">
        {pageTitle}
      </h1>

      <header className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="tablet:flex-row tablet:items-center tablet:justify-between tablet:space-y-0 flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  {messData.name} Mess
                </h1>
                <span
                  className={cn(
                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                    messData.isOpen
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800',
                  )}
                >
                  {messData.isOpen ? 'Open' : 'Closed'}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                <span className="inline-flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  Period: {messData.currentPeriod}
                </span>
                <span className="mx-2">•</span>
                <span className="inline-flex items-center">
                  <Globe className="mr-1 h-4 w-4" />
                  {messData.currency} / {messData.timezone}
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-2">
            <div className="flex items-center space-x-2">
              <button className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                <ArrowUpDown className="mr-1 h-4 w-4" />
                Switch Period
              </button>
            </div>
            <p className="text-xs text-gray-500">
              <Clock className="mr-1 inline-block h-3 w-3" />
              {messData.isOpen
                ? `Last updated: ${new Date(messData.lastUpdated).toLocaleString()}`
                : `Snapshot as of: ${new Date(messData.lastUpdated).toLocaleString()}`}
            </p>
          </div>
        </div>
      </header>

      <section className="tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-6 mb-8 grid grid-cols-1 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Meal Rate</h3>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Calendar className="h-4 w-4" />
            </span>
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900">
              ${messData.mealRate.toFixed(2)}
            </span>
            <span className="ml-1 text-sm text-gray-500">/ meal</span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Total Meals</h3>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
              <Utensils className="h-4 w-4" />
            </span>
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900">
              {messData.totalMeals.total}
            </span>
            <span className="ml-2 text-xs text-gray-500">
              B: {messData.totalMeals.breakfast} | L: {messData.totalMeals.lunch} | D:{' '}
              {messData.totalMeals.dinner} | G: {messData.totalMeals.guest}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Total Expenses</h3>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">
              <Receipt className="h-4 w-4" />
            </span>
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900">
              ${messData.totalExpenses.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Total Deposits</h3>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
              <Wallet className="h-4 w-4" />
            </span>
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900">
              ${messData.totalDeposits.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Net Position</h3>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-600">
              <TrendingUp className="h-4 w-4" />
            </span>
          </div>
          <div className="flex items-baseline">
            <span
              className={cn(
                'text-2xl font-bold',
                messData.netPosition >= 0
                  ? 'text-green-600'
                  : 'text-red-600',
              )}
            >
              ${messData.netPosition.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Active Members</h3>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
              <Users className="h-4 w-4" />
            </span>
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900">
              {messData.activeMembers}
            </span>
          </div>
        </div>
      </section>

      <div className="laptop:grid-cols-2 desktop:grid-cols-3 mb-8 grid grid-cols-1 gap-6">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Meals Overview
          </h2>

          <div className="mb-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Breakfasts</span>
              <span className="font-medium text-gray-900">
                {messData.totalMeals.breakfast}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Lunches</span>
              <span className="font-medium text-gray-900">
                {messData.totalMeals.lunch}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Dinners</span>
              <span className="font-medium text-gray-900">
                {messData.totalMeals.dinner}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Guest Meals</span>
              <span className="font-medium text-gray-900">
                {messData.totalMeals.guest}
              </span>
            </div>
          </div>

          <div className="mt-5 space-y-2 border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Average meals/day</span>
              <span className="font-medium text-gray-900">
                {messData.mealsOverview.averageMealsPerDay}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Coverage</span>
              <span className="font-medium text-gray-900">
                {messData.mealsOverview.daysWithEntries}/{messData.mealsOverview.totalDays} days
              </span>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Expenses Overview
          </h2>

          <div className="mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Total Bazar Amount</span>
              <span className="font-medium text-gray-900">
                ${messData.totalExpenses.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-5 space-y-4 border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-700">
              Last 5 Expenses
            </h3>
            <div className="space-y-3">
              {messData.expenses.map((expense, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <span className="block text-xs text-gray-500">
                      {expense.date}
                    </span>
                    <span className="text-sm text-gray-700">{expense.note}</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    ${expense.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Deposits Overview
          </h2>

          <div className="mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Total Deposits Amount
              </span>
              <span className="font-medium text-gray-900">
                ${messData.totalDeposits.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-5 space-y-4 border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-700">
              Last 5 Deposits
            </h3>
            <div className="space-y-3">
              {messData.deposits.map((deposit, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <span className="block text-sm text-gray-700">
                      {deposit.member}
                    </span>
                    <span className="text-xs text-gray-500">{deposit.date}</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    ${deposit.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Activity Snapshot
        </h2>

        <div className="space-y-4">
          {messData.recentActivity.map((activity, index) => {
            let icon
            let iconColorClass

            switch (activity.type) {
              case 'meal':
                icon = <Utensils className="h-4 w-4" />
                iconColorClass = 'bg-emerald-100 text-emerald-600'
                break
              case 'expense':
                icon = <Receipt className="h-4 w-4" />
                iconColorClass = 'bg-red-100 text-red-600'
                break
              case 'deposit':
                icon = <Wallet className="h-4 w-4" />
                iconColorClass = 'bg-purple-100 text-purple-600'
                break
              default:
                icon = <Clock className="h-4 w-4" />
                iconColorClass = 'bg-gray-100 text-gray-600'
            }

            return (
              <div key={index} className="flex items-start space-x-3">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full',
                    iconColorClass,
                  )}
                >
                  {icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      {activity.actor}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{activity.action}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </PageWrapper>
  )
}
