import test from "node:test";
import assert from "node:assert/strict";

import {
  buildDashboardData,
  percentageChange,
  resolveDashboardPeriod,
} from "./dashboard-data.js";

const NOW = new Date("2026-08-08T05:00:00.000Z");
const TIME_ZONE = "Asia/Phnom_Penh";

test("percentage changes never return Infinity or NaN", () => {
  assert.equal(percentageChange(0, 0), 0);
  assert.equal(percentageChange(25, 0), 100);
  assert.equal(percentageChange(75, 100), -25);
  assert.equal(Number.isFinite(percentageChange(25, 0)), true);
});

test("last seven days resolves an equal preceding comparison period", () => {
  assert.deepEqual(
    resolveDashboardPeriod({ period: "last7", now: NOW, timeZone: TIME_ZONE }),
    {
      key: "last7",
      start: "2026-08-02",
      end: "2026-08-08",
      previousStart: "2026-07-26",
      previousEnd: "2026-08-01",
      today: "2026-08-08",
    },
  );
});

test("custom ranges reject invalid boundaries", () => {
  assert.throws(
    () =>
      resolveDashboardPeriod({
        period: "custom",
        from: "2026-08-10",
        to: "2026-08-01",
        now: NOW,
        timeZone: TIME_ZONE,
      }),
    /valid custom start and end date/,
  );
});

test("dashboard revenue includes only unique completed payments and fills missing days", () => {
  const completedRoomPayment = {
    documentId: "pay-1",
    paymentNumber: "PAY-001",
    paymentType: "room-booking",
    status: "completed",
    amount: "100.50",
    currency: "USD",
    paidAt: "2026-08-03T03:00:00.000Z",
  };
  const data = buildDashboardData({
    now: NOW,
    timeZone: TIME_ZONE,
    period: "last7",
    payments: [
      completedRoomPayment,
      { ...completedRoomPayment },
      {
        documentId: "pay-2",
        paymentType: "restaurant-order",
        status: "completed",
        amount: 40,
        paidAt: "2026-08-08T02:00:00.000Z",
      },
      {
        documentId: "pay-3",
        paymentType: "room-booking",
        status: "pending",
        amount: 999,
        paidAt: "2026-08-08T02:00:00.000Z",
      },
      {
        documentId: "pay-4",
        paymentType: "restaurant-order",
        status: "refunded",
        amount: 500,
        paidAt: "2026-08-08T02:00:00.000Z",
      },
    ],
  });

  assert.equal(data.metrics.totalRevenue.value, 140.5);
  assert.equal(data.metrics.roomRevenue.value, 100.5);
  assert.equal(data.metrics.restaurantRevenue.value, 40);
  assert.equal(data.charts.revenue.length, 7);
  assert.equal(data.charts.revenue.find((row) => row.date === "2026-08-04").total, 0);
  assert.equal(data.charts.revenue.at(-1).total, 40);
});

test("activity, customers, room occupancy, and safe recent DTOs use real records", () => {
  const data = buildDashboardData({
    now: NOW,
    timeZone: TIME_ZONE,
    period: "today",
    bookings: [
      {
        documentId: "booking-1",
        bookingNumber: "SB-001",
        bookingStatus: "confirmed",
        totalAmount: 220,
        createdAt: "2026-08-08T01:00:00.000Z",
        customerInfo: { email: "private@example.com" },
      },
    ],
    orders: [
      {
        documentId: "order-1",
        orderNumber: "FO-001",
        orderStatus: "preparing",
        totalAmount: 25,
        orderDate: "2026-08-08T02:00:00.000Z",
      },
    ],
    users: [
      { id: 1, createdAt: "2026-08-07T01:00:00.000Z" },
      { id: 2, createdAt: "2026-08-08T01:00:00.000Z" },
    ],
    rooms: [
      { id: 1, status: "available", available: true },
      { id: 2, status: "occupied", available: false },
    ],
  });

  assert.equal(data.metrics.bookings.value, 1);
  assert.equal(data.metrics.orders.value, 1);
  assert.equal(data.metrics.customers.value, 2);
  assert.equal(data.metrics.customers.previous, 1);
  assert.equal(data.rooms.occupancyRate, 50);
  assert.equal(data.recent.bookings[0].customerInfo, undefined);
});
