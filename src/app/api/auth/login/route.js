import { NextResponse } from 'next/server';
import { REFRESH_COOKIE, SESSION_COOKIE, normalizeUser, refreshCookieOptions, sessionCookieOptions } from '@/lib/auth';
import { apiErrorResponse, strapi } from '@/lib/strapi';

export async function POST(request) {
  try {
    const body = await request.json();
    const identifier = String(body.identifier || body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    if (!identifier || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const payload = await strapi.post('/api/auth/local', { identifier, password }, { token: null });
    const sessionPayload = await strapi.get('/api/application/me', { token: payload.jwt });
    const resolvedUser = sessionPayload.user;
    await strapi.get('/api/user-profile/me', { token: payload.jwt });
    const response = NextResponse.json({ user: normalizeUser(resolvedUser) });
    response.cookies.set(SESSION_COOKIE, payload.jwt, sessionCookieOptions);
    if (payload.refreshToken) {
      response.cookies.set(REFRESH_COOKIE, payload.refreshToken, refreshCookieOptions);
    }
    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}
