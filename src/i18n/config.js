export const locales = ['en', 'km'];
export const defaultLocale = 'en';
export const localeCookie = 'sea-breeze-locale';

export function isSupportedLocale(value) {
  return locales.includes(value);
}
