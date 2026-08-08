"use client";

import { useEffect, useState } from "react";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function Metric({ label, value, currency = false }) {
  return (
    <article className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">
        {currency ? money.format(Number(value || 0)) : Number(value || 0)}
      </p>
    </article>
  );
}

function RecentTable({ title, items, type }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold">{title}</h2>
      {items.length ? (
        <div className="mt-4 space-y-3">
          {items.map((item) => {
            const number =
              item.bookingNumber || item.orderNumber || item.paymentNumber;
            const amount = item.totalAmount ?? item.amount;
            const status =
              item.bookingStatus || item.orderStatus || item.status;
            return (
              <div
                key={item.documentId || number}
                className="flex items-center justify-between gap-3 border-b pb-3 last:border-0"
              >
                <div>
                  <p className="font-medium">{number}</p>
                  <p className="text-xs text-slate-500">{status}</p>
                </div>
                {amount !== undefined && (
                  <p className="font-semibold">
                    {money.format(Number(amount))}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-500">No recent {type}.</p>
      )}
    </section>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("/api/admin/dashboard", { cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error);
        setData(payload);
      })
      .catch((requestError) => setError(requestError.message));
  }, []);
  if (error)
    return <p className="rounded-xl bg-red-50 p-4 text-red-700">{error}</p>;
  if (!data) return <div className="h-72 animate-pulse rounded-2xl bg-white" />;

  const metrics = [
    ["Total revenue", data.revenue.total, true],
    ["Room revenue", data.revenue.roomBookings, true],
    ["Restaurant revenue", data.revenue.restaurant, true],
    ["Revenue today", data.revenue.today, true],
    ["Room payments today", data.revenue.roomBookingsToday, true],
    ["Restaurant payments today", data.revenue.restaurantToday, true],
    ["Total rooms", data.rooms.total],
    ["Available rooms", data.rooms.available],
    ["Occupied rooms", data.rooms.occupied],
    ["Total bookings", data.bookings.total],
    ["Today's bookings", data.bookings.today],
    ["Pending bookings", data.bookings.pending],
    ["Confirmed bookings", data.bookings.confirmed],
    ["Restaurant orders", data.orders.total],
    ["Today's orders", data.orders.today],
    ["Registered users", data.users.total],
  ];
  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-widest text-primary-Blue">
        Overview · {data.timeZone}
      </p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">Dashboard</h1>
      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([label, value, currency]) => (
          <Metric key={label} label={label} value={value} currency={currency} />
        ))}
      </div>
      <div className="mt-7 grid gap-5 xl:grid-cols-3">
        <RecentTable
          title="Recent Bookings"
          items={data.recent.bookings}
          type="bookings"
        />
        <RecentTable
          title="Recent Food Orders"
          items={data.recent.orders}
          type="orders"
        />
        <RecentTable
          title="Recent Payments"
          items={data.recent.payments}
          type="payments"
        />
      </div>
    </section>
  );
}
