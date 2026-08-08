import { apiErrorResponse, strapi } from '@/lib/strapi';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const params = new URLSearchParams({ populate: '*', 'pagination[pageSize]': '100' });
    const category = url.searchParams.get('category');
    const available = url.searchParams.get('available');
    const search = url.searchParams.get('search');
    if (category) params.set('filters[category][slug][$eq]', category);
    if (available === 'true' || available === 'false') params.set('filters[available][$eq]', available);
    if (search) params.set('filters[$or][0][name][$containsi]', search);
    return Response.json(await strapi.get(`/api/foods?${params}`, { token: null }));
  } catch (error) {
    return apiErrorResponse(error);
  }
}

