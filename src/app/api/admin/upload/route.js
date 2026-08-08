import { requireApiAdmin } from '@/lib/auth';
import { apiErrorResponse, strapi } from '@/lib/strapi';

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']);
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export async function POST(request) {
  try {
    const guard = await requireApiAdmin();
    if (guard.response) return guard.response;
    const incoming = await request.formData();
    const files = incoming.getAll('files');
    if (!files.length) return Response.json({ error: 'At least one image is required.' }, { status: 400 });
    for (const file of files) {
      if (!ALLOWED_TYPES.has(file.type)) {
        return Response.json({ error: `${file.name} is not a supported image type.` }, { status: 400 });
      }
      if (file.size > MAX_IMAGE_SIZE) {
        return Response.json({ error: `${file.name} exceeds the 5 MB image limit.` }, { status: 400 });
      }
    }
    const outgoing = new FormData();
    for (const file of files) outgoing.append('files', file, file.name);
    const payload = await strapi.post('/api/upload', outgoing, { token: guard.auth.token });
    return Response.json({ data: payload }, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

