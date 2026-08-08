import { requireApiAdmin } from '@/lib/auth';
import { apiErrorResponse, strapi } from '@/lib/strapi';
import { validateFoodInput } from '@/lib/validation';

export async function GET(_request, { params }) {
  try {
    const guard = await requireApiAdmin();
    if (guard.response) return guard.response;
    const { documentId } = await params;
    return Response.json(await strapi.get(`/api/foods/${encodeURIComponent(documentId)}?populate=*`, { token: guard.auth.token }));
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function PUT(request, { params }) {
  try {
    const guard = await requireApiAdmin();
    if (guard.response) return guard.response;
    const { documentId } = await params;
    const { data, errors } = validateFoodInput(await request.json());
    if (errors.length) return Response.json({ error: errors.join(' '), errors }, { status: 400 });
    return Response.json(await strapi.put(`/api/foods/${encodeURIComponent(documentId)}`, { data }, { token: guard.auth.token }));
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function DELETE(_request, { params }) {
  try {
    const guard = await requireApiAdmin();
    if (guard.response) return guard.response;
    const { documentId } = await params;
    await strapi.delete(`/api/foods/${encodeURIComponent(documentId)}`, { token: guard.auth.token });
    return Response.json({ success: true });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

