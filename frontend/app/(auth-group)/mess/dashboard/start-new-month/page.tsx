'use client'

import Button from '@/components/ui/button'
import DatePicker from '@/components/ui/date-picker'
import FormInput from '@/components/ui/form-input'
import { formatCurrency } from '@/utils/format-currency'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Calendar, CalendarPlus, Loader2, TrendingUp, Users } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const newMonthSchema = z.object({
  monthName: z.string().min(1, 'Month name is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  carryOverBalance: z.boolean().default(true),
  resetMealCounts: z.boolean().default(true),
  notifyMembers: z.boolean().default(true),
})

type NewMonthFormValues = z.infer<typeof newMonthSchema>

export default function StartNewMonthPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  // Mock current month data
  const currentMonth = {
    name: 'December 2024',
    endDate: '2024-12-31',
    balance: 1250.75,
    totalMembers: 8,
    avgMealRate: 26.21,
  }

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<NewMonthFormValues>({
    resolver: zodResolver(newMonthSchema),
    defaultValues: {
      monthName: 'January 2025',
      startDate: '2025-01-01',
      endDate: '2025-01-31',
      carryOverBalance: true,
      resetMealCounts: true,
      notifyMembers: true,
    },
  })

  const carryOverBalance = watch('carryOverBalance')

  const onSubmit = async (data: NewMonthFormValues) => {
    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000))
      console.log('New month data:', data)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 5000)
    } catch (error) {
      console.error('Error starting new month:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400">
          <CalendarPlus className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Start New Month</h1>
          <p className="text-gray-600 dark:text-gray-400">Initialize a new monthly billing cycle</p>
        </div>
      </div>

      {/* Current Month Summary */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Current Month Summary
        </h2>

        <div className="tablet:grid-cols-3 grid grid-cols-1 gap-4">
          <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/20">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Current Period</p>
              <p className="font-semibold text-gray-900 dark:text-white">{currentMonth.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Current Balance</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(currentMonth.balance)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/20">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Members</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {currentMonth.totalMembers}
              </p>
            </div>
          </div>
        </div>
      </div>

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
          <p className="text-sm text-green-800 dark:text-green-200">
            New month started successfully! All members have been notified.
          </p>
        </div>
      )}

      {/* New Month Configuration */}
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
          New Month Configuration
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="tablet:grid-cols-3 grid grid-cols-1 gap-6">
            <FormInput
              id="monthName"
              label="Month Name *"
              type="text"
              placeholder="e.g., January 2025"
              error={errors.monthName?.message}
              {...register('monthName')}
            />

            <DatePicker
              id="startDate"
              label="Start Date *"
              error={errors.startDate?.message}
              {...register('startDate')}
            />

            <DatePicker
              id="endDate"
              label="End Date *"
              error={errors.endDate?.message}
              {...register('endDate')}
            />
          </div>

          {/* Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Month Settings</h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <input
                  id="carryOverBalance"
                  type="checkbox"
                  {...register('carryOverBalance')}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <div className="flex-1">
                  <label
                    htmlFor="carryOverBalance"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Carry over balance from previous month
                  </label>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Transfer the remaining balance ({formatCurrency(currentMonth.balance)}) to the new month
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <input
                  id="resetMealCounts"
                  type="checkbox"
                  {...register('resetMealCounts')}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <div className="flex-1">
                  <label
                    htmlFor="resetMealCounts"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Reset all member meal counts
                  </label>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Start with zero meals for all members in the new month
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  id="notifyMembers"
                  type="checkbox"
                  {...register('notifyMembers')}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <div className="flex-1">
                  <label
                    htmlFor="notifyMembers"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Notify all members about the new month
                  </label>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Send email notifications to all members about the new billing cycle
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
            <h3 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
              Preview Changes
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">New month will start with:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {carryOverBalance
                    ? `${formatCurrency(currentMonth.balance)} balance`
                    : `${formatCurrency(0)} balance`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">All member meal counts:</span>
                <span className="font-medium text-gray-900 dark:text-white">Reset to 0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Previous month data:</span>
                <span className="font-medium text-gray-900 dark:text-white">Archived</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[140px] bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Starting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CalendarPlus className="h-4 w-4" />
                  Start New Month
                </span>
              )}
            </Button>
            <Button type="button" variant="secondary" onClick={() => reset()}>
              Reset Form
            </Button>
          </div>
        </form>
      </div>

      {/* Important Notes */}
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
        <h3 className="mb-2 text-sm font-medium text-yellow-800 dark:text-yellow-200">
          Important Notes
        </h3>
        <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
          <li>• This action will close the current month and cannot be undone</li>
          <li>• All current month data will be archived and available in reports</li>
          <li>• Members will receive notifications about the new billing cycle</li>
          <li>• New meal entries will be tracked for the new month period</li>
        </ul>
      </div>
    </div>
  )
}
