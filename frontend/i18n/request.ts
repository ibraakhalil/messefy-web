import { cookies } from 'next/headers';
import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, localeCookieName, locales } from './config';

async function loadMessages(locale: (typeof locales)[number]) {
  if (locale === 'en') {
    return (await import('../messages/en.json')).default;
  }

  return (await import('../messages/bn.json')).default;
}

export default getRequestConfig(async () => {
  const requestedLocale = (await cookies()).get(localeCookieName)?.value;
  const locale = hasLocale(locales, requestedLocale) ? requestedLocale : defaultLocale;

  return {
    locale,
    messages: await loadMessages(locale),
    timeZone: 'Asia/Dhaka',
  };
});
