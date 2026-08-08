import { apiErrorResponse, strapi } from '@/lib/strapi';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const params = new URLSearchParams({ populate: '*', 'pagination[pageSize]': '100' });
    const category = url.searchParams.get('category');
    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search');
    if (category) params.set('filters[category][slug][$eq]', category);
    if (status) params.set('filters[status][$eq]', status);
    if (search) params.set('filters[$or][0][title][$containsi]', search);
    return Response.json(await strapi.get(`/api/rooms?${params}`, { token: null }));
  } catch (error) {
    return apiErrorResponse(error);
  }
}

