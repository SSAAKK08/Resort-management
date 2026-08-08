import { requireApiUser } from '@/lib/auth';
import { apiErrorResponse, strapi } from '@/lib/strapi';

export async function POST(request) {
  try {
    const guard = await requireApiUser();
    if (guard.response) return guard.response;
    const body = await request.json();
    const payload = {
      code: String(body.code || '').trim().slice(0, 80),
      roomDocumentId: String(body.roomDocumentId || ''),
      checkIn: String(body.checkIn || ''),
      checkOut: String(body.checkOut || ''),
    };
    return Response.json(await strapi.post('/api/resort/promotions/validate', payload, { token: guard.auth.token }));
  } catch (error) {
    return apiErrorResponse(error);
  }
}
