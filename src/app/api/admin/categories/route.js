import { requireApiAdmin } from '@/lib/auth';
import { apiErrorResponse, strapi } from '@/lib/strapi';

export async function GET(request) {
  try {
    const guard = await requireApiAdmin();
    if (guard.response) return guard.response;
    const type = new URL(request.url).searchParams.get('type');
    if (!['room', 'food'].includes(type)) {
      return Response.json({ error: 'Category type must be room or food.' }, { status: 400 });
    }
    const endpoint = type === 'room' ? 'room-categories' : 'food-categories';
    return Response.json(await strapi.get(`/api/${endpoint}?pagination[pageSize]=100`, { token: guard.auth.token }));
  } catch (error) {
    return apiErrorResponse(error);
  }
}

