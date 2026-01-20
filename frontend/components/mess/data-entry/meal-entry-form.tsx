'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import Button from '@/components/ui/button';
import { Loader2, Minus, Plus, Save } from 'lucide-react';
import { useMembers } from '@/hooks/use-members';
import { useBatchCreateMeals } from '@/hooks/use-meals';
import { useParams } from 'next/navigation';
import { useCurrentPeriod } from '@/hooks/use-periods';
import { toast } from 'react-hot-toast';
import { useWorkspace } from '@/providers/workspace-provider';

const mealEntrySchema = z.object({
  mealType: z.enum(['breakfast', 'lunch', 'dinner']),
  meals: z.array(
    z.object({
      memberId: z.string(),
      count: z.number().min(0),
    }),
  ),
});

type MealEntryFormValues = z.infer<typeof mealEntrySchema>;

interface MealEntryFormProps {
  date: string;
}

export default function MealEntryForm({ date }: MealEntryFormProps) {
  const workspaceId = useWorkspace().member?.workspaceId || '';

  const { data: members, isLoading: isLoadingMembers } = useMembers(workspaceId);
  const { data: currentPeriod } = useCurrentPeriod(workspaceId);
  const { mutate: saveMeals, isPending: isSaving } = useBatchCreateMeals();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isDirty },
  } = useForm<MealEntryFormValues>({
    resolver: zodResolver(mealEntrySchema),
    defaultValues: {
      mealType: 'lunch',
      meals: [],
    },
  });

  // Initialize form with members when loaded
  useEffect(() => {
    if (members) {
      const initialMeals = members.map((member) => ({
        memberId: member.id,
        count: 0,
      }));
      // Only set if we haven't modified the form yet
      // Or if form is clean (initial load)
      if (!isDirty) {
        setValue('meals', initialMeals);
      }
    }
  }, [members, setValue, isDirty]);

  const watchedMeals = watch('meals');
  const totalMeals = watchedMeals?.reduce((sum, meal) => sum + (meal?.count || 0), 0) || 0;

  const updateMemberCount = (index: number, change: number) => {
    const currentCount = watchedMeals?.[index]?.count || 0;
    const newCount = Math.max(0, currentCount + change);
    setValue(`meals.${index}.count`, newCount);
  };

  const setAllMeals = (count: number) => {
    watchedMeals.forEach((_, index) => {
      setValue(`meals.${index}.count`, count);
    });
  };

  const onSubmit = (data: MealEntryFormValues) => {
    if (!currentPeriod) {
      toast.error('No active period found');
      return;
    }

    const formattedMeals = data.meals.map((meal) => {
      const entry: any = { memberId: meal.memberId };
      // We only set the count for the selected meal type
      // The backend will treat undefined fields as "do not update" if exists, or 0 if new
      // For batch entry, we should probably be explicit.
      // Actually, the backend `createBatchMealEntries` updates/merges.
      // So we need to construct payload correctly.
      // Wait, the UI only allows editing ONE meal type at a time for all members.
      // So we are submitting a batch where:
      // member A: { [mealType]: count }
      // member B: { [mealType]: count }

      entry[data.mealType] = meal.count;
      return entry;
    });

    saveMeals(
      {
        workspaceId,
        periodId: currentPeriod.id,
        date,
        meals: formattedMeals,
      },
      {
        onSuccess: () => {
          // Optional: reset counts to 0 or keep them? Usually keep them for next day?
          // User prob wants them reset or kept. Let's reset for now as per previous logic
          if (members) {
            setValue(
              'meals',
              members.map((m) => ({ memberId: m.id, count: 0 })),
            );
          }
        },
      },
    );
  };

  if (isLoadingMembers) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Meal Type *
        </label>
        <select
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
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Member Meal Count</h3>
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
          {members?.map((member, index) => (
            <div
              key={member.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-600 dark:bg-gray-800"
            >
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {member.user?.name || 'Unknown'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {watchedMeals?.[index]?.count || 0} meal(s)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => updateMemberCount(index, -1)}
                  className="h-8 w-8 p-0"
                  disabled={watchedMeals?.[index]?.count === 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="min-w-[2rem] text-center font-medium">
                  {watchedMeals?.[index]?.count || 0}
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
          disabled={isSaving || totalMeals === 0}
          className="min-w-[120px] bg-orange-600 hover:bg-orange-700"
        >
          {isSaving ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Meals
            </span>
          )}
        </Button>
        <Button type="button" variant="secondary" onClick={() => reset()}>
          Reset Form
        </Button>
      </div>
    </form>
  );
}
