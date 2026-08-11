import 'server-only';
import { strapi } from '@/lib/strapi';

const DEFAULT_TIMEOUT_MS = 6000;
const MAX_RESULTS = 6;

function timeoutMs() {
  const configured = Number(process.env.CHAT_STRAPI_TIMEOUT_MS);
  return Number.isFinite(configured) && configured >= 1000 ? configured : DEFAULT_TIMEOUT_MS;
}

function unwrap(entry) {
  return entry?.attributes ? { ...entry.attributes, id: entry.id, documentId: entry.documentId } : entry;
}

function dataList(payload) {
  return Array.isArray(payload?.data) ? payload.data.map(unwrap) : [];
}

function fieldParams(fields) {
  const params = new URLSearchParams();
  fields.forEach((field, index) => params.set(`fields[${index}]`, field));
  return params;
}

async function setting(fields) {
  const params = fieldParams(fields);
  const payload = await strapi.get(`/api/resort-setting?${params}`, {
    timeoutMs: timeoutMs(),
    token: null,
  });
  return unwrap(payload?.data) || null;
}

async function catalog(endpoint, fields, configure) {
  const params = fieldParams(fields);
  params.set('pagination[pageSize]', String(MAX_RESULTS));
  configure?.(params);
  const payload = await strapi.get(`/api/${endpoint}?${params}`, {
    timeoutMs: timeoutMs(),
    token: null,
  });
  return dataList(payload);
}

async function currencySetting(extraFields = []) {
  return setting(['currency', ...extraFields]);
}

export async function loadChatData(intent) {
  if (intent === 'room_availability' || intent === 'room_details') {
    const fields = ['title', 'titleKm', 'price', 'maximumGuests', 'amenities', 'amenitiesKm', 'available', 'status'];
    const [items, resortSetting] = await Promise.all([
      catalog('rooms', fields, (params) => {
        if (intent === 'room_availability') {
          params.set('filters[available][$eq]', 'true');
          params.set('filters[status][$eq]', 'available');
        }
        params.set('sort[0]', 'price:asc');
      }),
      currencySetting(),
    ]);
    return { items, currency: resortSetting?.currency || '' };
  }

  if (intent === 'food') {
    const [items, resortSetting] = await Promise.all([
      catalog('foods', ['name', 'nameKm', 'price', 'available'], (params) => {
        params.set('filters[available][$eq]', 'true');
        params.set('sort[0]', 'name:asc');
      }),
      currencySetting(['restaurantHours', 'restaurantServices', 'restaurantServicesKm']),
    ]);
    return { items, currency: resortSetting?.currency || '', setting: resortSetting };
  }

  if (intent === 'activities') {
    const [items, resortSetting] = await Promise.all([
      catalog('activities', ['title', 'titleKm', 'duration', 'durationKm', 'location', 'locationKm', 'price', 'available'], (params) => {
        params.set('filters[available][$eq]', 'true');
        params.set('sort[0]', 'title:asc');
      }),
      currencySetting(),
    ]);
    return { items, currency: resortSetting?.currency || '' };
  }

  if (intent === 'promotions') {
    const today = new Date().toISOString().slice(0, 10);
    const [items, resortSetting] = await Promise.all([
      catalog('promotions', ['title', 'titleKm', 'promotionCode', 'discountType', 'discountValue', 'startDate', 'endDate', 'usageLimit', 'usedCount', 'active'], (params) => {
        params.set('filters[active][$eq]', 'true');
        params.set('filters[startDate][$lte]', today);
        params.set('filters[endDate][$gte]', today);
        params.set('sort[0]', 'endDate:asc');
      }),
      currencySetting(),
    ]);
    const activeItems = items.filter((item) => item.usageLimit == null || Number(item.usedCount) < Number(item.usageLimit));
    return { items: activeItems, currency: resortSetting?.currency || '' };
  }

  const fieldsByIntent = {
    check_in_out: ['checkInTime', 'checkOutTime'],
    booking_policy: ['bookingPolicy', 'bookingPolicyKm'],
    cancellation_policy: ['cancellationPolicy', 'cancellationPolicyKm'],
    payment_methods: ['paymentMethods', 'paymentMethodsKm'],
    stay_policies: ['checkInTime', 'checkOutTime', 'bookingPolicy', 'bookingPolicyKm', 'cancellationPolicy', 'cancellationPolicyKm', 'paymentMethods', 'paymentMethodsKm'],
    location: ['address', 'addressKm'],
    contact: ['phone', 'email'],
  };
  return { setting: await setting(fieldsByIntent[intent] || []) };
}
