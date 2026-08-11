'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { FiChevronUp, FiMessageCircle, FiMinus, FiSend, FiX } from 'react-icons/fi';
import ChatMessage from '@/components/chatbot/ChatMessage';
import QuickReplies from '@/components/chatbot/QuickReplies';
import { CHAT_MESSAGE_MAX_LENGTH } from '@/lib/chatbot';

const CLIENT_TIMEOUT_MS = 10_000;

export default function ChatBot() {
  const locale = useLocale();
  const t = useTranslations('Chatbot');
  const inputId = useId();
  const messagesEndRef = useRef(null);
  const pendingRef = useRef(false);
  const messageIdRef = useRef(1);
  const [display, setDisplay] = useState('closed');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState(() => [
    { id: 0, role: 'assistant', text: t('welcome') },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, loading, display]);

  useEffect(() => {
    if (display !== 'open') return undefined;
    function onKeyDown(event) {
      if (event.key === 'Escape') setDisplay('closed');
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [display]);

  function addMessage(role, text, action) {
    const message = { id: messageIdRef.current, role, text, ...(action ? { action } : {}) };
    messageIdRef.current += 1;
    setMessages((current) => [...current, message]);
  }

  async function sendMessage(value) {
    const message = value.trim();
    if (!message || pendingRef.current || message.length > CHAT_MESSAGE_MAX_LENGTH) return;

    pendingRef.current = true;
    setLoading(true);
    setInput('');
    addMessage('user', message);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, locale }),
        signal: controller.signal,
      });

      if (!response.ok) {
        if (response.status === 429) throw new Error('rate_limited');
        throw new Error('request_failed');
      }

      const payload = await response.json();
      addMessage('assistant', payload.reply, payload.action);
    } catch (requestError) {
      const key = requestError.message === 'rate_limited'
        ? 'errors.rateLimited'
        : requestError.name === 'AbortError'
          ? 'errors.timeout'
          : 'errors.unavailable';
      addMessage('assistant', t(key));
    } finally {
      clearTimeout(timeoutId);
      pendingRef.current = false;
      setLoading(false);
    }
  }

  function submit(event) {
    event.preventDefault();
    sendMessage(input);
  }

  if (display === 'closed') {
    return (
      <button
        type="button"
        onClick={() => setDisplay('open')}
        aria-label={t('open')}
        className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary-Blue text-white shadow-[0_12px_32px_rgba(0,100,146,0.35)] transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-primary-Blue/30 dark:text-slate-950 sm:bottom-6 sm:right-6"
      >
        <FiMessageCircle className="h-6 w-6" aria-hidden="true" />
      </button>
    );
  }

  if (display === 'minimized') {
    return (
      <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-3 z-40 flex w-[min(20rem,calc(100vw-1.5rem))] items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:bottom-6 sm:right-6">
        <button
          type="button"
          onClick={() => setDisplay('open')}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-primary-Blue"
          aria-label={t('restore')}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-Blue text-white dark:text-slate-950">
            <FiMessageCircle aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-secondary-title">{t('assistantName')}</span>
            <span className="flex items-center gap-1.5 text-xs text-secondary-gray-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {t('online')}
            </span>
          </span>
          <FiChevronUp className="ml-auto shrink-0" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setDisplay('closed')}
          aria-label={t('close')}
          className="rounded-lg p-2 text-secondary-gray-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-Blue dark:hover:bg-slate-800"
        >
          <FiX aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <section
      role="dialog"
      aria-modal="false"
      aria-labelledby={`${inputId}-title`}
      className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 flex max-h-[calc(100dvh-5.5rem)] min-h-[28rem] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-2xl dark:border-slate-700 dark:bg-slate-950 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:h-[min(40rem,calc(100dvh-7rem))] sm:w-[24rem]"
    >
      <header className="flex items-center gap-3 bg-primary-Blue px-4 py-3 text-white dark:text-slate-950">
        <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
          <FiMessageCircle className="h-5 w-5" aria-hidden="true" />
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-primary-Blue bg-emerald-400" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id={`${inputId}-title`} className="truncate font-semibold">{t('assistantName')}</h2>
          <p className="flex items-center gap-1.5 text-xs text-white/85 dark:text-slate-900/75">
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
            {t('online')}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDisplay('minimized')}
          aria-label={t('minimize')}
          className="rounded-lg p-2 transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/80"
        >
          <FiMinus aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setDisplay('closed')}
          aria-label={t('close')}
          className="rounded-lg p-2 transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/80"
        >
          <FiX aria-hidden="true" />
        </button>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4" aria-live="polite">
        {messages.map((message) => <ChatMessage key={message.id} message={message} />)}
        {loading && (
          <div className="flex justify-start" aria-label={t('typing')}>
            <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
              {[0, 1, 2].map((dot) => (
                <span
                  key={dot}
                  className="h-2 w-2 animate-bounce rounded-full bg-primary-Blue"
                  style={{ animationDelay: `${dot * 120}ms` }}
                />
              ))}
              <span className="sr-only">{t('typing')}</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <QuickReplies disabled={loading} onSelect={sendMessage} />

      <form onSubmit={submit} className="border-t border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
        <label htmlFor={inputId} className="sr-only">{t('messageLabel')}</label>
        <div className="flex items-end gap-2">
          <textarea
            id={inputId}
            rows={1}
            value={input}
            maxLength={CHAT_MESSAGE_MAX_LENGTH}
            disabled={loading}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
            placeholder={t('placeholder')}
            className="max-h-28 min-h-11 flex-1 resize-none rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary-Blue focus:ring-2 focus:ring-primary-Blue/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label={t('send')}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-Blue text-white transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-primary-Blue/25 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-950"
          >
            <FiSend aria-hidden="true" />
          </button>
        </div>
        <p className="mt-1.5 text-right text-[11px] text-slate-400">
          {t('characterCount', { count: input.length, max: CHAT_MESSAGE_MAX_LENGTH })}
        </p>
      </form>
    </section>
  );
}
