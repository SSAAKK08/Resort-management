import { apiErrorResponse, strapi } from '@/lib/strapi';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  try {
    const body = await request.json();
    const fullName = String(body.fullName || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const phone = String(body.phone || '').trim();
    const subject = String(body.subject || '').trim();
    const message = String(body.message || '').trim();
    if (!fullName || !EMAIL_PATTERN.test(email) || !message) {
      return Response.json({ error: 'Full name, a valid email, and message are required.' }, { status: 400 });
    }
    const payload = await strapi.post('/api/contact-messages', {
      data: { fullName, email, phone, subject, message, status: 'new' },
    }, { token: null });
    return Response.json(payload, { status: 201 });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

