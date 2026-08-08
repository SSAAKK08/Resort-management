import { requireApiUser } from '@/lib/auth';
import { apiErrorResponse, strapi } from '@/lib/strapi';

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const MAX_SIZE = 3 * 1024 * 1024;

export async function POST(request) {
  try {
    const guard = await requireApiUser();
    if (guard.response) return guard.response;
    const incoming = await request.formData();
    const file = incoming.get('avatar');
    if (!file || typeof file === 'string') return Response.json({ error: 'Choose an avatar image.' }, { status: 400 });
    if (!ALLOWED.has(file.type)) return Response.json({ error: 'Avatar must be JPEG, PNG, WebP, or GIF.' }, { status: 400 });
    if (file.size > MAX_SIZE) return Response.json({ error: 'Avatar must be 3 MB or smaller.' }, { status: 400 });

    const outgoing = new FormData();
    outgoing.append('files', file, file.name);
    const uploads = await strapi.post('/api/upload', outgoing, { token: guard.auth.token });
    const uploaded = uploads?.[0];
    if (!uploaded?.id) return Response.json({ error: 'Avatar upload failed.' }, { status: 500 });
    const payload = await strapi.put('/api/user-profile/me/avatar', { fileId: uploaded.id }, { token: guard.auth.token });
    const base = (process.env.STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '');
    return Response.json({
      data: payload.data,
      avatarUrl: payload.data?.avatar?.url ? `${base}${payload.data.avatar.url}` : null,
    }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

