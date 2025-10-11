import Logo from '@/components/common/logo';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication - MessMate',
  description: 'Login or sign up to MessMate',
};

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center py-12">
      <div className="tablet:max-w-lg w-full max-w-[90%] space-y-8">
        <div className="flex justify-center">
          <Logo />
        </div>
        {children}
      </div>
    </div>
  );
}
