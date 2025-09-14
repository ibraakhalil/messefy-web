'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Lock, Eye, EyeOff, LogOut, RefreshCw, AlertTriangle, Laptop, Smartphone, Globe } from 'lucide-react'
import FormInput from '@/components/ui/form-input'
import Button from '@/components/ui/button'

// Define the schema for password change form
const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(1, 'New password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>

interface SecuritySectionProps {
  isLoading?: boolean
}

// Sample active sessions data
const activeSessions = [
  {
    id: 'session-1',
    device: 'Windows PC',
    browser: 'Chrome',
    location: 'Dhaka, Bangladesh',
    ip: '103.28.121.45',
    lastActive: 'Current session',
    icon: Laptop,
  },
  {
    id: 'session-2',
    device: 'iPhone 13',
    browser: 'Safari',
    location: 'Dhaka, Bangladesh',
    ip: '103.28.121.46',
    lastActive: '2 hours ago',
    icon: Smartphone,
  },
  {
    id: 'session-3',
    device: 'Unknown device',
    browser: 'Firefox',
    location: 'New York, USA',
    ip: '192.168.1.1',
    lastActive: '3 days ago',
    icon: Globe,
  },
]

export default function SecuritySection({ isLoading = false }: SecuritySectionProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isResettingPassword, setIsResettingPassword] = useState(false)
  const [showResetConfirmation, setShowResetConfirmation] = useState(false)
  const [sessionToLogout, setSessionToLogout] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordChangeFormValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onSubmitPasswordChange = async (data: PasswordChangeFormValues) => {
    setIsChangingPassword(true)
    try {
      // Simulate API call
      console.log('Password change form submitted:', data)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      reset()
      // Success notification would go here
    } catch (error) {
      console.error('Password change failed:', error)
      // Error notification would go here
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handlePasswordReset = async () => {
    setIsResettingPassword(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setShowResetConfirmation(false)
      // Success notification would go here
    } catch (error) {
      console.error('Password reset failed:', error)
      // Error notification would go here
    } finally {
      setIsResettingPassword(false)
    }
  }

  const handleLogoutSession = async (sessionId: string) => {
    setSessionToLogout(sessionId)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // Success notification would go here
    } catch (error) {
      console.error('Session logout failed:', error)
      // Error notification would go here
    } finally {
      setSessionToLogout(null)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <div className="h-8 w-48 animate-pulse rounded-md bg-gray-200"></div>
          <div className="mt-4 space-y-4">
            <div className="h-20 animate-pulse rounded-md bg-gray-200"></div>
            <div className="h-20 animate-pulse rounded-md bg-gray-200"></div>
            <div className="h-20 animate-pulse rounded-md bg-gray-200"></div>
          </div>
        </div>
        
        <div>
          <div className="h-8 w-48 animate-pulse rounded-md bg-gray-200"></div>
          <div className="mt-4 space-y-4">
            <div className="h-24 animate-pulse rounded-md bg-gray-200"></div>
            <div className="h-24 animate-pulse rounded-md bg-gray-200"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Password Change Form */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
        <form onSubmit={handleSubmit(onSubmitPasswordChange)} className="mt-4 space-y-4">
          <div className="relative">
            <FormInput
              id="currentPassword"
              type={showCurrentPassword ? 'text' : 'password'}
              label="Current Password"
              placeholder="••••••••"
              icon={<Lock className="h-5 w-5 text-gray-400" />}
              error={errors.currentPassword?.message}
              {...register('currentPassword')}
            />
            <button
              type="button"
              className="absolute top-9 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
            >
              {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          <div className="relative">
            <FormInput
              id="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              label="New Password"
              placeholder="••••••••"
              icon={<Lock className="h-5 w-5 text-gray-400" />}
              error={errors.newPassword?.message}
              {...register('newPassword')}
            />
            <button
              type="button"
              className="absolute top-9 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowNewPassword(!showNewPassword)}
              aria-label={showNewPassword ? 'Hide password' : 'Show password'}
            >
              {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          <div className="relative">
            <FormInput
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              label="Confirm New Password"
              placeholder="••••••••"
              icon={<Lock className="h-5 w-5 text-gray-400" />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
            <button
              type="button"
              className="absolute top-9 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <Button
              type="submit"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700"
              disabled={isChangingPassword}
            >
              {isChangingPassword ? 'Changing Password...' : 'Change Password'}
            </Button>

            <button
              type="button"
              className="text-sm font-medium text-emerald-600 hover:text-emerald-500"
              onClick={() => setShowResetConfirmation(true)}
            >
              Forgot password?
            </button>
          </div>
        </form>
      </div>

      {/* Active Sessions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Active Sessions</h2>
        <div className="mt-4 space-y-4">
          {activeSessions.map((session) => {
            const Icon = session.icon
            const isCurrentSession = session.lastActive === 'Current session'
            const isLoggingOut = sessionToLogout === session.id
            
            return (
              <div 
                key={session.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                    <Icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {session.device} • {session.browser}
                      {isCurrentSession && (
                        <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                          Current
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">
                      {session.location} • {session.ip} • {session.lastActive}
                    </p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  className="flex items-center space-x-1"
                  onClick={() => handleLogoutSession(session.id)}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
                      <span>Logging out...</span>
                    </>
                  ) : (
                    <>
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </>
                  )}
                </Button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Password Reset Confirmation Dialog */}
      {showResetConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <h3 className="mb-2 text-center text-lg font-medium text-gray-900">
              Reset your password?
            </h3>
            <p className="mb-6 text-center text-gray-600">
              We'll send a password reset link to your email address. Are you sure you want to continue?
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                variant="secondary"
                onClick={() => setShowResetConfirmation(false)}
                disabled={isResettingPassword}
              >
                Cancel
              </Button>
              <Button
                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700"
                onClick={handlePasswordReset}
                disabled={isResettingPassword}
              >
                {isResettingPassword ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}