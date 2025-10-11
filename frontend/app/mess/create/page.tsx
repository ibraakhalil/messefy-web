'use client';

import Logo from '@/components/common/logo';
import OnboardingWizard from '@/components/onboarding/onboarding-wizard';

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="mb-8 flex flex-col items-center justify-center">
          <Logo />
          <p className="text-subtitle-secondary mt-2">Let's set up your Mess in just a few steps</p>
        </div>

        <OnboardingWizard />
      </div>
    </div>
  );
}
