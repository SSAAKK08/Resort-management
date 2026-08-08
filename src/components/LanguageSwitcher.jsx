'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { localeCookie } from '@/i18n/config';

export default function LanguageSwitcher({ compact = false }) {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('Language');

  function changeLocale(event) {
    const nextLocale = event.target.value;
    document.cookie = `${localeCookie}=${nextLocale};path=/;max-age=31536000;samesite=lax`;
    document.documentElement.lang = nextLocale;
    document.body.classList.toggle('font-khmer', nextLocale === 'km');
    document.body.classList.toggle('font-english', nextLocale !== 'km');
    router.refresh();
  }

  return (
    <label className="inline-flex items-center">
      <span className="sr-only">{t('label')}</span>
      <select
        value={locale}
        onChange={changeLocale}
        aria-label={t('label')}
        className={`h-10 rounded-full border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition focus:ring-2 focus:ring-primary-Blue dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 ${compact ? 'max-w-24' : ''}`}
      >
        <option value="en">{t('english')}</option>
        <option value="km">{t('khmer')}</option>
      </select>
    </label>
  );
}
