import { requireApiUser } from '@/lib/auth';
import { apiErrorResponse, strapi } from '@/lib/strapi';

export async function GET() {
  try {
    const guard = await requireApiUser();
    if (guard.response) return guard.response;
    return Response.json(await strapi.get('/api/resort/my-receipts', { token: guard.auth.token }));
  } catch (error) { return apiErrorResponse(error); }
}

