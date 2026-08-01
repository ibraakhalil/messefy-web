'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Calculator,
  Loader2,
  MessageSquareText,
  Receipt,
  ReceiptText,
  Utensils,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '@/components/ui/button';
import FormInput from '@/components/ui/form-input';
import { useWorkspace } from '@/providers/workspace-provider';
import { useCurrentPeriod } from '@/hooks/use-periods';
import { useCreateExpense } from '@/hooks/use-expenses';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/format-currency';

const QUICK_AMOUNTS = [500, 1000, 2000, 5000] as const;
const TITLE_SUGGESTIONS = ['Weekly bazar', 'Gas bill', 'Utilities', 'Cleaning'] as const;

const expenseSchema = z.object({
  title: z.string().min(1, 'Expense title is required').max(120, 'Title is too long'),
  amount: z.number().positive('Amount must be greater than 0'),
  allocationType: z.literal('by_meals'),
  note: z.string().max(250, 'Note must be within 250 characters').optional(),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

export default function ExpenseEntryForm() {
  const workspaceId = useWorkspace((state) => state.member?.workspaceId ?? '');
  const { data: currentPeriod } = useCurrentPeriod(workspaceId);
  const { mutateAsync: saveExpense, isPending } = useCreateExpense();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
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
  const title = watch('title');
  const enteredAmount = watch('amount');
  const note = watch('note') ?? '';

  const setQuickAmount = (amount: number) => {
    setValue('amount', amount, { shouldDirty: true, shouldValidate: true });
  };

  const setSuggestedTitle = (suggestedTitle: string) => {
    setValue('title', suggestedTitle, { shouldDirty: true, shouldValidate: true });
  };

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
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-5xl space-y-5">
      <div>
        <section className="border-border-color bg-card-bg overflow-hidden rounded-2xl border shadow-sm">
          <div className="border-border-color tablet:px-6 flex items-center gap-3 border-b bg-rose-50/60 px-4 py-4 dark:bg-rose-950/20">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300">
              <ReceiptText className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-pure-color font-semibold">Expense details</h2>
              <p className="text-subtitle-secondary text-xs">
                Describe what was purchased and its cost
              </p>
            </div>
          </div>

          <div className="tablet:p-6 space-y-5 p-4">
            <div className="grid grid-cols-1 gap-5 tablet:grid-cols-2">
              <div className="space-y-2.5">
                <FormInput
                  id="expense-title"
                  label="What was this expense for?"
                  placeholder="e.g. Weekly bazar"
                  autoComplete="off"
                  icon={<Receipt className="h-4 w-4 text-rose-600" />}
                  error={errors.title?.message}
                  disabled={isPending}
                  {...register('title')}
                />
                <div className="flex flex-wrap gap-2" aria-label="Common expense titles">
                  {TITLE_SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setSuggestedTitle(suggestion)}
                      disabled={isPending}
                      className={cn(
                        'border-border-color bg-card-bg text-subtitle-color h-9 rounded-lg border px-3 text-sm transition-colors hover:border-rose-400 hover:bg-rose-50 hover:text-rose-700 focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none disabled:opacity-50 dark:hover:bg-rose-950/30 dark:hover:text-rose-300',
                        title === suggestion &&
                          'border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300',
                      )}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5">
                <FormInput
                  id="expense-amount"
                  label="How much was spent?"
                  type="number"
                  min="0"
                  step="0.01"
                  inputMode="decimal"
                  placeholder="0.00"
                  icon={<Calculator className="h-4 w-4 text-rose-600" />}
                  error={errors.amount?.message}
                  disabled={isPending}
                  {...register('amount', { valueAsNumber: true })}
                />
                <div className="flex flex-wrap gap-2" aria-label="Quick expense amounts">
                  {QUICK_AMOUNTS.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setQuickAmount(amount)}
                      disabled={isPending}
                      className={cn(
                        'border-border-color bg-card-bg text-subtitle-color h-9 rounded-lg border px-3 text-sm font-medium transition-colors hover:border-rose-400 hover:bg-rose-50 hover:text-rose-700 focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none disabled:opacity-50 dark:hover:bg-rose-950/30 dark:hover:text-rose-300',
                        enteredAmount === amount &&
                          'border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300',
                      )}
                    >
                      {formatCurrency(amount, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-border-color bg-secondary-bg/70 rounded-xl border p-3.5">
              <input type="hidden" {...register('allocationType')} />
              <div className="flex gap-3">
                <span className="bg-card-bg flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-rose-600">
                  <Utensils className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-pure-color text-sm font-medium">Shared by meal count</p>
                  <p className="text-subtitle-secondary mt-0.5 text-xs leading-5">
                    This expense is automatically shared among members based on their meals.
                  </p>
                </div>
              </div>
              {errors.allocationType && (
                <p className="mt-2 text-sm text-red-600">{errors.allocationType.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="expense-note"
                  className="text-subtitle-color flex items-center gap-2 text-sm font-medium"
                >
                  <MessageSquareText className="h-4 w-4 text-rose-600" aria-hidden="true" />
                  Note <span className="text-subtitle-secondary font-normal">(optional)</span>
                </label>
                <span className="text-subtitle-secondary text-xs">{note.length}/250</span>
              </div>
              <textarea
                id="expense-note"
                rows={3}
                maxLength={250}
                className="border-border-color bg-card-bg text-pure-color placeholder:text-subtitle-secondary block w-full resize-y rounded-lg border px-4 py-3 placeholder:text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none disabled:opacity-60"
                placeholder="Add a vendor, receipt number, or other details"
                disabled={isPending}
                {...register('note')}
              />
              {errors.note && <p className="text-sm text-red-600 dark:text-red-400">{errors.note.message}</p>}
            </div>
          </div>
        </section>
      </div>

      <div className="tablet:static tablet:mx-0 tablet:border-0 tablet:bg-transparent tablet:p-0 tablet:shadow-none tablet:backdrop-blur-none border-border-color bg-card-bg/95 sticky bottom-0 z-10 -mx-4 flex justify-end border-t p-4 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] backdrop-blur">
        <Button
          type="submit"
          disabled={isPending}
          className="tablet:w-auto w-full min-w-[170px] bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving expense...
            </>
          ) : (
            <>
              <ReceiptText className="h-4 w-4" />
              Save Expense
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
