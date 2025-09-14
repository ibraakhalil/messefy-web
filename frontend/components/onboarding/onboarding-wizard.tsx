import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '../ui/button'
import ProgressIndicator from './progress-indicator'
import WorkspaceCreation from './workspace-creation'
import TeamMemberSetup from './team-member-setup'
import PeriodConfirmation from './period-confirmation'

// Define the schema for all steps
const onboardingSchema = z.object({
  // Step 1: Workspace Creation
  workspaceName: z.string().min(1, 'Workspace name is required'),
  currency: z.string().default('USD'),
  timezone: z.string(),
  startCurrentPeriod: z.boolean().default(true),

  // Step 2: Team Member Setup
  onlineMembers: z
    .array(
      z.object({
        email: z.string().email('Invalid email address'),
        role: z.enum(['Owner', 'Manager', 'Member', 'Viewer']),
        status: z.enum(['Pending', 'Sent']).default('Pending'),
      }),
    )
    .default([]),
  offlineMembers: z
    .array(
      z.object({
        name: z.string().min(1, 'Name is required'),
        role: z.enum(['Owner', 'Manager', 'Member', 'Viewer']),
      }),
    )
    .default([]),

  // Step 3: Period Confirmation
  periodName: z.string(),
  understandPeriodClosing: z.boolean().refine((val) => val === true, {
    message: 'You must understand period closing',
  }),
})

type OnboardingFormValues = z.infer<typeof onboardingSchema>

const OnboardingWizard = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  const methods = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      currency: 'USD',
      startCurrentPeriod: true,
      onlineMembers: [],
      offlineMembers: [],
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      periodName: `${new Date().toLocaleString('default', { month: 'long' })} ${new Date().getFullYear()}`,
      understandPeriodClosing: false,
    },
    mode: 'onChange',
  })

  const { handleSubmit, trigger } = methods

  const goToNextStep = async () => {
    let fieldsToValidate: string[] = []

    // Determine which fields to validate based on current step
    if (currentStep === 1) {
      fieldsToValidate = ['workspaceName', 'currency', 'timezone']
    } else if (currentStep === 2) {
      // For step 2, we don't need to validate anything specific
      // as the individual member forms will handle their own validation
    } else if (currentStep === 3) {
      fieldsToValidate = ['periodName', 'understandPeriodClosing']
    }

    const isValid = await trigger(fieldsToValidate as (keyof OnboardingFormValues)[])

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
    }
  }

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const onSubmit = (data: OnboardingFormValues) => {
    console.log('Form submitted:', data)
    // Here you would typically send the data to your backend
  }

  return (
    <div className="mx-auto max-w-3xl rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
      <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
          {currentStep === 1 && <WorkspaceCreation />}
          {currentStep === 2 && <TeamMemberSetup />}
          {currentStep === 3 && <PeriodConfirmation />}

          <div className="mt-8 flex justify-between">
            <Button
              variant="secondary"
              onClick={goToPreviousStep}
              disabled={currentStep === 1}
              type="button"
            >
              Back
            </Button>

            {currentStep < totalSteps ? (
              <Button variant="primary" onClick={goToNextStep} type="button">
                Next
              </Button>
            ) : (
              <Button variant="primary" type="submit">
                Complete Setup
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

export default OnboardingWizard
