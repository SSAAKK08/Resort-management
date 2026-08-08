import 'server-only';

const DEFAULT_STRAPI_URL = 'http://localhost:1337';

export class StrapiError extends Error {
  constructor(message, status = 500, details = null) {
    super(message);
    this.name = 'StrapiError';
    this.status = status;
    this.details = details;
  }
}

export function getStrapiUrl(path = '') {
  const base = (process.env.STRAPI_URL || DEFAULT_STRAPI_URL).replace(/\/$/, '');
  if (!path) return base;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

function configuredApiToken() {
  const token = process.env.STRAPI_API_TOKEN;
  if (!token || token.startsWith('replace-with-')) return null;
  return token;
}

function parseResponseBody(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function strapiRequest(path, options = {}) {
  const {
    method = 'GET',
    body,
    token = configuredApiToken(),
    headers = {},
    cache = 'no-store',
    next,
  } = options;
  const isFormData = body instanceof FormData;
  const requestHeaders = { Accept: 'application/json', ...headers };

  if (token) requestHeaders.Authorization = `Bearer ${token}`;
  if (body !== undefined && !isFormData) requestHeaders['Content-Type'] = 'application/json';

  let response;
  try {
    response = await fetch(getStrapiUrl(path), {
      method,
      headers: requestHeaders,
      body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
      cache,
      next,
    });
  } catch (error) {
    throw new StrapiError(
      'The resort service is unavailable. Confirm that Strapi is running on port 1337.',
      503,
      error.message
    );
  }

  const payload = parseResponseBody(await response.text());
  if (!response.ok) {
    const message =
      payload?.error?.message || payload?.message || `Strapi request failed with ${response.status}`;
    throw new StrapiError(message, response.status, payload?.error?.details || payload);
  }

  return payload;
}

export const strapi = {
  get: (path, options) => strapiRequest(path, { ...options, method: 'GET' }),
  post: (path, body, options) => strapiRequest(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => strapiRequest(path, { ...options, method: 'PUT', body }),
  delete: (path, options) => strapiRequest(path, { ...options, method: 'DELETE' }),
};

export function apiErrorResponse(error) {
  const status = error instanceof StrapiError ? error.status : 500;
  const message = error instanceof StrapiError
    ? error.message
    : 'An unexpected server error occurred.';
  return Response.json({ error: message }, { status });
}
