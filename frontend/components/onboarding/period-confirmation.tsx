import { useFormContext } from 'react-hook-form';
import FormInput from '../ui/form-input';
import FormCheckbox from '../ui/form-checkbox';
import { Calendar, Info } from 'lucide-react';

const PeriodConfirmation = () => {
  const { register, formState: { errors }, watch } = useFormContext();
  const understandPeriodClosing = watch('understandPeriodClosing');
  
  return (
    <div className="space-y-6">
      <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-900/30">
        <div className="flex">
          <div className="flex-shrink-0">
            <Info className="h-5 w-5 text-blue-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Period Information</h3>
            <div className="mt-2 text-sm text-blue-700 dark:text-blue-200">
              <p>A period represents a financial timeframe in your workspace. You can create multiple periods to track financial data over time.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="relative">
        <FormInput
          id="periodName"
          label="Period Name"
          placeholder="Enter period name"
          error={errors.periodName?.message as string}
          icon={<Calendar className="h-5 w-5 text-gray-400" />}
          {...register('periodName')}
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          This will be your first financial period
        </p>
      </div>
      
      <div className="rounded-md bg-amber-50 p-4 dark:bg-amber-900/20">
        <div className="flex">
          <div className="flex-shrink-0">
            <Info className="h-5 w-5 text-amber-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">About Period Closing</h3>
            <div className="mt-2 space-y-2 text-sm text-amber-700 dark:text-amber-200">
              <p>
                When you close a period, the following happens:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>All financial data for that period becomes locked and cannot be edited</li>
                <li>A financial snapshot is created for reporting and auditing purposes</li>
                <li>A new period is automatically created for continued operations</li>
              </ul>
              <p className="font-medium">
                You can close periods at any time, but it's typically done at the end of a month or quarter.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <FormCheckbox
          id="understandPeriodClosing"
          label="I understand how period closing works"
          error={errors.understandPeriodClosing?.message as string}
          {...register('understandPeriodClosing')}
        />
      </div>
      
      {understandPeriodClosing && (
        <div className="rounded-md bg-emerald-50 p-4 dark:bg-emerald-900/20">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-emerald-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-emerald-700 dark:text-emerald-200">
                Great! You're ready to complete the setup process. Click the "Complete Setup" button below to finish.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeriodConfirmation;