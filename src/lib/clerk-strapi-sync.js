import 'server-only';

import { StrapiError, getStrapiUrl } from '@/lib/strapi';

function configuredSecret() {
  const secret = process.env.CLERK_STRAPI_SYNC_SECRET;
  return secret && !secret.includes('replace') ? secret : null;
}

export async function exchangeClerkIdentity({ action = 'session', clerkUserId, email, fullName }) {
  const secret = configuredSecret();
  if (!secret) throw new StrapiError('Clerk to Strapi synchronization is not configured.', 503);

  const response = await fetch(getStrapiUrl('/api/clerk-sync'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-clerk-strapi-secret': secret },
    body: JSON.stringify({ action, clerkUserId, email, fullName }),
    cache: 'no-store',
  });
  const text = await response.text();
  let payload;
  try { payload = text ? JSON.parse(text) : null; } catch { payload = null; }
  if (!response.ok) throw new StrapiError(payload?.error?.message || payload?.error || 'Unable to synchronize the Clerk user with Strapi.', response.status, payload);
  if (action !== 'delete' && (typeof payload?.jwt !== 'string' || !payload.jwt)) {
    throw new StrapiError('Strapi did not return a valid user access token. Restart Strapi and retry the account connection.', 502);
  }
  return payload;
}
