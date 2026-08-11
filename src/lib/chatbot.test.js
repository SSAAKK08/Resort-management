import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CHAT_MESSAGE_MAX_LENGTH,
  createChatReply,
  detectChatIntent,
  resolveChatLocale,
  sanitizeChatMessage,
} from './chatbot.js';

const translations = {
  'responses.greeting': 'Hello',
  'responses.insufficient': 'I don’t have enough information about that yet. Please contact our resort staff.',
  'responses.serviceError': 'Service unavailable',
  'responses.roomsAvailableIntro': 'Available',
  'responses.roomAvailableLine': '• {name}: {price} · {guests}',
  'responses.notListed': 'not listed',
};

function t(key, values = {}) {
  return (translations[key] || key).replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? ''));
}

test('sanitizes chat input and enforces a documented maximum length', () => {
  assert.equal(sanitizeChatMessage('  <b>Hello</b>\u0000   resort  '), 'bHello/b resort');
  assert.equal(CHAT_MESSAGE_MAX_LENGTH, 500);
});

test('detects common English and Khmer intents', () => {
  const cases = [
    ['Which rooms are available?', 'room_availability'],
    ['What is the room price and Wi-Fi?', 'room_details'],
    ['Show me the restaurant menu', 'food'],
    ['What activities can we do?', 'activities'],
    ['Are there active promotions?', 'promotions'],
    ['What time is check-in?', 'check_in_out'],
    ['What is your cancellation policy?', 'cancellation_policy'],
    ['How can I pay?', 'payment_methods'],
    ['Where is the resort?', 'location'],
    ['តើមានបន្ទប់ណាខ្លះទំនេរ?', 'room_availability'],
    ['តើមានអាហារអ្វីខ្លះ?', 'food'],
    ['តើមានសកម្មភាពអ្វីខ្លះ?', 'activities'],
    ['បង្ហាញប្រូម៉ូសិនកំពុងដំណើរការ', 'promotions'],
    ['តើម៉ោងចូលស្នាក់នៅពេលណា?', 'check_in_out'],
    ['តើអាចបង់ប្រាក់តាមវិធីណា?', 'payment_methods'],
  ];

  for (const [message, intent] of cases) assert.equal(detectChatIntent(message), intent, message);
});

test('answers in the language used by the customer before the selected locale', () => {
  assert.equal(resolveChatLocale('សួស្តី', 'en'), 'km');
  assert.equal(resolveChatLocale('Hello', 'km'), 'en');
  assert.equal(resolveChatLocale('123', 'km'), 'km');
});

test('returns the required fallback when Strapi has no matching records', async () => {
  const response = await createChatReply({
    intent: 'room_availability',
    locale: 'en',
    t,
    loadData: async () => ({ items: [], currency: 'USD' }),
  });

  assert.equal(response.reply, translations['responses.insufficient']);
  assert.equal(response.intent, 'room_availability');
});

test('returns a safe message when the Strapi request fails', async () => {
  const response = await createChatReply({
    intent: 'activities',
    locale: 'km',
    t,
    loadData: async () => { throw new Error('database credentials must not leak'); },
  });

  assert.deepEqual(response, { reply: 'Service unavailable', intent: 'error' });
});

test('formats only values returned by Strapi', async () => {
  const response = await createChatReply({
    intent: 'room_availability',
    locale: 'en',
    t,
    loadData: async () => ({
      currency: 'USD',
      items: [{ title: 'Garden Room', price: 275, maximumGuests: 2 }],
    }),
  });

  assert.match(response.reply, /Garden Room/);
  assert.match(response.reply, /275/);
  assert.doesNotMatch(response.reply, /discount|policy/i);
});
