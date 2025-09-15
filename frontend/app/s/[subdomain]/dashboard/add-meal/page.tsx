'use client'

import Button from '@/components/ui/button'
import FormInput from '@/components/ui/form-input'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Loader2, Minus, Plus, Utensils } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const mealEntrySchema = z.object({
  date: z.string().min(1, 'Date is required'),
  mealType: z.enum(['breakfast', 'lunch', 'dinner']),
  members: z.array(
    z.object({
      name: z.string(),
      count: z.number().min(0),
    }),
  ),
})

type MealEntryFormValues = z.infer<typeof mealEntrySchema>

export default function AddMealPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  // Mock members data
  const allMembers = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Bob Johnson' },
    { id: '4', name: 'Alice Brown' },
    { id: '5', name: 'Charlie Wilson' },
    { id: '6', name: 'Diana Prince' },
  ]

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MealEntryFormValues>({
    resolver: zodResolver(mealEntrySchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      mealType: 'lunch',
      members: allMembers.map((member) => ({ name: member.name, count: 0 })),
    },
  })

  const watchedMembers = watch('members')

  const updateMemberCount = (index: number, change: number) => {
    const currentCount = watchedMembers[index].count
    const newCount = Math.max(0, currentCount + change)
    setValue(`members.${index}.count`, newCount)
  }

  const setAllMeals = (count: number) => {
    allMembers.forEach((_, index) => {
      setValue(`members.${index}.count`, count)
    })
  }

  const onSubmit = async (data: MealEntryFormValues) => {
    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log('Meal data:', data)
      setSuccess(true)
      // Reset form but keep date
      const currentDate = data.date
      reset()
      setValue('date', currentDate)
      setValue(
        'members',
        allMembers.map((member) => ({ name: member.name, count: 0 })),
      )
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Error adding meal:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalMeals = watchedMembers.reduce((sum, member) => sum + member.count, 0)

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400">
          <Utensils className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add Meal Entry</h1>
          <p className="text-gray-600 dark:text-gray-400">Record daily meals for all members</p>
        </div>
      </div>

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
          <p className="text-sm text-green-800 dark:text-green-200">
            Meal entry recorded successfully!
          </p>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="tablet:grid-cols-2 grid grid-cols-1 gap-6">
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
              {allMembers.map((member, index) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-600 dark:bg-gray-800"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {watchedMembers[index]?.count || 0} meal(s)
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => updateMemberCount(index, -1)}
                      className="h-8 w-8 p-0"
                      disabled={watchedMembers[index]?.count === 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="min-w-[2rem] text-center font-medium">
                      {watchedMembers[index]?.count || 0}
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

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || totalMeals === 0}
              className="min-w-[120px] bg-orange-600 hover:bg-orange-700"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Utensils className="h-4 w-4" />
                  Save Meal Entry
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
