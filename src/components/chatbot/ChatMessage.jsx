'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

const actionLinks = {
  booking: '/booking',
  rooms: '/booking',
  restaurant: '/restaurant',
  activities: '/activities',
  promotions: '/promotion',
  contact: '/about',
};

export default function ChatMessage({ message }) {
  const t = useTranslations('Chatbot');
  const fromAssistant = message.role === 'assistant';
  const href = actionLinks[message.action];

  return (
    <div className={`flex ${fromAssistant ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
          fromAssistant
            ? 'rounded-bl-md border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100'
            : 'rounded-br-md bg-primary-Blue text-white dark:text-slate-950'
        }`}
      >
        <p className="whitespace-pre-line break-words">{message.text}</p>
        {fromAssistant && href && (
          <Link
            href={href}
            className="mt-2 inline-flex rounded-lg bg-primary-Blue px-3 py-1.5 text-xs font-semibold text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary-Blue focus:ring-offset-2 dark:text-slate-950 dark:ring-offset-slate-800"
          >
            {t(`actions.${message.action}`)}
          </Link>
        )}
      </div>
    </div>
  );
}
