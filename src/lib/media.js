export function mediaUrl(media, fallback = '/assets/profile.png') {
  const url = media?.url || media?.data?.attributes?.url || media?.attributes?.url;
  if (!url) return fallback;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const base = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  return `${base.replace(/\/$/, '')}${url}`;
}
