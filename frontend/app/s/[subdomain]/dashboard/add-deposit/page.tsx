'use client'

import Button from '@/components/ui/button'
import FormInput from '@/components/ui/form-input'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, DollarSign, Loader2, Plus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const depositSchema = z.object({
  memberName: z.string().min(1, 'Member selection is required'),
  amount: z.number().min(1, 'Amount must be greater than 0'),
  description: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
})

type DepositFormValues = z.infer<typeof depositSchema>

export default function AddDepositPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  // Mock members data
  const members = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Bob Johnson' },
    { id: '4', name: 'Alice Brown' },
  ]

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DepositFormValues>({
    resolver: zodResolver(depositSchema),
    defaultValues: {
      memberName: '',
      amount: 0,
      description: '',
      date: new Date().toISOString().split('T')[0],
    },
  })

  const onSubmit = async (data: DepositFormValues) => {
    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log('Deposit data:', data)
      setSuccess(true)
      reset()
      setValue('date', new Date().toISOString().split('T')[0])
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Error adding deposit:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
          <DollarSign className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add Deposit</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Record member contributions to the mess fund
          </p>
        </div>
      </div>

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
          <p className="text-sm text-green-800 dark:text-green-200">
            Deposit recorded successfully!
          </p>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="tablet:grid-cols-2 grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="memberName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Select Member *
              </label>
              <select
                id="memberName"
                {...register('memberName')}
                className={`w-full rounded-lg border px-4 py-2.5 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500 dark:bg-gray-700 dark:text-white ${
                  errors.memberName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <option value="">Choose a member</option>
                {members.map((member) => (
                  <option key={member.id} value={member.name}>
                    {member.name}
                  </option>
                ))}
              </select>
              {errors.memberName && (
                <p className="flex items-center gap-1 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  {errors.memberName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Amount *
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">$</span>
                <FormInput
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...register('amount', { valueAsNumber: true })}
                  className={`pl-8 ${errors.amount ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                />
              </div>
              {errors.amount && (
                <p className="flex items-center gap-1 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  {errors.amount.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Date *
              </label>
              <FormInput
                id="date"
                type="date"
                {...register('date')}
                className={
                  errors.date ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                }
              />
              {errors.date && (
                <p className="flex items-center gap-1 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  {errors.date.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Description
              </label>
              <FormInput
                id="description"
                type="text"
                placeholder="Optional description"
                {...register('description')}
              />
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
            <h3 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Quick Amount Buttons
            </h3>
            <div className="flex flex-wrap gap-2">
              {[50, 100, 200, 500, 1000].map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant="secondary"
                  onClick={() => setValue('amount', amount)}
                  className="px-3 py-1 text-xs"
                >
                  ${amount}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[120px] bg-emerald-600 hover:bg-emerald-700"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Deposit
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
