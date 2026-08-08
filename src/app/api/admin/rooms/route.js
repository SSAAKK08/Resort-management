import { requireApiAdmin } from '@/lib/auth';
import { apiErrorResponse, strapi } from '@/lib/strapi';
import { validateRoomInput } from '@/lib/validation';

export async function GET() {
  try {
    const guard = await requireApiAdmin();
    if (guard.response) return guard.response;
    return Response.json(await strapi.get('/api/rooms?populate=*&pagination[pageSize]=100', { token: guard.auth.token }));
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request) {
  try {
    const guard = await requireApiAdmin();
    if (guard.response) return guard.response;
    const { data, errors } = validateRoomInput(await request.json());
    if (errors.length) return Response.json({ error: errors.join(' '), errors }, { status: 400 });
    const payload = await strapi.post('/api/rooms', { data }, { token: guard.auth.token });
    return Response.json(payload, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

