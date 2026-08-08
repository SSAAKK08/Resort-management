import PromotionDetail from '@/components/promotion/PromotionDetail';

export default async function PromotionDetailPage({ params }) {
  const { slug } = await params;
  return <PromotionDetail slug={slug} />;
}
