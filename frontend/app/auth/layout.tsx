import Logo from '@/components/common/logo';
import LocaleSwitcher from '@/components/common/locale-switcher';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Auth.metadata');

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center py-12">
      <LocaleSwitcher className="absolute top-4 right-4" />
      <div className="tablet:max-w-lg w-full max-w-[90%] space-y-8">
        <div className="flex justify-center">
          <Logo />
        </div>
        {children}
      </div>
    </div>
  );
}
