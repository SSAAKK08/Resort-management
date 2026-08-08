import { requireApiUser } from '@/lib/auth';
import { apiErrorResponse, strapi } from '@/lib/strapi';

export async function GET() {
  try {
    const guard = await requireApiUser();
    if (guard.response) return guard.response;
    return Response.json(await strapi.get('/api/resort/my-bookings', { token: guard.auth.token }));
  } catch (error) { return apiErrorResponse(error); }
}

export async function POST(request) {
  try {
    const guard = await requireApiUser();
    if (guard.response) return guard.response;
    const body = await request.json();
    const payload = {
      roomDocumentId: String(body.roomDocumentId || ''),
      checkIn: String(body.checkIn || ''),
      checkOut: String(body.checkOut || ''),
      numberOfGuests: Number(body.numberOfGuests),
      specialRequest: String(body.specialRequest || '').trim().slice(0, 5000),
      customerInfo: {
        fullName: String(body.customerInfo?.fullName || '').trim().slice(0, 150),
        phone: String(body.customerInfo?.phone || '').trim().slice(0, 50),
        address: String(body.customerInfo?.address || '').trim().slice(0, 500),
      },
      promotionCode: String(body.promotionCode || '').trim().slice(0, 80),
      foodItems: Array.isArray(body.foodItems)
        ? body.foodItems.map((item) => ({ documentId: String(item.documentId || ''), quantity: Number(item.quantity) }))
        : [],
    };
    return Response.json(await strapi.post('/api/resort/bookings/checkout', payload, { token: guard.auth.token }), { status: 201 });
  } catch (error) { return apiErrorResponse(error); }
}
