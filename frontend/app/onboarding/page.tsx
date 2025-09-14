'use client'

import OnboardingWizard from '@/components/onboarding/onboarding-wizard'

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <div className="w-full max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome to Messefy</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Let's set up your workspace in just a few steps
          </p>
        </div>

        <OnboardingWizard />
      </div>
    </div>
  )
}
