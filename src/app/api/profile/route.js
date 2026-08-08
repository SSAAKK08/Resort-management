import { requireApiUser } from '@/lib/auth';
import { apiErrorResponse, strapi } from '@/lib/strapi';

function clean(value, max) {
  return String(value ?? '').trim().slice(0, max);
}

export async function GET() {
  try {
    const guard = await requireApiUser();
    if (guard.response) return guard.response;
    const payload = await strapi.get('/api/user-profile/me', { token: guard.auth.token });
    const profile = payload?.data || guard.auth.profile || null;
    if (!profile) {
      return Response.json(
        { error: 'Your resort profile could not be created. Please try again.', code: 'PROFILE_MISSING' },
        { status: 503 }
      );
    }
    return Response.json({ user: guard.auth.user, profile });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function PUT(request) {
  try {
    const guard = await requireApiUser();
    if (guard.response) return guard.response;
    const body = await request.json();
    const dateOfBirth = clean(body.dateOfBirth, 10);
    if (dateOfBirth && !/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)) return Response.json({ error: 'Date of birth is invalid.' }, { status: 400 });
    const data = {
      phone: clean(body.phone, 50),
      address: clean(body.address, 500),
      dateOfBirth: dateOfBirth || null,
      bio: clean(body.bio, 5000),
    };
    const payload = await strapi.put('/api/user-profile/me', { data }, { token: guard.auth.token });
    return Response.json({ data: payload.data });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
