'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import Button from '@/components/ui/button';
import DatePicker from '@/components/ui/date-picker';
import { Loader2, Minus, Plus, Save, Trash2 } from 'lucide-react';
import { useMembers } from '@/hooks/use-members';
import { useBatchCreateMeals } from '@/hooks/use-meals';
import { useCurrentPeriod } from '@/hooks/use-periods';
import { toast } from 'react-hot-toast';
import { useWorkspace } from '@/providers/workspace-provider';
import { cn } from '@/utils/cn';

const mealEntrySchema = z.object({
  meals: z.array(
    z.object({
      memberId: z.string(),
      breakfast: z.number().min(0),
      lunch: z.number().min(0),
      dinner: z.number().min(0),
    }),
  ),
});

type MealEntryFormValues = z.infer<typeof mealEntrySchema>;

interface MealEntryFormProps {
  date: string;
  onDateChange?: (date: string) => void;
}

export default function MealEntryForm({ date, onDateChange }: MealEntryFormProps) {
  const workspaceId = useWorkspace((state) => state.member?.workspaceId ?? '');

  const { data: members, isLoading: isLoadingMembers } = useMembers(workspaceId);
  const { data: currentPeriod } = useCurrentPeriod(workspaceId);
  const { mutate: saveMeals, isPending: isSaving } = useBatchCreateMeals();

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isDirty },
  } = useForm<MealEntryFormValues>({
    resolver: zodResolver(mealEntrySchema),
    defaultValues: {
      meals: [],
    },
  });

  // Initialize form with members when loaded
  useEffect(() => {
    if (members) {
      const initialMeals = members.map((member) => ({
        memberId: member.id,
        breakfast: 0,
        lunch: 0,
        dinner: 0,
      }));
      if (!isDirty) {
        setValue('meals', initialMeals);
      }
    }
  }, [members, setValue, isDirty]);

  const watchedMeals = watch('meals');
  const totalMeals =
    watchedMeals?.reduce(
      (sum, meal) => sum + (meal?.breakfast || 0) + (meal?.lunch || 0) + (meal?.dinner || 0),
      0,
    ) || 0;

  const updateMemberCount = (
    index: number,
    type: 'breakfast' | 'lunch' | 'dinner',
    change: number,
  ) => {
    const currentCount = watchedMeals?.[index]?.[type] || 0;
    const newCount = Math.max(0, currentCount + change);
    setValue(`meals.${index}.${type}`, newCount);
  };

  const clearAll = () => {
    watchedMeals.forEach((_, index) => {
      setValue(`meals.${index}.breakfast`, 0);
      setValue(`meals.${index}.lunch`, 0);
      setValue(`meals.${index}.dinner`, 0);
    });
  };

  const onSubmit = (data: MealEntryFormValues) => {
    if (!currentPeriod) {
      toast.error('No active period found');
      return;
    }

    const formattedMeals = data.meals
      .filter((meal) => meal.breakfast > 0 || meal.lunch > 0 || meal.dinner > 0)
      .map((meal) => ({
        memberId: meal.memberId,
        breakfast: meal.breakfast,
        lunch: meal.lunch,
        dinner: meal.dinner,
      }));

    if (formattedMeals.length === 0) {
      toast.error('Please add at least one meal');
      return;
    }

    saveMeals(
      {
        workspaceId,
        periodId: currentPeriod.id,
        date,
        meals: formattedMeals,
      },
      {
        onSuccess: () => {
          if (members) {
            setValue(
              'meals',
              members.map((m) => ({ memberId: m.id, breakfast: 0, lunch: 0, dinner: 0 })),
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
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3 sm:px-6 sm:py-4 dark:border-gray-700 dark:bg-gray-800/50">
          <div className="shrink-0">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Meal Sheet</h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Total Count:{' '}
              <span className="font-medium text-orange-600 dark:text-orange-400">{totalMeals}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {totalMeals > 0 && (
              <Button
                type="button"
                variant="secondary"
                onClick={clearAll}
                className="h-8 px-2 sm:px-3 text-xs text-red-600 dark:text-red-400 dark:hover:text-red-300"
              >
                <Trash2 className="mr-1 h-3.5 w-3.5" />
                <span className="hidden sm:inline">Clear All</span>
              </Button>
            )}
            <DatePicker
              id="meal-sheet-date"
              aria-label="Date"
              value={date}
              onChange={(e) => onDateChange?.(typeof e === 'string' ? e : e.target.value)}
              containerClassName="w-auto"
            />
          </div>
        </div>

        <div className="tablet:hidden divide-y divide-gray-200 dark:divide-gray-700">
          {members?.map((member, index) => {
            const memberName = member.user?.name || 'Unknown';
            const memberTotal =
              (watchedMeals?.[index]?.breakfast || 0) +
              (watchedMeals?.[index]?.lunch || 0) +
              (watchedMeals?.[index]?.dinner || 0);

            return (
              <article key={member.id} className="p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h4 className="min-w-0 truncate font-semibold text-gray-900 dark:text-white">
                    {memberName}
                  </h4>
                  <span
                    className={cn(
                      'inline-flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full px-2 text-xs font-medium',
                      memberTotal > 0
                        ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
                    )}
                    aria-label={`${memberTotal} meals total`}
                  >
                    {memberTotal}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {(['breakfast', 'lunch', 'dinner'] as const).map((type) => {
                    const count = watchedMeals?.[index]?.[type] || 0;
                    const mealLabel = type[0].toUpperCase() + type.slice(1);

                    return (
                      <div
                        key={type}
                        className="min-w-0 rounded-lg bg-gray-50 p-1.5 dark:bg-gray-700/40"
                      >
                        <span className="mb-1 block truncate text-center text-[11px] font-medium text-gray-600 dark:text-gray-300">
                          {mealLabel}
                        </span>
                        <div className="flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => updateMemberCount(index, type, -1)}
                            disabled={count === 0}
                            aria-label={`Decrease ${mealLabel.toLowerCase()} for ${memberName}`}
                            className="flex h-8 w-8 shrink-0 touch-manipulation items-center justify-center rounded-md border border-gray-200 text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span
                            className={cn(
                              'min-w-5 flex-1 text-center text-sm font-semibold',
                              count > 0
                                ? 'text-gray-900 dark:text-white'
                                : 'text-gray-400 dark:text-gray-500',
                            )}
                            aria-live="polite"
                          >
                            {count}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateMemberCount(index, type, 1)}
                            aria-label={`Increase ${mealLabel.toLowerCase()} for ${memberName}`}
                            className="flex h-8 w-8 shrink-0 touch-manipulation items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>

        <div className="tablet:block hidden overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase dark:bg-gray-700/50 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3 font-medium">Member</th>
                <th className="px-6 py-3 text-center font-medium">Breakfast</th>
                <th className="px-6 py-3 text-center font-medium">Lunch</th>
                <th className="px-6 py-3 text-center font-medium">Dinner</th>
                <th className="px-6 py-3 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {members?.map((member, index) => {
                const memberTotal =
                  (watchedMeals?.[index]?.breakfast || 0) +
                  (watchedMeals?.[index]?.lunch || 0) +
                  (watchedMeals?.[index]?.dinner || 0);

                return (
                  <tr key={member.id} className="group hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {member.user?.name || 'Unknown'}
                    </td>
                    {(['breakfast', 'lunch', 'dinner'] as const).map((type) => (
                      <td key={type} className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateMemberCount(index, type, -1)}
                            disabled={watchedMeals?.[index]?.[type] === 0}
                            aria-label={`Decrease ${type} for ${member.user?.name || 'Unknown'}`}
                            className={cn(
                              'flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-400 transition-colors hover:border-gray-300 hover:text-gray-600 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:text-gray-300',
                              watchedMeals?.[index]?.[type] === 0 &&
                                'cursor-not-allowed opacity-50 hover:border-gray-200',
                            )}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span
                            className={cn(
                              'w-6 text-center font-medium',
                              watchedMeals?.[index]?.[type] > 0
                                ? 'text-gray-900 dark:text-white'
                                : 'text-gray-400 dark:text-gray-500',
                            )}
                          >
                            {watchedMeals?.[index]?.[type] || 0}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateMemberCount(index, type, 1)}
                            aria-label={`Increase ${type} for ${member.user?.name || 'Unknown'}`}
                            className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                    ))}
                    <td className="px-6 py-4 text-right font-medium text-gray-900 dark:text-white">
                      <span
                        className={cn(
                          'inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full px-2 text-xs',
                          memberTotal > 0
                            ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                            : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500',
                        )}
                      >
                        {memberTotal}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="tablet:static tablet:mx-0 tablet:justify-end tablet:border-0 tablet:bg-transparent tablet:p-0 tablet:shadow-none tablet:dark:bg-transparent sticky bottom-0 z-10 -mx-4 flex gap-3 border-t border-gray-200 bg-white/95 p-4 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] backdrop-blur dark:border-gray-700 dark:bg-gray-900/95">
        <Button
          type="button"
          variant="secondary"
          onClick={() => reset()}
          className="tablet:flex-none min-w-0 flex-1"
        >
          Reset
        </Button>
        <Button
          type="submit"
          disabled={isSaving || totalMeals === 0}
          className="tablet:min-w-[140px] tablet:flex-none min-w-0 flex-[1.4] bg-orange-600 hover:bg-orange-700"
        >
          {isSaving ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Entries
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}
