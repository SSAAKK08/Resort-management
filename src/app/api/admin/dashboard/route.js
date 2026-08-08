import { requireApiAdmin } from '@/lib/auth';
import { apiErrorResponse, strapi } from '@/lib/strapi';

function records(payload) {
  return Array.isArray(payload) ? payload : payload?.data || [];
}

function dayKey(value, timeZone) {
  if (!value) return null;
  return new Intl.DateTimeFormat('en-CA', {
    timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date(value));
}

function newest(items, dateField, count = 5) {
  return [...items]
    .sort((a, b) => new Date(b[dateField] || b.createdAt) - new Date(a[dateField] || a.createdAt))
    .slice(0, count);
}

export async function GET() {
  try {
    const guard = await requireApiAdmin();
    if (guard.response) return guard.response;
    const token = guard.auth.token;
    const [paymentsPayload, roomsPayload, bookingsPayload, ordersPayload, usersPayload] = await Promise.all([
      strapi.get('/api/payments?populate=*&pagination[pageSize]=1000', { token }),
      strapi.get('/api/rooms?pagination[pageSize]=1000', { token }),
      strapi.get('/api/bookings?populate=*&pagination[pageSize]=1000', { token }),
      strapi.get('/api/food-orders?populate=*&pagination[pageSize]=1000', { token }),
      strapi.get('/api/users?pagination[pageSize]=1000', { token }),
    ]);
    const payments = records(paymentsPayload);
    const rooms = records(roomsPayload);
    const bookings = records(bookingsPayload);
    const orders = records(ordersPayload);
    const users = records(usersPayload);
    const timeZone = process.env.RESORT_TIMEZONE || 'Asia/Bangkok';
    const today = dayKey(new Date(), timeZone);
    const completed = payments.filter((payment) => payment.status === 'completed');
    const completedToday = completed.filter((payment) => dayKey(payment.paidAt, timeZone) === today);
    const sum = (items) => Number(items.reduce((total, payment) => total + Number(payment.amount || 0), 0).toFixed(2));
    const roomPayments = completed.filter((payment) => payment.paymentType === 'room-booking');
    const restaurantPayments = completed.filter((payment) => payment.paymentType === 'restaurant-order');

    return Response.json({
      generatedAt: new Date().toISOString(),
      timeZone,
      revenue: {
        total: sum(completed),
        roomBookings: sum(roomPayments),
        restaurant: sum(restaurantPayments),
        today: sum(completedToday),
        roomBookingsToday: sum(completedToday.filter((payment) => payment.paymentType === 'room-booking')),
        restaurantToday: sum(completedToday.filter((payment) => payment.paymentType === 'restaurant-order')),
      },
      rooms: {
        total: rooms.length,
        available: rooms.filter((room) => room.status === 'available' && room.available).length,
        occupied: rooms.filter((room) => room.status === 'occupied').length,
      },
      bookings: {
        total: bookings.length,
        today: bookings.filter((booking) => dayKey(booking.createdAt, timeZone) === today).length,
        pending: bookings.filter((booking) => booking.bookingStatus === 'pending').length,
        confirmed: bookings.filter((booking) => booking.bookingStatus === 'confirmed').length,
      },
      orders: {
        total: orders.length,
        today: orders.filter((order) => dayKey(order.orderDate || order.createdAt, timeZone) === today).length,
      },
      users: { total: users.length },
      recent: {
        bookings: newest(bookings, 'createdAt'),
        orders: newest(orders, 'orderDate'),
        payments: newest(payments, 'paidAt'),
      },
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

