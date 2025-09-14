'use client'

import { useState } from 'react'
import EmptyStateChecklist from '@/components/dashboard/empty-state-checklist'
import QuickStats from '@/components/dashboard/quick-state'

export default function DashboardPage() {
  const [isLoading] = useState(false)

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>

      {/* Empty State Checklist Section */}
      <EmptyStateChecklist isLoading={isLoading} />

      {/* Quick Stats Section */}
      <QuickStats isLoading={isLoading} />
    </div>
  )
}
