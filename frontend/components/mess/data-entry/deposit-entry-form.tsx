'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Wallet } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '@/components/ui/button';
import FormInput from '@/components/ui/form-input';
import FormSelect from '@/components/ui/form-select';
import { useWorkspace } from '@/providers/workspace-provider';
import { useMembers } from '@/hooks/use-members';
import { useCurrentPeriod } from '@/hooks/use-periods';
import { useCreateDeposit } from '@/hooks/use-deposits';

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-800">
        Record a member payment for the current open period. Deposits are reflected immediately in
        the balance summary.
      </div>

      <FormSelect
        id="deposit-member"
        label="Member"
        options={memberOptions}
        disabled={isLoadingMembers || isPending}
        error={errors.memberId?.message}
        {...register('memberId')}
      />

      <FormInput
        id="deposit-amount"
        label="Amount"
        type="number"
        min="0"
        step="0.01"
        placeholder="0.00"
        icon={<Wallet className="h-4 w-4 text-gray-400" />}
        error={errors.amount?.message}
        disabled={isPending}
        {...register('amount', { valueAsNumber: true })}
      />

      <div className="space-y-2">
        <label htmlFor="deposit-note" className="text-subtitle-color block text-sm font-medium">
          Note
        </label>
        <textarea
          id="deposit-note"
          rows={3}
          className="border-border-color block w-full rounded-lg border px-4 py-2.5 text-gray-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
          placeholder="Optional payment note"
          disabled={isPending}
          {...register('note')}
        />
        {errors.note && <p className="text-sm text-red-600">{errors.note.message}</p>}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending || isLoadingMembers}>
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Deposit'
          )}
        </Button>
      </div>
    </form>
  );
}
