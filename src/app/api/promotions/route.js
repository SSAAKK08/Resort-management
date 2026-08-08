import { apiErrorResponse, strapi } from '@/lib/strapi';

export async function GET() {
  try {
    const params = new URLSearchParams({ populate: '*', 'pagination[pageSize]': '100', 'sort[0]': 'startDate:desc' });
    return Response.json(await strapi.get(`/api/promotions?${params}`, { token: null }));
  } catch (error) {
    return apiErrorResponse(error);
  }
}
