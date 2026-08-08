import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { exchangeClerkIdentity } from '@/lib/clerk-strapi-sync';

function identityFromEvent(data) {
  const primary = data.email_addresses?.find((entry) => entry.id === data.primary_email_address_id) || data.email_addresses?.[0];
  return {
    clerkUserId: data.id,
    email: primary?.email_address || '',
    fullName: [data.first_name, data.last_name].filter(Boolean).join(' ') || data.username || '',
  };
}

export async function POST(request) {
  try {
    const event = await verifyWebhook(request);
    if (event.type === 'user.created' || event.type === 'user.updated') {
      await exchangeClerkIdentity({ action: 'upsert', ...identityFromEvent(event.data) });
    } else if (event.type === 'user.deleted' && event.data.id) {
      await exchangeClerkIdentity({ action: 'delete', clerkUserId: event.data.id });
    }
    return Response.json({ received: true });
  } catch (error) {
    return Response.json({ error: error.message || 'Webhook verification failed.' }, { status: 400 });
  }
}
