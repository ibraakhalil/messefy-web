import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import FormSelect from '../ui/form-select';
import FormInput from '../ui/form-input';
import Button from '../ui/button';
import z from 'zod';
import { useCreatePeriod } from '@/hooks/use-periods';
import { useWorkspace } from '@/providers/workspace-provider';
import toast from 'react-hot-toast';
import { ResponsiveDialog } from '../ui/responsive-dialog';
import { useQuery } from '@tanstack/react-query';
import { getAllWorkspaceMembers } from '@/lib/member-request';

const newPeriodSchema = z.object({
  year: z.number().min(2020).max(2100),
  month: z.number().min(1).max(12),
  managerId: z.string().nonempty('Manager is required'),
});

type NewPeriodFormValues = z.infer<typeof newPeriodSchema>;

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1),
  label: new Date(2000, i).toLocaleString('default', { month: 'long' }),
}));

export function CreateMonthForm() {
  const { mutateAsync, isPending } = useCreatePeriod();
  const { member } = useWorkspace();

  const { data: members } = useQuery({
    queryKey: ['workspace-members'],
    queryFn: () => getAllWorkspaceMembers(member?.workspaceId || ''),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewPeriodFormValues>({
    resolver: zodResolver(newPeriodSchema),
    defaultValues: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      managerId: member?.id || '',
    },
  });

  const onSubmit = async (data: NewPeriodFormValues) => {
    if (!member?.workspaceId) {
      toast.error('No workspace selected');
      return;
    }

    await mutateAsync({ workspaceId: member.workspaceId, ...data });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-1.5">
        <h3 className="text-lg font-semibold tracking-tight">Start New Period</h3>
        <p className="text-muted-foreground text-sm">
          Set up a new period for tracking meals and expenses.
        </p>
      </div>

      <div className="space-y-4">
        <FormSelect
          label="Select Manager"
          options={members?.map((m) => ({ value: m.id, label: m.user?.name || 'Unknown' })) || []}
          error={errors.managerId?.message}
          {...register('managerId')}
        />

        <div className="flex items-center justify-between gap-4">
          <FormSelect
            label="Month"
            options={MONTHS}
            error={errors.month?.message}
            {...register('month', { valueAsNumber: true })}
          />

          <FormInput
            label="Year"
            type="number"
            min="2020"
            max="2100"
            error={errors.year?.message}
            {...register('year', { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <ResponsiveDialog.Close>
          <Button type="button" variant="outline" onClick={() => reset()} disabled={isPending}>
            Cancel
          </Button>
        </ResponsiveDialog.Close>
        <Button type="submit" disabled={isPending}>
          {isPending && (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          )}
          Start Period
        </Button>
      </div>
    </form>
  );
}
