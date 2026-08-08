import { requireApiAdmin } from '@/lib/auth';
import { apiErrorResponse, strapi } from '@/lib/strapi';
import { validateRoomInput } from '@/lib/validation';

export async function GET(_request, { params }) {
  try {
    const guard = await requireApiAdmin();
    if (guard.response) return guard.response;
    const { documentId } = await params;
    return Response.json(await strapi.get(`/api/rooms/${encodeURIComponent(documentId)}?populate=*`, { token: guard.auth.token }));
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function PUT(request, { params }) {
  try {
    const guard = await requireApiAdmin();
    if (guard.response) return guard.response;
    const { documentId } = await params;
    const { data, errors } = validateRoomInput(await request.json());
    if (errors.length) return Response.json({ error: errors.join(' '), errors }, { status: 400 });
    return Response.json(await strapi.put(`/api/rooms/${encodeURIComponent(documentId)}`, { data }, { token: guard.auth.token }));
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function DELETE(_request, { params }) {
  try {
    const guard = await requireApiAdmin();
    if (guard.response) return guard.response;
    const { documentId } = await params;
    await strapi.delete(`/api/rooms/${encodeURIComponent(documentId)}`, { token: guard.auth.token });
    return Response.json({ success: true });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

