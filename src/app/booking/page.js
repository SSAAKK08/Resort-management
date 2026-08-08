import Booking from '@/components/booking/Booking';

export default async function BookingPage({ searchParams }) {
  const query = await searchParams;
  return <Booking initialRoomSlug={String(query?.room || '')} initialPromotionCode={String(query?.promo || '')} />;
}
