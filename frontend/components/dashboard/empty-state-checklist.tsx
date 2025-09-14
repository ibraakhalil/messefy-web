'use client'

import { PlusCircle, Wallet, Utensils, PieChart } from 'lucide-react'

interface EmptyStateChecklistProps {
  isLoading?: boolean
}

const actionCards = [
  {
    title: 'Add first bazar expense',
    description: 'Record your first grocery or food expense',
    icon: PlusCircle,
    href: '/dashboard/expenses/new',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50 hover:bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    title: 'Add deposits',
    description: 'Record member contributions to the mess fund',
    icon: Wallet,
    href: '/dashboard/deposits/new',
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-50 hover:bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
  {
    title: 'Enter meals',
    description: 'Record daily meals for all members',
    icon: Utensils,
    href: '/dashboard/meals',
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50 hover:bg-orange-100',
    iconColor: 'text-orange-600',
  },
  {
    title: 'View summary',
    description: 'See meal rates and member balances',
    icon: PieChart,
    href: '/dashboard/summary',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50 hover:bg-purple-100',
    iconColor: 'text-purple-600',
  },
]

export default function EmptyStateChecklist({ isLoading = false }: EmptyStateChecklistProps) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Getting Started</h2>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 laptop:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-lg border border-gray-200 p-6 dark:border-gray-700">
              <div className="mb-4 h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
              <div className="mb-2 h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 laptop:grid-cols-4">
          {actionCards.map((card, index) => {
            const Icon = card.icon
            return (
              <a
                key={index}
                href={card.href}
                className={`group relative flex flex-col rounded-lg border border-gray-200 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-gray-700 ${card.bgColor} dark:hover:bg-opacity-20`}
              >
                {/* Icon */}
                <div
                  className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${card.iconColor}`}
                >
                  <Icon className="h-6 w-6" />
                </div>

                {/* Content */}
                <h3 className="mb-1 text-lg font-medium text-gray-900 dark:text-white">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{card.description}</p>

                {/* Hover effect */}
                <div
                  className={`absolute inset-0 -z-10 rounded-lg bg-gradient-to-r opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-20 ${card.color}`}
                ></div>
              </a>
            )
          })}
        </div>
      )}
    </section>
  )
}