export const locales = ['bn', 'en'] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = 'bn';
export const localeCookieName = 'MESSMATE_LOCALE';

export const localeLabels: Record<AppLocale, string> = {
  bn: 'বাংলা',
  en: 'English',
};
