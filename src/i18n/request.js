import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, isSupportedLocale, localeCookie } from './config';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const requestedLocale = cookieStore.get(localeCookie)?.value;
  const locale = isSupportedLocale(requestedLocale) ? requestedLocale : defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    timeZone: process.env.RESORT_TIMEZONE || 'Asia/Phnom_Penh',
  };
});
