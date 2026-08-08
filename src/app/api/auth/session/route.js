import { getAuthContext } from '@/lib/auth';
import { apiErrorResponse, strapi } from '@/lib/strapi';

export async function GET() {
  try {
    const auth = await getAuthContext();
    if (!auth) return Response.json({ user: null, profile: null });

    const payload = await strapi.get('/api/user-profile/me', { token: auth.token });
    const profile = payload?.data || null;
    const avatarPath = profile?.avatar?.url;
    const strapiUrl = (process.env.STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '');

    return Response.json({
      user: auth.user,
      profile: profile
        ? {
            documentId: profile.documentId,
            fullName: profile.fullName,
            avatarUrl: avatarPath ? `${strapiUrl}${avatarPath}` : auth.clerkUser?.imageUrl || null,
          }
        : null,
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
