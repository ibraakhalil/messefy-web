'use client'

import Button from '@/components/ui/button'
import FormInput from '@/components/ui/form-input'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Loader2, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const memberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number is required'),
  role: z.enum(['Admin', 'Member', 'Viewer']),
  roomNumber: z.string().optional(),
})

type MemberFormValues = z.infer<typeof memberSchema>

export default function AddMemberPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role: 'Member',
      roomNumber: '',
    },
  })

  const onSubmit = async (data: MemberFormValues) => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log('New member data:', data)
      setSuccess(true)
      reset()
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Error adding member:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
          <UserPlus className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add New Member</h1>
          <p className="text-gray-600 dark:text-gray-400">Add a new member to your mess</p>
        </div>
      </div>

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
          <p className="text-sm text-green-800 dark:text-green-200">
            Member added successfully! They will receive an invitation email.
          </p>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="tablet:grid-cols-2 grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Full Name *
              </label>
              <FormInput
                id="name"
                type="text"
                placeholder="Enter full name"
                {...register('name')}
                className={
                  errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                }
              />
              {errors.name && (
                <p className="flex items-center gap-1 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email Address *
              </label>
              <FormInput
                id="email"
                type="email"
                placeholder="Enter email address"
                {...register('email')}
                className={
                  errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                }
              />
              {errors.email && (
                <p className="flex items-center gap-1 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Phone Number *
              </label>
              <FormInput
                id="phone"
                type="tel"
                placeholder="Enter phone number"
                {...register('phone')}
                className={
                  errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                }
              />
              {errors.phone && (
                <p className="flex items-center gap-1 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="roomNumber"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Room Number
              </label>
              <FormInput
                id="roomNumber"
                type="text"
                placeholder="Enter room number (optional)"
                {...register('roomNumber')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Member Role *
            </label>
            <select
              id="role"
              {...register('role')}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="Member">Member - Standard access</option>
              <option value="Admin">Admin - Full access to all features</option>
              <option value="Viewer">Viewer - Read-only access</option>
            </select>
            {errors.role && (
              <p className="flex items-center gap-1 text-sm text-red-500">
                <AlertCircle className="h-4 w-4" />
                {errors.role.message}
              </p>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[120px] bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add Member
                </span>
              )}
            </Button>
            <Button type="button" variant="secondary" onClick={() => reset()}>
              Clear Form
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
