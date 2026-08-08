import '../index.css';
import SiteChrome from '@/components/layout/SiteChrome';
import AppProviders from '@/components/providers/AppProviders';
import { getLocale, getMessages } from 'next-intl/server';

export const metadata = {
  title: 'Sea Breeze Resort',
  description: 'Sea Breeze Resort rooms, dining, activities, and guest services.',
};

export default async function RootLayout({ children }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={locale === 'km' ? 'font-khmer' : 'font-english'}>
        <AppProviders locale={locale} messages={messages}>
          <SiteChrome>{children}</SiteChrome>
        </AppProviders>
      </body>
    </html>
  );
}
