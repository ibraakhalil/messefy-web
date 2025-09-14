import { useFormContext } from 'react-hook-form'
import FormInput from '../ui/form-input'
import FormSelect from '../ui/form-select'
import ToggleSwitch from '../ui/toggle-switch'
import Tooltip from '../ui/tooltip'
import { Info } from 'lucide-react'
import { useEffect } from 'react'

const WorkspaceCreation = () => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext()
  const startCurrentPeriod = watch('startCurrentPeriod')

  // Currency options
  const currencies = [
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'JPY', label: 'JPY - Japanese Yen' },
    { value: 'CAD', label: 'CAD - Canadian Dollar' },
    { value: 'AUD', label: 'AUD - Australian Dollar' },
    { value: 'INR', label: 'INR - Indian Rupee' },
  ]

  // Timezone options - simplified list for example
  const timezones = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
    { value: 'Europe/Paris', label: 'Central European Time (CET)' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
    { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' },
  ]

  // Auto-detect timezone on component mount
  useEffect(() => {
    const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    setValue('timezone', detectedTimezone)
  }, [setValue])

  return (
    <div className="space-y-6">
      <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-900/30">
        <div className="flex">
          <div className="flex-shrink-0">
            <Info className="h-5 w-5 text-blue-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
              Workspace Setup
            </h3>
            <div className="mt-2 text-sm text-blue-700 dark:text-blue-200">
              <p>Let's set up your workspace with the basic information needed to get started.</p>
            </div>
          </div>
        </div>
      </div>

      <FormInput
        id="workspaceName"
        label="Workspace Name"
        placeholder="Enter workspace name"
        error={errors.workspaceName?.message as string}
        {...register('workspaceName')}
      />

      <FormSelect
        id="currency"
        label="Currency"
        options={currencies}
        error={errors.currency?.message as string}
        {...register('currency')}
      />

      <div className="relative">
        <FormSelect
          id="timezone"
          label={
            <div className="flex items-center">
              <span>Timezone</span>
              <Tooltip content="We've automatically detected your timezone. You can change it if needed.">
                <Info className="ml-1 h-4 w-4 text-gray-400" />
              </Tooltip>
            </div>
          }
          options={timezones}
          error={errors.timezone?.message as string}
          {...register('timezone')}
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Auto-detected from your browser
        </p>
      </div>

      <div className="mt-6 pt-4">
        <ToggleSwitch
          id="startCurrentPeriod"
          label="Start current period"
          checked={startCurrentPeriod}
          onChange={(checked: boolean) => setValue('startCurrentPeriod', checked)}
          helpText="When enabled, we'll automatically create a period starting from the current month"
        />
      </div>
    </div>
  )
}

export default WorkspaceCreation
