import { NextResponse } from 'next/server';
import { REFRESH_COOKIE, SESSION_COOKIE, normalizeUser, refreshCookieOptions, sessionCookieOptions } from '@/lib/auth';
import { apiErrorResponse, strapi } from '@/lib/strapi';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  try {
    const body = await request.json();
    const fullName = String(body.fullName || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const phone = String(body.phone || '').trim();
    const password = String(body.password || '');

    if (!fullName || !EMAIL_PATTERN.test(email) || password.length < 8) {
      return NextResponse.json(
        { error: 'Full name, a valid email, and a password of at least 8 characters are required.' },
        { status: 400 }
      );
    }

    const usernameBase = email.split('@')[0].replace(/[^a-z0-9._-]/gi, '').slice(0, 30) || 'guest';
    const username = `${usernameBase}-${crypto.randomUUID().slice(0, 8)}`;
    const payload = await strapi.post(
      '/api/auth/local/register',
      { username, email, password },
      { token: null }
    );

    await strapi.put(
      '/api/user-profile/me',
      { data: { fullName, phone } },
      { token: payload.jwt }
    );

    const sessionPayload = await strapi.get('/api/application/me', { token: payload.jwt });
    const resolvedUser = sessionPayload.user;
    const response = NextResponse.json({ user: normalizeUser(resolvedUser) }, { status: 201 });
    response.cookies.set(SESSION_COOKIE, payload.jwt, sessionCookieOptions);
    if (payload.refreshToken) {
      response.cookies.set(REFRESH_COOKIE, payload.refreshToken, refreshCookieOptions);
    }
    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}
