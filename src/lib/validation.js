const ROOM_STATUSES = new Set(['available', 'occupied', 'maintenance', 'unavailable']);

function text(value, max = 5000) {
  return String(value ?? '').trim().slice(0, max);
}

function slug(value) {
  return text(value, 150).toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/(^-|-$)/g, '');
}

function positiveNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function positiveInteger(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function relation(value) {
  const normalized = text(value, 100);
  return normalized || null;
}

function mediaId(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export function validateRoomInput(input) {
  const title = text(input.title, 200);
  const price = positiveNumber(input.price);
  const maximumGuests = positiveInteger(input.maximumGuests);
  const roomSlug = slug(input.slug || title);
  const roomNumber = text(input.roomNumber, 80);
  const status = text(input.status, 30) || 'available';
  const errors = [];
  if (!title) errors.push('Room title is required.');
  if (!roomSlug) errors.push('A valid slug is required.');
  if (!roomNumber) errors.push('Room number is required.');
  if (price === null) errors.push('Room price must be positive.');
  if (maximumGuests === null) errors.push('Maximum guests must be a positive integer.');
  if (!ROOM_STATUSES.has(status)) errors.push('Room status is invalid.');

  const data = {
    title,
    titleKm: text(input.titleKm, 200),
    slug: roomSlug,
    roomNumber,
    description: text(input.description, 20000),
    descriptionKm: text(input.descriptionKm, 20000),
    category: relation(input.category),
    price,
    size: text(input.size, 100),
    sizeKm: text(input.sizeKm, 100),
    bed: text(input.bed, 100),
    bedKm: text(input.bedKm, 100),
    maximumGuests,
    view: text(input.view, 150),
    viewKm: text(input.viewKm, 150),
    status,
    available: Boolean(input.available) && status === 'available',
    amenities: Array.isArray(input.amenities)
      ? input.amenities.map((item) => text(item, 200)).filter(Boolean).slice(0, 50)
      : [],
    amenitiesKm: Array.isArray(input.amenitiesKm)
      ? input.amenitiesKm.map((item) => text(item, 200)).filter(Boolean).slice(0, 50)
      : [],
  };
  const mainImage = mediaId(input.mainImage);
  const gallery = Array.isArray(input.gallery) ? input.gallery.map(mediaId).filter(Boolean) : [];
  if (mainImage) data.mainImage = mainImage;
  if (gallery.length) data.gallery = gallery;

  return { data, errors };
}

export function validateFoodInput(input) {
  const name = text(input.name, 200);
  const price = positiveNumber(input.price);
  const foodSlug = slug(input.slug || name);
  const preparationTime = positiveInteger(input.preparationTime);
  const errors = [];
  if (!name) errors.push('Food name is required.');
  if (!foodSlug) errors.push('A valid slug is required.');
  if (price === null) errors.push('Food price must be positive.');
  if (preparationTime === null) errors.push('Preparation time must be a positive integer.');

  const data = {
    name,
    nameKm: text(input.nameKm, 200),
    slug: foodSlug,
    description: text(input.description, 20000),
    descriptionKm: text(input.descriptionKm, 20000),
    category: relation(input.category),
    price,
    available: Boolean(input.available),
    preparationTime,
    ingredients: Array.isArray(input.ingredients)
      ? input.ingredients.map((item) => text(item, 200)).filter(Boolean).slice(0, 100)
      : [],
    ingredientsKm: Array.isArray(input.ingredientsKm)
      ? input.ingredientsKm.map((item) => text(item, 200)).filter(Boolean).slice(0, 100)
      : [],
  };
  const mainImage = mediaId(input.mainImage);
  const gallery = Array.isArray(input.gallery) ? input.gallery.map(mediaId).filter(Boolean) : [];
  if (mainImage) data.mainImage = mainImage;
  if (gallery.length) data.gallery = gallery;

  return { data, errors };
}
