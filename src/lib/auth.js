import 'server-only';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth as clerkAuth, currentUser as currentClerkUser } from '@clerk/nextjs/server';
import { exchangeClerkIdentity } from '@/lib/clerk-strapi-sync';
import { hasClerkSecretKey } from '@/lib/clerk-config';
import { StrapiError, strapi } from '@/lib/strapi';

export const SESSION_COOKIE = 'resort_session';
export const REFRESH_COOKIE = 'resort_refresh';

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
};

export const refreshCookieOptions = {
  ...sessionCookieOptions,
  sameSite: 'strict',
  maxAge: 60 * 60 * 24 * 30,
};

export function normalizeUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    documentId: user.documentId,
    username: user.username,
    email: user.email,
    confirmed: user.confirmed,
    blocked: user.blocked,
    role: user.role
      ? { id: user.role.id, name: user.role.name, type: user.role.type }
      : null,
  };
}

export function userIsAdmin(user) {
  return user?.role?.type === 'admin' || user?.role?.name === 'Admin';
}

export async function getSessionToken() {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value || null;
}

async function getLegacyCurrentUser() {
  const token = await getSessionToken();
  if (!token) return null;

  try {
    const payload = await strapi.get('/api/application/me', { token });
    return normalizeUser(payload.user);
  } catch (error) {
    if (error instanceof StrapiError && (error.status === 401 || error.status === 403)) {
      return null;
    }
    throw error;
  }
}

async function getClerkAuthContext() {
  if (!hasClerkSecretKey()) return null;
  const { userId } = await clerkAuth();
  if (!userId) return null;
  const clerkUser = await currentClerkUser();
  if (!clerkUser) throw new StrapiError('Clerk account details could not be loaded.', 503);
  const primaryEmail = clerkUser.emailAddresses?.find((entry) => entry.id === clerkUser.primaryEmailAddressId)?.emailAddress
    || clerkUser.emailAddresses?.[0]?.emailAddress
    || '';
  const payload = await exchangeClerkIdentity({
    action: 'session',
    clerkUserId: userId,
    email: primaryEmail,
    fullName: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || clerkUser.username || '',
  });
  return { token: payload.jwt, user: normalizeUser(payload.user), profile: payload.profile || null, clerkUser };
}

async function getClerkUserId() {
  if (!hasClerkSecretKey()) return null;
  const { userId } = await clerkAuth();
  return userId || null;
}

export async function getCurrentUser() {
  const clerk = await getClerkAuthContext();
  return clerk?.user || getLegacyCurrentUser();
}

export async function getAuthContext() {
  const clerk = await getClerkAuthContext();
  if (clerk) return clerk;
  const token = await getSessionToken();
  if (!token) return null;
  const user = await getLegacyCurrentUser();
  return user ? { token, user } : null;
}

export async function requireUserPage(nextPath = '/profile') {
  const clerkUserId = await getClerkUserId();
  if (clerkUserId) return { id: clerkUserId, provider: 'clerk' };
  const user = await getLegacyCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  return user;
}

export async function requireAdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login?next=%2Fadmin');
  if (!userIsAdmin(user)) redirect('/?error=forbidden');
  return user;
}

export function unauthorizedResponse() {
  return Response.json({ error: 'Authentication is required.' }, { status: 401 });
}

export function forbiddenResponse() {
  return Response.json({ error: 'Administrator access is required.' }, { status: 403 });
}

export async function requireApiUser() {
  const auth = await getAuthContext();
  return auth ? { auth, response: null } : { auth: null, response: unauthorizedResponse() };
}

export async function requireApiAdmin() {
  const auth = await getAuthContext();
  if (!auth) return { auth: null, response: unauthorizedResponse() };
  if (!userIsAdmin(auth.user)) return { auth: null, response: forbiddenResponse() };
  return { auth, response: null };
}
