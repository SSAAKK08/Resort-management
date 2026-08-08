import { requireApiAdmin } from '@/lib/auth';
import { apiErrorResponse, strapi } from '@/lib/strapi';

const TYPES = {
  bookings: { endpoint: 'bookings', statusField: 'bookingStatus', statuses: ['pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled'] },
  orders: { endpoint: 'food-orders', statusField: 'orderStatus', statuses: ['pending', 'preparing', 'ready', 'completed', 'cancelled'] },
  payments: { endpoint: 'payments' },
  receipts: { endpoint: 'receipts' },
  users: { endpoint: 'users', users: true },
  messages: { endpoint: 'contact-messages', statusField: 'status', statuses: ['new', 'read', 'replied'] },
};

export async function GET(_request, { params }) {
  try {
    const guard = await requireApiAdmin();
    if (guard.response) return guard.response;
    const { type } = await params;
    const config = TYPES[type];
    if (!config) return Response.json({ error: 'Unknown admin record type.' }, { status: 404 });
    const query = config.users ? 'pagination[pageSize]=1000' : 'populate=*&pagination[pageSize]=1000&sort[0]=createdAt:desc';
    return Response.json(await strapi.get(`/api/${config.endpoint}?${query}`, { token: guard.auth.token }));
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function PATCH(request, { params }) {
  try {
    const guard = await requireApiAdmin();
    if (guard.response) return guard.response;
    const { type } = await params;
    const config = TYPES[type];
    if (!config?.statusField) return Response.json({ error: 'This record type is read-only.' }, { status: 405 });
    const body = await request.json();
    const documentId = String(body.documentId || '');
    const status = String(body.status || '');
    if (!documentId || !config.statuses.includes(status)) {
      return Response.json({ error: 'A valid documentId and status are required.' }, { status: 400 });
    }
    return Response.json(await strapi.put(`/api/${config.endpoint}/${encodeURIComponent(documentId)}`, {
      data: { [config.statusField]: status },
    }, { token: guard.auth.token }));
  } catch (error) {
    return apiErrorResponse(error);
  }
}

