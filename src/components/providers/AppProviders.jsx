'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { NextIntlClientProvider } from 'next-intl';
import ThemeProvider from '@/components/providers/ThemeProvider';
import { getClerkLocalization } from '@/i18n/clerk-localization';
import { hasClerkPublishableKey } from '@/lib/clerk-config';

const clerkAppearance = {
  variables: {
    colorPrimary: '#006492',
    colorBackground: 'var(--surface)',
    colorText: 'var(--secondary-title)',
    colorInputBackground: 'var(--input-background)',
    colorInputText: 'var(--secondary-title)',
    borderRadius: '0.75rem',
    fontFamily: 'inherit',
  },
  elements: {
    cardBox: 'shadow-xl',
    card: 'border border-slate-200 dark:border-slate-700',
    footer: 'bg-transparent',
  },
};

export default function AppProviders({ children, locale, messages }) {
  const content = <ThemeProvider>{children}</ThemeProvider>;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {hasClerkPublishableKey() ? (
        <ClerkProvider
          appearance={clerkAppearance}
          localization={getClerkLocalization(locale)}
          signInUrl="/login"
          signUpUrl="/signup"
          signInFallbackRedirectUrl="/"
          signUpFallbackRedirectUrl="/"
        >
          {content}
        </ClerkProvider>
      ) : content}
    </NextIntlClientProvider>
  );
}
