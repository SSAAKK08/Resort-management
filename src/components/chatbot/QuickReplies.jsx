'use client';

import { useTranslations } from 'next-intl';

const quickReplyKeys = [
  'roomAvailability',
  'roomDetails',
  'food',
  'activities',
  'promotions',
  'policies',
];

export default function QuickReplies({ disabled, onSelect }) {
  const t = useTranslations('Chatbot.quickReplies');

  return (
    <div className="flex gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {quickReplyKeys.map((key) => {
        const question = t(key);
        return (
          <button
            key={key}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(question)}
            className="shrink-0 rounded-full border border-primary-Blue/30 bg-primary-Blue/5 px-3 py-1.5 text-xs font-medium text-primary-Blue transition hover:bg-primary-Blue/10 focus:outline-none focus:ring-2 focus:ring-primary-Blue disabled:cursor-not-allowed disabled:opacity-50 dark:bg-sky-400/10"
          >
            {question}
          </button>
        );
      })}
    </div>
  );
}
