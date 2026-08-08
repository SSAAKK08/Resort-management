import ActivityDetail from '@/components/activite/ActivityDetail';

export default async function ActivityDetailPage({ params }) {
  const { slug } = await params;
  return <ActivityDetail slug={slug} />;
}
