import { apiErrorResponse, strapi } from '@/lib/strapi';

export async function GET(_request, { params }) {
  try {
    const { slug } = await params;
    const query = new URLSearchParams({ populate: '*', 'filters[slug][$eq]': slug });
    const payload = await strapi.get(`/api/foods?${query}`, { token: null });
    const food = payload?.data?.[0];
    if (!food) return Response.json({ error: 'Food not found.' }, { status: 404 });
    return Response.json({ data: food });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

