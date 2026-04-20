'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Receipt } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '@/components/ui/button';
import FormInput from '@/components/ui/form-input';
import FormSelect from '@/components/ui/form-select';
import { useWorkspace } from '@/providers/workspace-provider';
import { useCurrentPeriod } from '@/hooks/use-periods';
import { useCreateExpense } from '@/hooks/use-expenses';

const expenseSchema = z.object({
  title: z.string().min(1, 'Expense title is required').max(120, 'Title is too long'),
  amount: z.number().positive('Amount must be greater than 0'),
  allocationType: z.literal('by_meals'),
  note: z.string().max(250, 'Note must be within 250 characters').optional(),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

export default function ExpenseEntryForm() {
  const workspaceId = useWorkspace().member?.workspaceId || '';
  const { data: currentPeriod } = useCurrentPeriod(workspaceId);
  const { mutateAsync: saveExpense, isPending } = useCreateExpense();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      title: '',
      amount: undefined,
      allocationType: 'by_meals',
      note: '',
    },
  });

  const onSubmit = async (data: ExpenseFormValues) => {
    if (!currentPeriod) {
      toast.error('No active period found');
      return;
    }

    await saveExpense({
      workspaceId,
      periodId: currentPeriod.id,
      title: data.title.trim(),
      amount: data.amount,
      allocationType: data.allocationType,
      note: data.note?.trim() || undefined,
    });

    reset({
      title: '',
      amount: undefined,
      allocationType: 'by_meals',
      note: '',
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-800">
        This phase supports shared meal expenses only. The entered amount contributes directly to
        the current meal rate calculation.
      </div>

      <FormInput
        id="expense-title"
        label="Expense Title"
        placeholder="Weekly bazar"
        icon={<Receipt className="h-4 w-4 text-gray-400" />}
        error={errors.title?.message}
        disabled={isPending}
        {...register('title')}
      />

      <FormInput
        id="expense-amount"
        label="Amount"
        type="number"
        min="0"
        step="0.01"
        placeholder="0.00"
        error={errors.amount?.message}
        disabled={isPending}
        {...register('amount', { valueAsNumber: true })}
      />

      <FormSelect
        id="expense-allocation"
        label="Allocation"
        options={[{ value: 'by_meals', label: 'By meals (shared)' }]}
        error={errors.allocationType?.message}
        {...register('allocationType')}
      />

      <div className="space-y-2">
        <label htmlFor="expense-note" className="text-subtitle-color block text-sm font-medium">
          Note
        </label>
        <textarea
          id="expense-note"
          rows={3}
          className="border-border-color block w-full rounded-lg border px-4 py-2.5 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
          placeholder="Optional expense details"
          disabled={isPending}
          {...register('note')}
        />
        {errors.note && <p className="text-sm text-red-600">{errors.note.message}</p>}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Expense'
          )}
        </Button>
      </div>
    </form>
  );
}
