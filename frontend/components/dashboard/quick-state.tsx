'use client'

import { Users, Utensils, Mail } from 'lucide-react'

interface QuickStatsProps {
  isLoading?: boolean
}

const statCards = [
  {
    title: 'Members count',
    value: '8',
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    change: '+2 this month',
    trend: 'up',
  },
  {
    title: 'Meals today',
    value: '24',
    icon: Utensils,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    change: '↑ 8% from yesterday',
    trend: 'up',
  },
  {
    title: 'Pending invites',
    value: '3',
    icon: Mail,
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50',
    iconColor: 'text-orange-600',
    change: 'Sent 2 days ago',
    trend: 'neutral',
  },
]

export default function QuickStats({ isLoading = false }: QuickStatsProps) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Quick Stats</h2>
        <button className="rounded-lg border border-gray-200 px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 tablet:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-lg border border-gray-200 p-6 dark:border-gray-700">
              <div className="mb-4 flex items-center justify-between">
                <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-8 w-16 rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
              <div className="mb-2 h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-3 w-1/3 rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 tablet:grid-cols-3">
          {statCards.map((card, index) => {
            const Icon = card.icon
            return (
              <div
                key={index}
                className={`group relative rounded-lg border border-gray-200 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md dark:border-gray-700 ${card.bgColor} dark:hover:bg-opacity-20`}
              >
                <div className="mb-4 flex items-center justify-between">
                  {/* Icon */}
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.iconColor}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* Value */}
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</div>
                </div>

                {/* Title */}
                <h3 className="mb-1 text-sm font-medium text-gray-500 dark:text-gray-400">
                  {card.title}
                </h3>

                {/* Change indicator */}
                <p
                  className={`text-xs ${card.trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : card.trend === 'down' ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}
                >
                  {card.change}
                </p>

                {/* Hover effect */}
                <div
                  className={`absolute inset-0 -z-10 rounded-lg bg-gradient-to-r opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-20 ${card.color}`}
                ></div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}