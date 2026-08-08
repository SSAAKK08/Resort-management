import { requireApiUser } from '@/lib/auth';
import { apiErrorResponse, strapi } from '@/lib/strapi';

export async function GET() {
  try {
    const guard = await requireApiUser();
    if (guard.response) return guard.response;
    return Response.json(await strapi.get('/api/resort/my-orders', { token: guard.auth.token }));
  } catch (error) { return apiErrorResponse(error); }
}

export async function POST(request) {
  try {
    const guard = await requireApiUser();
    if (guard.response) return guard.response;
    const body = await request.json();
    const items = Array.isArray(body.items) ? body.items.map((item) => ({
      documentId: String(item.documentId || ''), quantity: Number(item.quantity),
    })) : [];
    return Response.json(await strapi.post('/api/resort/orders/checkout', { items }, { token: guard.auth.token }), { status: 201 });
  } catch (error) { return apiErrorResponse(error); }
}

