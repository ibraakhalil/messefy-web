'use client'

import { ArrowRight, CalendarDays } from 'lucide-react'
import Link from 'next/link'

export default function HistoryRedirect() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
          <CalendarDays className="h-10 w-10" />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Page Moved</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            All months history has been moved to the History page
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            View past month records and settlements
          </p>
        </div>

        <Link
          href="/dashboard/history"
          className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 font-medium text-white transition-colors hover:bg-purple-700"
        >
          Go to History
          <ArrowRight className="h-4 w-4" />
        </Link>

        <div className="pt-4">
          <Link
            href="/dashboard"
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
