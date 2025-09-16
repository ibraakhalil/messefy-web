'use client'

import Button from '@/components/ui/button'
import FormInput from '@/components/ui/form-input'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  AlertCircle,
  DollarSign,
  Loader2,
  Minus,
  Plus,
  Receipt,
  Save,
  Utensils,
} from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const dataEntrySchema = z.object({
  entryType: z.enum(['meal', 'deposit', 'expense']),
  date: z.string().min(1, 'Date is required'),
  // Meal specific
  mealType: z.enum(['breakfast', 'lunch', 'dinner']).optional(),
  memberMeals: z
    .array(
      z.object({
        memberId: z.string(),
        name: z.string(),
        count: z.number().min(0),
      }),
    )
    .optional(),
  // Deposit specific
  depositMember: z.string().optional(),
  depositAmount: z.number().optional(),
  depositDescription: z.string().optional(),
  // Expense specific
  expenseDescription: z.string().optional(),
  expenseAmount: z.number().optional(),
  expenseCategory: z.string().optional(),
  expensePaidBy: z.string().optional(),
})

type DataEntryFormValues = z.infer<typeof dataEntrySchema>

export default function DataEntryPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [entryType, setEntryType] = useState<'meal' | 'deposit' | 'expense'>('meal')

  // Mock members data
  const members = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Bob Johnson' },
    { id: '4', name: 'Alice Brown' },
    { id: '5', name: 'Charlie Wilson' },
    { id: '6', name: 'Diana Prince' },
  ]

  const expenseCategories = [
    'Groceries',
    'Vegetables',
    'Meat & Fish',
    'Spices & Condiments',
    'Kitchen Supplies',
    'Gas/Fuel',
    'Cleaning Supplies',
    'Other',
  ]

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DataEntryFormValues>({
    resolver: zodResolver(dataEntrySchema),
    defaultValues: {
      entryType: 'meal',
      date: new Date().toISOString().split('T')[0],
      mealType: 'lunch',
      memberMeals: members.map((member) => ({
        memberId: member.id,
        name: member.name,
        count: 0,
      })),
      depositMember: '',
      depositAmount: 0,
      depositDescription: '',
      expenseDescription: '',
      expenseAmount: 0,
      expenseCategory: '',
      expensePaidBy: '',
    },
  })

  const watchedMemberMeals = watch('memberMeals')

  const updateMemberCount = (index: number, change: number) => {
    const currentCount = watchedMemberMeals?.[index]?.count || 0
    const newCount = Math.max(0, currentCount + change)
    setValue(`memberMeals.${index}.count`, newCount)
  }

  const setAllMeals = (count: number) => {
    members.forEach((_, index) => {
      setValue(`memberMeals.${index}.count`, count)
    })
  }

  const handleEntryTypeChange = (type: 'meal' | 'deposit' | 'expense') => {
    setEntryType(type)
    setValue('entryType', type)
    // Reset form values when switching types
    if (type === 'meal') {
      setValue(
        'memberMeals',
        members.map((member) => ({
          memberId: member.id,
          name: member.name,
          count: 0,
        })),
      )
    }
  }

  const onSubmit = async (data: DataEntryFormValues) => {
    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log('Data entry:', data)
      setSuccess(true)

      // Reset form but keep date and entry type
      const currentDate = data.date
      const currentType = data.entryType
      reset()
      setValue('date', currentDate)
      setValue('entryType', currentType)

      if (currentType === 'meal') {
        setValue(
          'memberMeals',
          members.map((member) => ({
            memberId: member.id,
            name: member.name,
            count: 0,
          })),
        )
      }

      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Error saving data:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'meal':
        return Utensils
      case 'deposit':
        return DollarSign
      case 'expense':
        return Receipt
      default:
        return Plus
    }
  }

  const getColor = (type: string) => {
    switch (type) {
      case 'meal':
        return 'orange'
      case 'deposit':
        return 'emerald'
      case 'expense':
        return 'red'
      default:
        return 'blue'
    }
  }

  const totalMeals = watchedMemberMeals?.reduce((sum, member) => sum + (member?.count || 0), 0) || 0

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg bg-${getColor(entryType)}-100 text-${getColor(entryType)}-600 dark:bg-${getColor(entryType)}-900/20 dark:text-${getColor(entryType)}-400`}
        >
          {(() => {
            const Icon = getIcon(entryType)
            return <Icon className="h-6 w-6" />
          })()}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add Data</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Record meals, deposits, and expenses in one place
          </p>
        </div>
      </div>

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
          <p className="text-sm text-green-800 dark:text-green-200">
            {entryType.charAt(0).toUpperCase() + entryType.slice(1)} recorded successfully!
          </p>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Entry Type Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              What do you want to add? *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  type: 'meal',
                  label: 'Meal Entry',
                  icon: Utensils,
                  description: 'Daily meal counts',
                },
                {
                  type: 'deposit',
                  label: 'Deposit',
                  icon: DollarSign,
                  description: 'Member payment',
                },
                { type: 'expense', label: 'Expense', icon: Receipt, description: 'Mess expense' },
              ].map(({ type, label, icon: Icon, description }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleEntryTypeChange(type as any)}
                  className={`rounded-lg border p-4 text-left transition-all ${
                    entryType === type
                      ? `border-${getColor(type)}-500 bg-${getColor(type)}-50 dark:bg-${getColor(type)}-900/20`
                      : 'border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                        entryType === type
                          ? `bg-${getColor(type)}-100 text-${getColor(type)}-600 dark:bg-${getColor(type)}-900/20 dark:text-${getColor(type)}-400`
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{label}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Common Date Field */}
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

          {/* Meal Entry Form */}
          {entryType === 'meal' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="mealType"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Meal Type *
                </label>
                <select
                  id="mealType"
                  {...register('mealType')}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-orange-500 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                </select>
              </div>

              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Member Meal Count
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Total: {totalMeals} meals
                    </span>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setAllMeals(1)}
                        className="px-3 py-1 text-xs"
                      >
                        Set All to 1
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setAllMeals(0)}
                        className="px-3 py-1 text-xs"
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="tablet:grid-cols-2 laptop:grid-cols-3 grid grid-cols-1 gap-4">
                  {members.map((member, index) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-600 dark:bg-gray-800"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {watchedMemberMeals?.[index]?.count || 0} meal(s)
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => updateMemberCount(index, -1)}
                          className="h-8 w-8 p-0"
                          disabled={watchedMemberMeals?.[index]?.count === 0}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="min-w-[2rem] text-center font-medium">
                          {watchedMemberMeals?.[index]?.count || 0}
                        </span>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => updateMemberCount(index, 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Deposit Entry Form */}
          {entryType === 'deposit' && (
            <div className="space-y-6">
              <div className="tablet:grid-cols-2 grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="depositMember"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Select Member *
                  </label>
                  <select
                    id="depositMember"
                    {...register('depositMember')}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Choose a member</option>
                    {members.map((member) => (
                      <option key={member.id} value={member.name}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="depositAmount"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Amount *
                  </label>
                  <div className="relative">
                    <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <FormInput
                      id="depositAmount"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      {...register('depositAmount', { valueAsNumber: true })}
                      className="pl-8"
                    />
                  </div>
                </div>

                <div className="tablet:col-span-2 space-y-2">
                  <label
                    htmlFor="depositDescription"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Description (Optional)
                  </label>
                  <FormInput
                    id="depositDescription"
                    type="text"
                    placeholder="Optional description"
                    {...register('depositDescription')}
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
                      onClick={() => setValue('depositAmount', amount)}
                      className="px-3 py-1 text-xs"
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Expense Entry Form */}
          {entryType === 'expense' && (
            <div className="space-y-6">
              <div className="tablet:col-span-2 space-y-2">
                <label
                  htmlFor="expenseDescription"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Description *
                </label>
                <FormInput
                  id="expenseDescription"
                  type="text"
                  placeholder="e.g., Weekly grocery shopping"
                  {...register('expenseDescription')}
                />
              </div>

              <div className="tablet:grid-cols-2 grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="expenseAmount"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Amount *
                  </label>
                  <div className="relative">
                    <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <FormInput
                      id="expenseAmount"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      {...register('expenseAmount', { valueAsNumber: true })}
                      className="pl-8"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="expenseCategory"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Category *
                  </label>
                  <select
                    id="expenseCategory"
                    {...register('expenseCategory')}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-red-500 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select a category</option>
                    {expenseCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="expensePaidBy"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Paid By *
                  </label>
                  <select
                    id="expensePaidBy"
                    {...register('expensePaidBy')}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-red-500 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select who paid</option>
                    {members.map((member) => (
                      <option key={member.id} value={member.name}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                <h3 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Quick Amount Buttons
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[10, 25, 50, 100, 200].map((amount) => (
                    <Button
                      key={amount}
                      type="button"
                      variant="secondary"
                      onClick={() => setValue('expenseAmount', amount)}
                      className="px-3 py-1 text-xs"
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || (entryType === 'meal' && totalMeals === 0)}
              className={`min-w-[120px] bg-${getColor(entryType)}-600 hover:bg-${getColor(entryType)}-700`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save {entryType.charAt(0).toUpperCase() + entryType.slice(1)}
                </span>
              )}
            </Button>
            <Button type="button" variant="secondary" onClick={() => reset()}>
              Reset Form
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
