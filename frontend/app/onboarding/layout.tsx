import { auth } from '@/config/auth';
import { ReactNode } from 'react';

export default async function OnboardingLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  console.log('From Layout:', session);
  return <div className="min-h-screen">{children}</div>;
}
