'use client'

import Button from '@/components/ui/button'
import FormInput from '@/components/ui/form-input'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Loader2, Plus, Receipt, Upload } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const costSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  category: z.string().min(1, 'Category is required'),
  date: z.string().min(1, 'Date is required'),
  paidBy: z.string().min(1, 'Paid by is required'),
  receipt: z.string().optional(),
})

type CostFormValues = z.infer<typeof costSchema>

export default function AddCostPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [receipt, setReceipt] = useState<File | null>(null)

  const categories = [
    'Groceries',
    'Vegetables',
    'Meat & Fish',
    'Spices & Condiments',
    'Kitchen Supplies',
    'Gas/Fuel',
    'Cleaning Supplies',
    'Other',
  ]

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
  } = useForm<CostFormValues>({
    resolver: zodResolver(costSchema),
    defaultValues: {
      description: '',
      amount: 0,
      category: '',
      date: new Date().toISOString().split('T')[0],
      paidBy: '',
      receipt: '',
    },
  })

  const handleReceiptUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setReceipt(file)
      setValue('receipt', file.name)
    }
  }

  const onSubmit = async (data: CostFormValues) => {
    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log('Cost data:', data)
      console.log('Receipt file:', receipt)
      setSuccess(true)
      reset()
      setReceipt(null)
      setValue('date', new Date().toISOString().split('T')[0])
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Error adding cost:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400">
          <Receipt className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add Expense</h1>
          <p className="text-gray-600 dark:text-gray-400">Record mess expenses and costs</p>
        </div>
      </div>

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
          <p className="text-sm text-green-800 dark:text-green-200">
            Expense recorded successfully!
          </p>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="tablet:grid-cols-2 grid grid-cols-1 gap-6">
            <div className="tablet:col-span-2 space-y-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Description *
              </label>
              <FormInput
                id="description"
                type="text"
                placeholder="e.g., Weekly grocery shopping"
                {...register('description')}
                className={
                  errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                }
              />
              {errors.description && (
                <p className="flex items-center gap-1 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  {errors.description.message}
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
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Category *
              </label>
              <select
                id="category"
                {...register('category')}
                className={`w-full rounded-lg border px-4 py-2.5 text-gray-900 focus:border-red-500 focus:ring-red-500 dark:bg-gray-700 dark:text-white ${
                  errors.category ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="flex items-center gap-1 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  {errors.category.message}
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
                htmlFor="paidBy"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Paid By *
              </label>
              <select
                id="paidBy"
                {...register('paidBy')}
                className={`w-full rounded-lg border px-4 py-2.5 text-gray-900 focus:border-red-500 focus:ring-red-500 dark:bg-gray-700 dark:text-white ${
                  errors.paidBy ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <option value="">Select who paid</option>
                {members.map((member) => (
                  <option key={member.id} value={member.name}>
                    {member.name}
                  </option>
                ))}
              </select>
              {errors.paidBy && (
                <p className="flex items-center gap-1 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  {errors.paidBy.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="receipt"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Receipt (Optional)
            </label>
            <div className="flex w-full items-center justify-center">
              <label
                htmlFor="receipt-upload"
                className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-800"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> receipt image
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG or PDF (MAX. 10MB)
                  </p>
                  {receipt && (
                    <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                      Selected: {receipt.name}
                    </p>
                  )}
                </div>
                <input
                  id="receipt-upload"
                  type="file"
                  className="hidden"
                  accept="image/*,application/pdf"
                  onChange={handleReceiptUpload}
                />
              </label>
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
              className="min-w-[120px] bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Expense
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
