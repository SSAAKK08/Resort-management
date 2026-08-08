import { apiErrorResponse, strapi } from '@/lib/strapi';

export async function GET(_request, { params }) {
  try {
    const { slug } = await params;
    const query = new URLSearchParams({ populate: '*', 'filters[slug][$eq]': slug });
    const payload = await strapi.get(`/api/promotions?${query}`, { token: null });
    const promotion = payload?.data?.[0];
    if (!promotion) return Response.json({ error: 'Promotion not found.' }, { status: 404 });
    return Response.json({ data: promotion });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
