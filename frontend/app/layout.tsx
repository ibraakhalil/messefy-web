import Providers from '@/providers/providers';
import '../styles/globals.css';

import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
import { WorkspaceProvider } from '@/providers/workspace-provider';
import { getValidWorkspaceMember } from '@/lib/workspace-requests';

const inter = localFont({
  src: '../public/fonts/inter.ttf',
  variable: '--font-inter',
});

const kalpurush = localFont({
  src: '../public/fonts/kalpurush.ttf',
  variable: '--font-kalpurush',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const [locale, t] = await Promise.all([getLocale(), getTranslations('Metadata')]);

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
    title: {
      default: t('title'),
      template: `%s | ${t('appName')}`,
    },
    description: t('description'),
    openGraph: {
      title: t('openGraphTitle'),
      description: t('openGraphDescription'),
      type: 'website',
      locale: locale === 'bn' ? 'bn_BD' : 'en_US',
      images: [
        {
          url: '/og.png',
          width: 1732,
          height: 909,
          alt: t('imageAlt'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('openGraphTitle'),
      description: t('openGraphDescription'),
      images: ['/og.png'],
    },
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [locale, messages, member] = await Promise.all([
    getLocale(),
    getMessages(),
    getValidWorkspaceMember(),
  ]);

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${inter.variable} ${kalpurush.variable}`}
    >
      <body className="bg-primary-bg text-pure-color font-sans">
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <WorkspaceProvider member={member ?? null}>{children}</WorkspaceProvider>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
