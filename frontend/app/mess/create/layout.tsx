import { ReactNode } from 'react';

export default async function OnboardingLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen">{children}</div>;
}
