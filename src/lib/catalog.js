const STRAPI_MEDIA_BASE = 'http://localhost:1337';

function absoluteMediaUrl(media, fallback) {
  const url = media?.url || media?.attributes?.url;
  if (!url) return fallback;
  if (/^https?:\/\//i.test(url)) return url;
  return `${STRAPI_MEDIA_BASE}${url}`;
}

function localized(source, field, locale) {
  const khmerValue = source?.[`${field}Km`];
  return locale === 'km' && (Array.isArray(khmerValue) ? khmerValue.length : khmerValue)
    ? khmerValue
    : source?.[field];
}

export function normalizeRoom(room, locale = 'en') {
  const source = room?.attributes ? { ...room.attributes, id: room.id, documentId: room.documentId } : room;
  const mainImage = absoluteMediaUrl(source?.mainImage, source?.legacyImagePath || '/assets/booking/TopBanner.jpg');
  const galleryMedia = Array.isArray(source?.gallery) ? source.gallery : source?.gallery?.data || [];
  const gallery = galleryMedia.map((image) => absoluteMediaUrl(image)).filter(Boolean);
  while (gallery.length < 3) gallery.push(mainImage);
  const categorySource = source?.category?.attributes || source?.category;
  const category = localized(categorySource, 'name', locale) || categorySource?.name || source?.category || 'Uncategorized';

  const amenitiesSource = localized(source, 'amenities', locale);
  const amenities = Array.isArray(amenitiesSource) ? amenitiesSource : [];
  const amenityText = amenities.map((item) => {
    if (typeof item === 'string') return item;
    return item?.name || item?.label || item?.title || '';
  });
  const hasWifi = typeof source?.wifi === 'boolean'
    ? source.wifi
    : amenityText.some((item) => /wi[\s-]?fi|wireless internet/i.test(item));

  return {
    ...source,
    id: source?.id,
    documentId: source?.documentId,
    slug: source?.slug || String(source?.id || ''),
    title: localized(source, 'title', locale),
    description: localized(source, 'description', locale),
    size: localized(source, 'size', locale),
    bed: localized(source, 'bed', locale),
    view: localized(source, 'view', locale),
    image: mainImage,
    gallery: gallery.slice(0, 3),
    category,
    price: Number(source?.price || 0),
    maximumGuests: Number(source?.maximumGuests || 1),
    guests: `${Number(source?.maximumGuests || 1)} ${Number(source?.maximumGuests || 1) === 1 ? 'Adult' : 'Adults'}`,
    amenities,
    wifi: hasWifi,
    pool: /pool/i.test(String(source?.view || '')) || amenityText.some((item) => /pool/i.test(item)),
    rating: Number(source?.rating || 4.8),
    reviews: Number(source?.reviews || 0),
  };
}

export function normalizeFood(food, locale = 'en') {
  const source = food?.attributes ? { ...food.attributes, id: food.id, documentId: food.documentId } : food;
  const mainImage = absoluteMediaUrl(source?.mainImage, source?.legacyImagePath || source?.images || '/assets/restaurant/food1.jpg');
  const galleryMedia = Array.isArray(source?.gallery) ? source.gallery : source?.gallery?.data || [];
  const gallery = galleryMedia.map((image) => absoluteMediaUrl(image)).filter(Boolean);
  const categorySource = source?.category?.attributes || source?.category;
  const category = localized(categorySource, 'name', locale) || categorySource?.name || source?.category || source?.typesof || 'Chef Selection';

  return {
    ...source,
    name: localized(source, 'name', locale) || source?.foodName,
    slug: source?.slug || String(source?.id || ''),
    description: localized(source, 'description', locale) || source?.foodDescribtion || '',
    image: mainImage,
    gallery,
    category,
    price: Number(source?.price || 0),
    ingredients: Array.isArray(localized(source, 'ingredients', locale)) ? localized(source, 'ingredients', locale) : [],
  };
}

export function normalizeActivity(activity, locale = 'en') {
  const source = activity?.attributes ? { ...activity.attributes, id: activity.id, documentId: activity.documentId } : activity;
  const galleryMedia = Array.isArray(source?.gallery) ? source.gallery : source?.gallery?.data || [];
  const image = absoluteMediaUrl(source?.mainImage || galleryMedia[0], source?.legacyImagePath || '/assets/Activites/banner.png');
  return {
    ...source,
    id: source?.id,
    documentId: source?.documentId,
    slug: source?.slug || String(source?.id || ''),
    title: localized(source, 'title', locale),
    shortDescription: localized(source, 'shortDescription', locale),
    description: localized(source, 'description', locale),
    duration: localized(source, 'duration', locale),
    location: localized(source, 'location', locale),
    activityType: localized(source, 'activityType', locale),
    safetyNotes: localized(source, 'safetyNotes', locale),
    image,
    gallery: galleryMedia.map((item) => absoluteMediaUrl(item)).filter(Boolean),
    price: Number(source?.price || 0),
    requirements: Array.isArray(localized(source, 'requirements', locale)) ? localized(source, 'requirements', locale) : [],
    thingsToBring: Array.isArray(localized(source, 'thingsToBring', locale)) ? localized(source, 'thingsToBring', locale) : [],
    schedule: Array.isArray(localized(source, 'schedule', locale)) ? localized(source, 'schedule', locale) : [],
  };
}

export function normalizePromotion(promotion, locale = 'en') {
  const source = promotion?.attributes ? { ...promotion.attributes, id: promotion.id, documentId: promotion.documentId } : promotion;
  return {
    ...source,
    id: source?.id,
    documentId: source?.documentId,
    slug: source?.slug || String(source?.id || ''),
    title: localized(source, 'title', locale),
    description: localized(source, 'description', locale),
    termsAndConditions: localized(source, 'termsAndConditions', locale),
    image: absoluteMediaUrl(source?.mainImage, source?.legacyImagePath || '/assets/promotion/banner.jpg'),
    discountValue: Number(source?.discountValue || 0),
    minimumBookingAmount: Number(source?.minimumBookingAmount || 0),
    usedCount: Number(source?.usedCount || 0),
    usageLimit: source?.usageLimit == null ? null : Number(source.usageLimit),
  };
}
