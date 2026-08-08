import { requireApiUser } from '@/lib/auth';
import { apiErrorResponse, strapi } from '@/lib/strapi';

export async function GET(_request, { params }) {
  try {
    const guard = await requireApiUser();
    if (guard.response) return guard.response;
    const { receiptNumber } = await params;
    return Response.json(await strapi.get(`/api/resort/my-receipts/${encodeURIComponent(receiptNumber)}`, { token: guard.auth.token }));
  } catch (error) { return apiErrorResponse(error); }
}

