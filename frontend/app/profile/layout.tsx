import { auth } from '@/config/auth';
import AppHeader from '@/components/common/app-header';
import { redirect } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ subdomain?: string }>;
}

export default async function layout({ children, params }: LayoutProps) {
  const session = await auth();
  const { subdomain } = await params;

  if (!session) {
    redirect('/');
  }

  return (
    <div className="min-h-screen font-[var(--font-comfortaa)]">
      <AppHeader subdomain={subdomain} session={session} />
      {children}
    </div>
  );
}
