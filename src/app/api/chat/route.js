import { createTranslator } from 'next-intl';
import englishMessages from '@/messages/en.json';
import khmerMessages from '@/messages/km.json';
import {
  CHAT_MESSAGE_MAX_LENGTH,
  createChatReply,
  detectChatIntent,
  resolveChatLocale,
  sanitizeChatMessage,
} from '@/lib/chatbot';
import { loadChatData } from '@/lib/chatbot-strapi';

const rateLimitStore = new Map();
const DEFAULT_RATE_LIMIT = 12;
const DEFAULT_RATE_WINDOW_MS = 60_000;

function positiveNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function clientAddress(request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'local';
}

function isRateLimited(request) {
  const now = Date.now();
  const windowMs = positiveNumber(process.env.CHAT_RATE_LIMIT_WINDOW_MS, DEFAULT_RATE_WINDOW_MS);
  const limit = positiveNumber(process.env.CHAT_RATE_LIMIT_MAX, DEFAULT_RATE_LIMIT);
  const key = clientAddress(request);
  const current = rateLimitStore.get(key);

  if (!current || now >= current.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  current.count += 1;
  if (rateLimitStore.size > 500) {
    for (const [address, entry] of rateLimitStore) {
      if (now >= entry.resetAt) rateLimitStore.delete(address);
    }
  }
  return current.count > limit;
}

function error(code, status) {
  return Response.json({ error: code }, { status });
}

export async function POST(request) {
  if (isRateLimited(request)) return error('rate_limited', 429);
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return error('invalid_content_type', 415);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return error('invalid_json', 400);
  }

  if (typeof body?.message !== 'string' || body.message.length > CHAT_MESSAGE_MAX_LENGTH) {
    return error('invalid_message', 400);
  }

  const message = sanitizeChatMessage(body.message);
  if (!message) return error('invalid_message', 400);

  const locale = resolveChatLocale(message, body.locale);
  const intent = detectChatIntent(message);
  const messages = locale === 'km' ? khmerMessages : englishMessages;
  const t = createTranslator({ locale, messages, namespace: 'Chatbot' });
  const result = await createChatReply({ intent, locale, t, loadData: loadChatData });

  return Response.json({ ...result, locale });
}
