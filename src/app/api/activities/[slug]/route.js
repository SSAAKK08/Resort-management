import { apiErrorResponse, strapi } from '@/lib/strapi';

export async function GET(_request, { params }) {
  try {
    const { slug } = await params;
    const query = new URLSearchParams({ populate: '*', 'filters[slug][$eq]': slug });
    const payload = await strapi.get(`/api/activities?${query}`, { token: null });
    const activity = payload?.data?.[0];
    if (!activity) return Response.json({ error: 'Activity not found.' }, { status: 404 });
    return Response.json({ data: activity });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
