export const CHAT_MESSAGE_MAX_LENGTH = 500;

const DATA_INTENTS = new Set([
  'room_availability',
  'room_details',
  'food',
  'activities',
  'promotions',
  'check_in_out',
  'booking_policy',
  'cancellation_policy',
  'payment_methods',
  'stay_policies',
  'location',
  'contact',
]);

const INTENT_PATTERNS = [
  ['greeting', /\b(hello|hi|hey|good\s*(morning|afternoon|evening)|សួស្តី|ជំរាបសួរ)\b/i],
  ['stay_policies', /\b(stay\s+polic(?:y|ies)|hotel\s+polic(?:y|ies)|all\s+polic(?:y|ies))\b|គោលការណ៍ស្នាក់នៅ|គោលការណ៍ទាំងអស់/i],
  ['cancellation_policy', /\b(cancel(?:lation|ling)?|refund)\b|លុបចោល|បោះបង់|សងប្រាក់/i],
  ['check_in_out', /\b(check[\s-]?in|check[\s-]?out|arrival\s+time|departure\s+time)\b|ម៉ោងចូល|ម៉ោងចាកចេញ|ចូលស្នាក់|ចាកចេញ/i],
  ['payment_methods', /\b(payment|pay|cash|card|visa|mastercard|bank)\b|ការទូទាត់|បង់ប្រាក់|កាត|សាច់ប្រាក់|ធនាគារ/i],
  ['promotions', /\b(promo(?:tion)?s?|discounts?|offers?|coupon|voucher)\b|ប្រូម៉ូសិន|បញ្ចុះតម្លៃ|កូដបញ្ចុះតម្លៃ/i],
  ['food', /\b(food|restaurant|menu|breakfast|lunch|dinner|meal|dining)\b|អាហារ|ភោជនីយដ្ឋាន|មុខម្ហូប|អាហារពេលព្រឹក|អាហារថ្ងៃត្រង់|អាហារពេលល្ងាច/i],
  ['activities', /\b(activit(?:y|ies)|things?\s+to\s+do|excursion|pool|boat|zip\s*line|scuba|diving)\b|សកម្មភាព|កម្សាន្ត|អាងហែលទឹក|ជិះទូក|មុជទឹក/i],
  ['room_availability', /\b(available|availability|vacan(?:t|cy)|free)\b.{0,24}\b(room|suite|villa)s?\b|\b(room|suite|villa)s?\b.{0,24}\b(available|availability|vacan(?:t|cy)|free)\b|បន្ទប់ទំនេរ|បន្ទប់មានទេ|មានបន្ទប់/i],
  ['room_details', /\b(room|suite|villa)s?\b|\b(room\s+rate|room\s+price|capacity|amenit(?:y|ies)|facilit(?:y|ies)|wi[\s-]?fi|guest capacity)\b|បន្ទប់|តម្លៃបន្ទប់|ចំនួនភ្ញៀវ|វ៉ាយហ្វាយ|បរិក្ខារ|សេវាបន្ទប់/i],
  ['booking_policy', /\b(book(?:ing)?|reservation|reserve)\b|ការកក់|កក់បន្ទប់|គោលការណ៍កក់/i],
  ['contact', /\b(contact|phone|telephone|email|call|reach)\b|ទាក់ទង|លេខទូរស័ព្ទ|អ៊ីមែល/i],
  ['location', /\b(where|location|located|address|directions?|map)\b|ទីតាំង|អាសយដ្ឋាន|នៅឯណា|ផែនទី/i],
];

export function sanitizeChatMessage(value) {
  if (typeof value !== 'string') return '';
  const withoutControlCharacters = [...value].filter((character) => {
    const codePoint = character.codePointAt(0);
    return codePoint > 31 && codePoint !== 127 || codePoint === 9 || codePoint === 10 || codePoint === 13;
  }).join('');

  return withoutControlCharacters
    .normalize('NFKC')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function resolveChatLocale(message, selectedLocale = 'en') {
  if (/\p{Script=Khmer}/u.test(message)) return 'km';
  if (/[A-Za-z]/.test(message)) return 'en';
  return selectedLocale === 'km' ? 'km' : 'en';
}

export function detectChatIntent(message) {
  const normalized = sanitizeChatMessage(message).toLowerCase();
  return INTENT_PATTERNS.find(([, pattern]) => pattern.test(normalized))?.[0] || 'unknown';
}

function translatedValue(source, field, locale) {
  if (!source) return '';
  const localized = source[`${field}Km`];
  if (locale === 'km' && (Array.isArray(localized) ? localized.length : localized)) return localized;
  return source[field] || '';
}

function listValue(value) {
  if (!Array.isArray(value)) return '';
  return value
    .map((item) => typeof item === 'string' ? item : item?.name || item?.label || item?.title || '')
    .filter(Boolean)
    .join(', ');
}

function amount(value, currency, locale) {
  const number = Number(value);
  if (!Number.isFinite(number)) return '';
  return new Intl.NumberFormat(locale === 'km' ? 'km-KH' : 'en-US', {
    style: currency ? 'currency' : 'decimal',
    currency: currency || undefined,
    maximumFractionDigits: 2,
  }).format(number);
}

function lineList(intro, lines) {
  return `${intro}\n${lines.join('\n')}`;
}

function formatRooms(data, locale, t, availabilityOnly) {
  const items = data?.items || [];
  if (!items.length) return null;
  const lines = items.map((room) => {
    const amenities = listValue(translatedValue(room, 'amenities', locale));
    const hasWifi = /wi[\s-]?fi|wireless internet/i.test(amenities);
    const details = availabilityOnly
      ? t('responses.roomAvailableLine', {
          name: translatedValue(room, 'title', locale) || room.title,
          price: amount(room.price, data.currency, locale),
          guests: room.maximumGuests || t('responses.notListed'),
        })
      : t('responses.roomDetailLine', {
          name: translatedValue(room, 'title', locale) || room.title,
          price: amount(room.price, data.currency, locale),
          guests: room.maximumGuests || t('responses.notListed'),
          wifi: hasWifi ? t('responses.yes') : t('responses.notListed'),
          amenities: amenities || t('responses.notListed'),
        });
    return details;
  });
  return lineList(t(availabilityOnly ? 'responses.roomsAvailableIntro' : 'responses.roomsIntro'), lines);
}

function formatFood(data, locale, t) {
  const items = data?.items || [];
  const lines = items.map((food) => t('responses.foodLine', {
    name: translatedValue(food, 'name', locale) || food.name,
    price: amount(food.price, data.currency, locale),
  }));
  const services = translatedValue(data?.setting, 'restaurantServices', locale);
  const hours = data?.setting?.restaurantHours;
  if (services) lines.unshift(t('responses.restaurantServicesLine', { services }));
  if (hours) lines.unshift(t('responses.restaurantHoursLine', { hours }));
  return lines.length ? lineList(t('responses.foodIntro'), lines) : null;
}

function formatActivities(data, locale, t) {
  const items = data?.items || [];
  if (!items.length) return null;
  return lineList(t('responses.activitiesIntro'), items.map((activity) => t('responses.activityLine', {
    name: translatedValue(activity, 'title', locale) || activity.title,
    duration: translatedValue(activity, 'duration', locale) || t('responses.notListed'),
    location: translatedValue(activity, 'location', locale) || t('responses.notListed'),
    price: Number(activity.price) === 0
      ? t('responses.free')
      : amount(activity.price, data.currency, locale),
  })));
}

function formatPromotions(data, locale, t) {
  const items = data?.items || [];
  if (!items.length) return null;
  return lineList(t('responses.promotionsIntro'), items.map((promotion) => {
    const discount = promotion.discountType === 'percentage'
      ? t('responses.percentageDiscount', { value: promotion.discountValue })
      : t('responses.fixedDiscount', { value: amount(promotion.discountValue, data.currency, locale) });
    return t('responses.promotionLine', {
      name: translatedValue(promotion, 'title', locale) || promotion.title,
      discount,
      code: promotion.promotionCode,
      endDate: promotion.endDate,
    });
  }));
}

function settingLine(intent, setting, locale, t) {
  if (!setting) return null;
  if (intent === 'check_in_out') {
    if (!setting.checkInTime && !setting.checkOutTime) return null;
    return t('responses.checkInOut', {
      checkIn: setting.checkInTime || t('responses.notListed'),
      checkOut: setting.checkOutTime || t('responses.notListed'),
    });
  }
  if (intent === 'booking_policy') return translatedValue(setting, 'bookingPolicy', locale) || null;
  if (intent === 'cancellation_policy') return translatedValue(setting, 'cancellationPolicy', locale) || null;
  if (intent === 'payment_methods') {
    const methods = listValue(translatedValue(setting, 'paymentMethods', locale));
    return methods ? t('responses.paymentMethods', { methods }) : null;
  }
  if (intent === 'location') {
    const address = translatedValue(setting, 'address', locale);
    return address ? t('responses.location', { address }) : null;
  }
  if (intent === 'contact') {
    const details = [setting.phone, setting.email].filter(Boolean).join(' · ');
    return details ? t('responses.contact', { details }) : null;
  }
  if (intent === 'stay_policies') {
    const lines = [];
    if (setting.checkInTime || setting.checkOutTime) lines.push(t('responses.checkInOut', {
      checkIn: setting.checkInTime || t('responses.notListed'),
      checkOut: setting.checkOutTime || t('responses.notListed'),
    }));
    const booking = translatedValue(setting, 'bookingPolicy', locale);
    const cancellation = translatedValue(setting, 'cancellationPolicy', locale);
    const methods = listValue(translatedValue(setting, 'paymentMethods', locale));
    if (booking) lines.push(t('responses.bookingPolicyLine', { policy: booking }));
    if (cancellation) lines.push(t('responses.cancellationPolicyLine', { policy: cancellation }));
    if (methods) lines.push(t('responses.paymentMethods', { methods }));
    return lines.length ? lineList(t('responses.policiesIntro'), lines) : null;
  }
  return null;
}

export async function createChatReply({ intent, locale, t, loadData }) {
  if (intent === 'greeting') return { reply: t('responses.greeting'), intent };
  if (intent === 'unknown') return { reply: t('responses.insufficient'), intent };
  if (!DATA_INTENTS.has(intent)) return { reply: t('responses.insufficient'), intent: 'unknown' };

  try {
    const data = await loadData(intent, locale);
    let reply = null;
    let action;
    if (intent === 'room_availability') {
      reply = formatRooms(data, locale, t, true);
      action = 'booking';
    } else if (intent === 'room_details') {
      reply = formatRooms(data, locale, t, false);
      action = 'rooms';
    } else if (intent === 'food') {
      reply = formatFood(data, locale, t);
      action = 'restaurant';
    } else if (intent === 'activities') {
      reply = formatActivities(data, locale, t);
      action = 'activities';
    } else if (intent === 'promotions') {
      reply = formatPromotions(data, locale, t);
      action = 'promotions';
    } else {
      reply = settingLine(intent, data?.setting, locale, t);
      if (intent === 'booking_policy' || intent === 'stay_policies') action = 'booking';
      if (intent === 'location' || intent === 'contact') action = 'contact';
    }

    if (!reply) return { reply: t('responses.insufficient'), intent };
    return { reply, intent, ...(action ? { action } : {}) };
  } catch {
    return { reply: t('responses.serviceError'), intent: 'error' };
  }
}
