import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '../ui/button';
import ProgressIndicator from './progress-indicator';
import WorkspaceCreation from './workspace-creation';
import { TeamMemberSetup } from './team-member-setup';

// Define the schema for all steps
const onboardingSchema = z.object({
  // Step 1: Workspace Creation
  workspaceName: z.string().min(1, 'Workspace name is required'),

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
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

const OnboardingWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  const methods = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      workspaceName: '',
      onlineMembers: [],
    },
    mode: 'onChange',
  });

  const { handleSubmit, trigger } = methods;

  const goToNextStep = async () => {
    let fieldsToValidate: string[] = [];

    // Determine which fields to validate based on current step
    if (currentStep === 1) {
      fieldsToValidate = ['workspaceName'];
    }

    const isValid = await trigger(fieldsToValidate as (keyof OnboardingFormValues)[]);

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = (data: OnboardingFormValues) => {
    console.log('Form submitted:', data);
    // Here you would typically send the data to your backend
  };

  return (
    <div className="mx-auto max-w-3xl rounded-lg border border-gray-200 bg-white p-6 shadow-md">
      <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
          {currentStep === 1 && <WorkspaceCreation />}
          {currentStep === 2 && <TeamMemberSetup />}

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
  );
};

export default OnboardingWizard;
