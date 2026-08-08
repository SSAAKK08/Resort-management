const PERIODS = new Set(["today", "last7", "last30", "month", "year", "custom"]);

const DAY_MS = 24 * 60 * 60 * 1000;

function finiteNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function roundMoney(value) {
  return Number(finiteNumber(value).toFixed(2));
}

function dateParts(value, timeZone) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const part = (type) => parts.find((entry) => entry.type === type)?.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

function dayNumber(day) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day || "")) return null;
  const number = Date.parse(`${day}T00:00:00Z`);
  return Number.isNaN(number) ? null : number;
}

function dayFromNumber(value) {
  return new Date(value).toISOString().slice(0, 10);
}

function addDays(day, amount) {
  return dayFromNumber(dayNumber(day) + amount * DAY_MS);
}

function daysBetween(start, end) {
  return Math.floor((dayNumber(end) - dayNumber(start)) / DAY_MS) + 1;
}

function inRange(day, start, end) {
  return Boolean(day && day >= start && day <= end);
}

function uniqueBy(items, keyForItem) {
  const seen = new Set();
  return items.filter((item, index) => {
    const key = keyForItem(item) || `row-${index}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function sum(items, selector = (item) => item) {
  return roundMoney(items.reduce((total, item) => total + finiteNumber(selector(item)), 0));
}

export function percentageChange(current, previous) {
  const currentValue = finiteNumber(current);
  const previousValue = finiteNumber(previous);
  if (previousValue === 0) return currentValue === 0 ? 0 : 100;
  return Number((((currentValue - previousValue) / previousValue) * 100).toFixed(1));
}

function metric(current, previous) {
  const change = percentageChange(current, previous);
  return {
    value: current,
    previous,
    change,
    direction: change > 0 ? "up" : change < 0 ? "down" : "neutral",
  };
}

export function resolveDashboardPeriod({ period = "last30", from, to, now = new Date(), timeZone }) {
  const key = PERIODS.has(period) ? period : "last30";
  const today = dateParts(now, timeZone);
  let start;
  let end = today;

  if (key === "today") start = today;
  if (key === "last7") start = addDays(today, -6);
  if (key === "last30") start = addDays(today, -29);
  if (key === "month") start = `${today.slice(0, 7)}-01`;
  if (key === "year") start = `${today.slice(0, 4)}-01-01`;
  if (key === "custom") {
    if (dayNumber(from) === null || dayNumber(to) === null || from > to) {
      throw new Error("A valid custom start and end date are required.");
    }
    start = from;
    end = to;
  }

  const length = daysBetween(start, end);
  const previousEnd = addDays(start, -1);
  const previousStart = addDays(previousEnd, -(length - 1));
  return { key, start, end, previousStart, previousEnd, today };
}

function dateSeries(period) {
  const result = [];
  for (let day = period.start; day <= period.end; day = addDays(day, 1)) {
    result.push(day);
  }
  return result;
}

function eventDate(item, fields, timeZone) {
  const value = fields.map((field) => item?.[field]).find(Boolean);
  return value ? dateParts(value, timeZone) : null;
}

function newest(items, fields, count = 5) {
  return [...items]
    .sort((a, b) => {
      const aValue = fields.map((field) => a?.[field]).find(Boolean);
      const bValue = fields.map((field) => b?.[field]).find(Boolean);
      return new Date(bValue || 0) - new Date(aValue || 0);
    })
    .slice(0, count);
}

function safeBooking(booking) {
  return {
    documentId: booking.documentId || null,
    bookingNumber: booking.bookingNumber || "—",
    bookingStatus: booking.bookingStatus || "pending",
    totalAmount: roundMoney(booking.totalAmount),
    checkIn: booking.checkIn || null,
    createdAt: booking.createdAt || null,
  };
}

function safeOrder(order) {
  return {
    documentId: order.documentId || null,
    orderNumber: order.orderNumber || "—",
    orderStatus: order.orderStatus || "pending",
    totalAmount: roundMoney(order.totalAmount),
    orderDate: order.orderDate || order.createdAt || null,
  };
}

export function buildDashboardData({
  payments = [],
  rooms = [],
  bookings = [],
  orders = [],
  users = [],
  period: requestedPeriod = "last30",
  from,
  to,
  timeZone = "Asia/Phnom_Penh",
  now = new Date(),
}) {
  const period = resolveDashboardPeriod({
    period: requestedPeriod,
    from,
    to,
    now,
    timeZone,
  });

  const completedPayments = uniqueBy(
    payments.filter((payment) => String(payment?.status).toLowerCase() === "completed"),
    (payment) => payment.documentId || payment.paymentNumber || payment.id,
  );
  const paymentDay = (payment) => eventDate(payment, ["paidAt", "createdAt"], timeZone);
  const bookingDay = (booking) => eventDate(booking, ["createdAt", "checkIn"], timeZone);
  const orderDay = (order) => eventDate(order, ["orderDate", "createdAt"], timeZone);
  const userDay = (user) => eventDate(user, ["createdAt"], timeZone);
  const currentPayments = completedPayments.filter((payment) =>
    inRange(paymentDay(payment), period.start, period.end),
  );
  const previousPayments = completedPayments.filter((payment) =>
    inRange(paymentDay(payment), period.previousStart, period.previousEnd),
  );
  const paymentType = (payment, type) => payment.paymentType === type;
  const currentBookings = bookings.filter((booking) =>
    inRange(bookingDay(booking), period.start, period.end),
  );
  const previousBookings = bookings.filter((booking) =>
    inRange(bookingDay(booking), period.previousStart, period.previousEnd),
  );
  const currentOrders = orders.filter((order) =>
    inRange(orderDay(order), period.start, period.end),
  );
  const previousOrders = orders.filter((order) =>
    inRange(orderDay(order), period.previousStart, period.previousEnd),
  );
  const currentCustomers = users.filter((user) => !userDay(user) || userDay(user) <= period.end).length;
  const previousCustomers = users.filter(
    (user) => !userDay(user) || userDay(user) <= period.previousEnd,
  ).length;
  const availableRooms = rooms.filter(
    (room) => room?.status === "available" && room?.available !== false,
  ).length;
  const occupiedRooms = rooms.filter((room) => room?.status === "occupied").length;
  const currentRoomPayments = currentPayments.filter((payment) =>
    paymentType(payment, "room-booking"),
  );
  const previousRoomPayments = previousPayments.filter((payment) =>
    paymentType(payment, "room-booking"),
  );
  const currentRestaurantPayments = currentPayments.filter((payment) =>
    paymentType(payment, "restaurant-order"),
  );
  const previousRestaurantPayments = previousPayments.filter((payment) =>
    paymentType(payment, "restaurant-order"),
  );
  const todayPayments = completedPayments.filter((payment) => paymentDay(payment) === period.today);
  const yesterdayPayments = completedPayments.filter(
    (payment) => paymentDay(payment) === addDays(period.today, -1),
  );

  const revenueByDay = new Map();
  currentPayments.forEach((payment) => {
    const day = paymentDay(payment);
    const row = revenueByDay.get(day) || { room: 0, restaurant: 0, other: 0 };
    const amount = finiteNumber(payment.amount);
    if (payment.paymentType === "room-booking") row.room += amount;
    else if (payment.paymentType === "restaurant-order") row.restaurant += amount;
    else row.other += amount;
    revenueByDay.set(day, row);
  });

  const bookingsByDay = new Map();
  currentBookings.forEach((booking) => {
    const day = bookingDay(booking);
    bookingsByDay.set(day, (bookingsByDay.get(day) || 0) + 1);
  });
  const ordersByDay = new Map();
  currentOrders.forEach((order) => {
    const day = orderDay(order);
    ordersByDay.set(day, (ordersByDay.get(day) || 0) + 1);
  });

  const roomRevenue = sum(currentRoomPayments, (payment) => payment.amount);
  const restaurantRevenue = sum(currentRestaurantPayments, (payment) => payment.amount);
  const otherRevenue = roundMoney(sum(currentPayments, (payment) => payment.amount) - roomRevenue - restaurantRevenue);
  const currency =
    currentPayments.find((payment) => payment.currency)?.currency ||
    completedPayments.find((payment) => payment.currency)?.currency ||
    "USD";

  return {
    generatedAt: now.toISOString(),
    timeZone,
    currency,
    period,
    metrics: {
      totalRevenue: metric(
        sum(currentPayments, (payment) => payment.amount),
        sum(previousPayments, (payment) => payment.amount),
      ),
      roomRevenue: metric(
        roomRevenue,
        sum(previousRoomPayments, (payment) => payment.amount),
      ),
      restaurantRevenue: metric(
        restaurantRevenue,
        sum(previousRestaurantPayments, (payment) => payment.amount),
      ),
      todayRevenue: metric(
        sum(todayPayments, (payment) => payment.amount),
        sum(yesterdayPayments, (payment) => payment.amount),
      ),
      bookings: metric(currentBookings.length, previousBookings.length),
      orders: metric(currentOrders.length, previousOrders.length),
      customers: metric(currentCustomers, previousCustomers),
      availableRooms: {
        ...metric(availableRooms, availableRooms),
        total: rooms.length,
        occupied: occupiedRooms,
      },
    },
    charts: {
      revenue: dateSeries(period).map((date) => {
        const row = revenueByDay.get(date) || { room: 0, restaurant: 0, other: 0 };
        return {
          date,
          room: roundMoney(row.room),
          restaurant: roundMoney(row.restaurant),
          other: roundMoney(row.other),
          total: roundMoney(row.room + row.restaurant + row.other),
        };
      }),
      activity: dateSeries(period).map((date) => ({
        date,
        bookings: bookingsByDay.get(date) || 0,
        orders: ordersByDay.get(date) || 0,
      })),
      distribution: [
        { key: "room", value: roomRevenue },
        { key: "restaurant", value: restaurantRevenue },
        ...(otherRevenue > 0 ? [{ key: "other", value: otherRevenue }] : []),
      ],
    },
    rooms: {
      total: rooms.length,
      available: availableRooms,
      occupied: occupiedRooms,
      occupancyRate: rooms.length ? Number(((occupiedRooms / rooms.length) * 100).toFixed(1)) : 0,
    },
    recent: {
      bookings: newest(currentBookings, ["createdAt", "checkIn"]).map(safeBooking),
      orders: newest(currentOrders, ["orderDate", "createdAt"]).map(safeOrder),
    },
  };
}

