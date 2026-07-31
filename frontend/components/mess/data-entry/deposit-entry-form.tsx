'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Banknote, Loader2, MessageSquareText, UserRound, Wallet } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '@/components/ui/button';
import FormInput from '@/components/ui/form-input';
import FormSelect from '@/components/ui/form-select';
import { useWorkspace } from '@/providers/workspace-provider';
import { useMembers } from '@/hooks/use-members';
import { useCurrentPeriod } from '@/hooks/use-periods';
import { useCreateDeposit } from '@/hooks/use-deposits';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/format-currency';

const QUICK_AMOUNTS = [500, 1000, 1500, 2000] as const;

const depositSchema = z.object({
  memberId: z.string().min(1, 'Member is required'),
  amount: z.number().positive('Amount must be greater than 0'),
  note: z.string().max(250, 'Note must be within 250 characters').optional(),
});

type DepositFormValues = z.infer<typeof depositSchema>;

interface DepositEntryFormProps {
  selectedMemberId?: string;
}

export default function DepositEntryForm({ selectedMemberId }: DepositEntryFormProps) {
  const workspaceId = useWorkspace().member?.workspaceId || '';
  const { data: members = [], isLoading: isLoadingMembers } = useMembers(workspaceId);
  const { data: currentPeriod } = useCurrentPeriod(workspaceId);
  const { mutateAsync: saveDeposit, isPending } = useCreateDeposit();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DepositFormValues>({
    resolver: zodResolver(depositSchema),
    defaultValues: {
      memberId: selectedMemberId ?? '',
      amount: undefined,
      note: '',
    },
  });

  useEffect(() => {
    if (selectedMemberId) {
      setValue('memberId', selectedMemberId);
    }
  }, [selectedMemberId, setValue]);

  const memberOptions = [
    { value: '', label: 'Select a member' },
    ...members.map((member) => ({
      value: member.id,
      label: member.user?.name || member.name || 'Offline member',
    })),
  ];
  const enteredAmount = watch('amount');
  const note = watch('note') ?? '';

  const setQuickAmount = (amount: number) => {
    setValue('amount', amount, { shouldDirty: true, shouldValidate: true });
  };

  const onSubmit = async (data: DepositFormValues) => {
    if (!currentPeriod) {
      toast.error('No active period found');
      return;
    }

    await saveDeposit({
      workspaceId,
      periodId: currentPeriod.id,
      memberId: data.memberId,
      amount: data.amount,
      note: data.note?.trim() || undefined,
    });

    reset({
      memberId: selectedMemberId ?? '',
      amount: undefined,
      note: '',
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-5xl space-y-5">
      <div>
        <section className="border-border-color bg-card-bg overflow-hidden rounded-2xl border shadow-sm">
          <div className="border-border-color tablet:px-6 flex items-center gap-3 border-b bg-emerald-50/60 px-4 py-4 dark:bg-emerald-950/20">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
              <Banknote className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-pure-color font-semibold">Deposit details</h2>
              <p className="text-subtitle-secondary text-xs">
                Choose a member, then enter the amount
              </p>
            </div>
          </div>

          <div className="tablet:p-6 space-y-5 p-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <UserRound className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                <span className="text-subtitle-color text-sm font-medium dark:text-gray-300">
                  Who paid?
                </span>
              </div>
              <FormSelect
                id="deposit-member"
                aria-label="Member who made the deposit"
                options={memberOptions}
                disabled={isLoadingMembers || isPending}
                error={errors.memberId?.message}
                {...register('memberId')}
              />
              <p className="text-subtitle-secondary text-xs">
                Select the member whose balance should receive this deposit.
              </p>
            </div>

            <div className="space-y-2.5">
              <FormInput
                id="deposit-amount"
                label="How much did they pay?"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                placeholder="0.00"
                icon={<Wallet className="h-4 w-4 text-emerald-600" />}
                error={errors.amount?.message}
                disabled={isPending}
                {...register('amount', { valueAsNumber: true })}
              />
              <div className="flex flex-wrap gap-2" aria-label="Quick deposit amounts">
                {QUICK_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setQuickAmount(amount)}
                    disabled={isPending}
                    className={cn(
                      'border-border-color bg-card-bg text-subtitle-color h-9 rounded-lg border px-3 text-sm font-medium transition-colors hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none disabled:opacity-50 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-300',
                      enteredAmount === amount &&
                        'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300',
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

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="deposit-note"
                  className="text-subtitle-color flex items-center gap-2 text-sm font-medium dark:text-gray-300"
                >
                  <MessageSquareText className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                  Note <span className="text-subtitle-secondary font-normal">(optional)</span>
                </label>
                <span className="text-subtitle-secondary text-xs">{note.length}/250</span>
              </div>
              <textarea
                id="deposit-note"
                rows={3}
                maxLength={250}
                className="border-border-color bg-card-bg text-pure-color block w-full resize-y rounded-lg border px-4 py-3 placeholder:text-sm placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none disabled:opacity-60"
                placeholder="e.g. Cash payment for July"
                disabled={isPending}
                {...register('note')}
              />
              {errors.note && <p className="text-sm text-red-600">{errors.note.message}</p>}
            </div>
          </div>
        </section>
      </div>

      <div className="tablet:static tablet:mx-0 tablet:border-0 tablet:bg-transparent tablet:p-0 tablet:shadow-none tablet:backdrop-blur-none border-border-color bg-card-bg/95 sticky bottom-0 z-10 -mx-4 flex justify-end border-t p-4 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] backdrop-blur">
        <Button
          type="submit"
          disabled={isPending || isLoadingMembers}
          className="tablet:w-auto w-full min-w-[170px]"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving deposit...
            </>
          ) : (
            <>
              <Banknote className="h-4 w-4" />
              Save Deposit
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
