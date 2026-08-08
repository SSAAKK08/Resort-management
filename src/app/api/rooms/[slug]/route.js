import { apiErrorResponse, strapi } from '@/lib/strapi';

export async function GET(_request, { params }) {
  try {
    const { slug } = await params;
    const query = new URLSearchParams({ populate: '*', 'filters[slug][$eq]': slug });
    const payload = await strapi.get(`/api/rooms?${query}`, { token: null });
    const room = payload?.data?.[0];
    if (!room) return Response.json({ error: 'Room not found.' }, { status: 404 });
    return Response.json({ data: room });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

