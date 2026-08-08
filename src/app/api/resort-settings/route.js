import { apiErrorResponse, strapi } from '@/lib/strapi';

export async function GET() {
  try {
    return Response.json(await strapi.get('/api/resort-setting?populate=*', { token: null }));
  } catch (error) {
    return apiErrorResponse(error);
  }
}

