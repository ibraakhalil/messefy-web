'use client'

import Button from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Crown, Loader2, Shield, Users } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const changeManagerSchema = z.object({
  newManager: z.string().min(1, 'Please select a new manager'),
  currentPassword: z.string().min(1, 'Current password is required'),
  confirmTransfer: z.boolean().refine((val) => val === true, {
    message: 'You must confirm the transfer',
  }),
})

type ChangeManagerFormValues = z.infer<typeof changeManagerSchema>

export default function ChangeManagerPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  // Mock data
  const currentManager = {
    name: 'John Doe',
    email: 'john@example.com',
    joinedDate: '2023-06-15',
  }

  const eligibleMembers = [
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Admin' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'Member' },
    { id: '4', name: 'Alice Brown', email: 'alice@example.com', role: 'Admin' },
    { id: '5', name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Member' },
  ]

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangeManagerFormValues>({
    resolver: zodResolver(changeManagerSchema),
    defaultValues: {
      newManager: '',
      currentPassword: '',
      confirmTransfer: false,
    },
  })

  const onSubmit = async (data: ChangeManagerFormValues) => {
    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000))
      console.log('Manager change data:', data)
      setSuccess(true)
      reset()
      setTimeout(() => setSuccess(false), 5000)
    } catch (error) {
      console.error('Error changing manager:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400">
          <Crown className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Change Manager</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Transfer management responsibilities to another member
          </p>
        </div>
      </div>

      {/* Warning Notice */}
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
        <div className="flex items-start gap-3">
          <Shield className="mt-0.5 h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Important Notice
            </h3>
            <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
              Changing the manager will transfer all administrative privileges to the selected
              member. This action cannot be undone without their permission. Make sure you trust the
              new manager completely.
            </p>
          </div>
        </div>
      </div>

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
          <p className="text-sm text-green-800 dark:text-green-200">
            Manager change request initiated successfully! The new manager will receive an email to
            confirm the transfer.
          </p>
        </div>
      )}

      {/* Current Manager Info */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Current Manager
        </h2>
        <div className="flex items-center gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <Crown className="h-6 w-6" />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{currentManager.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{currentManager.email}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Manager since {currentManager.joinedDate}
            </p>
          </div>
        </div>
      </div>

      {/* Change Manager Form */}
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
          Transfer Management
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="newManager"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Select New Manager *
            </label>
            <select
              id="newManager"
              {...register('newManager')}
              className={`w-full rounded-lg border px-4 py-3 text-gray-900 focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white ${
                errors.newManager ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <option value="">Choose a member to transfer management to</option>
              {eligibleMembers.map((member) => (
                <option key={member.id} value={member.name}>
                  {member.name} ({member.email}) - {member.role}
                </option>
              ))}
            </select>
            {errors.newManager && (
              <p className="flex items-center gap-1 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />
                {errors.newManager.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Confirm Your Password *
            </label>
            <input
              id="currentPassword"
              type="password"
              placeholder="Enter your current password"
              {...register('currentPassword')}
              className={`w-full rounded-lg border px-4 py-3 text-gray-900 focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white ${
                errors.currentPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.currentPassword && (
              <p className="flex items-center gap-1 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <input
                id="confirmTransfer"
                type="checkbox"
                {...register('confirmTransfer')}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
              />
              <label htmlFor="confirmTransfer" className="text-sm text-gray-700 dark:text-gray-300">
                I understand that transferring management will remove all my administrative
                privileges and grant them to the selected member. This action requires confirmation
                from the new manager.
              </label>
            </div>
            {errors.confirmTransfer && (
              <p className="flex items-center gap-1 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />
                {errors.confirmTransfer.message}
              </p>
            )}
          </div>

          {/* What happens section */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
            <h3 className="mb-2 text-sm font-medium text-blue-800 dark:text-blue-200">
              What happens next?
            </h3>
            <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
              <li>• The selected member will receive an email invitation</li>
              <li>• They must accept the management transfer within 48 hours</li>
              <li>• Once accepted, all admin rights will be transferred</li>
              <li>• You will become a regular member with your previous role</li>
              <li>• All members will be notified of the management change</li>
            </ul>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[140px] bg-yellow-600 hover:bg-yellow-700"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  Transfer Management
                </span>
              )}
            </Button>
            <Button type="button" variant="secondary" onClick={() => reset()}>
              Cancel
            </Button>
          </div>
        </form>
      </div>

      {/* Recent Manager Changes */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Management History
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/20">
              <Crown className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                John Doe became manager
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                June 15, 2023 - Transferred from Sarah Wilson
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/20">
              <Users className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Sarah Wilson stepped down
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                June 15, 2023 - Personal reasons
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
