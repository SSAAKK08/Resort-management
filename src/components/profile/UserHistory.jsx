"use client";

// It's working for saved the three kind different receipt : booking, orders and recepit(booking and orders foods)

import { useEffect, useState } from "react";
import AppLink from "@/components/navigation/AppLink";
import { useTranslations } from "next-intl";

const CONFIG = {
  bookings: { title: "My Bookings", endpoint: "/api/bookings" },
  orders: { title: "My Food Orders", endpoint: "/api/orders" },
  receipts: { title: "My Receipts", endpoint: "/api/receipts" },
};

export default function UserHistory({ type }) {
  const profile = useTranslations("Profile");
  const nav = useTranslations("Navigation");
  const baseConfig = CONFIG[type];
  const config = {
    ...baseConfig,
    title:

    // part they check the conditions 
      type === "bookings"
        ? nav("bookings")
        : type === "orders"
          ? nav("orders")
          : nav("receipts"),
  };
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(config.endpoint, { cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error);
        setItems(payload.data || []);
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [config.endpoint]);

  return (
    <section>
      <h1 className="text-3xl font-bold">{config.title}</h1>
      {error && (
        <p className="mt-5 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>
      )}
      {loading ? (
        <div className="mt-6 h-64 animate-pulse rounded-2xl bg-white" />
      ) : items.length ? (
        <div className="mt-6 grid gap-5">
          {items.map((item) => {
            const number =
              item.bookingNumber || item.orderNumber || item.receiptNumber;
            const status =
              item.bookingStatus || item.orderStatus || item.payment?.status;
            return (
              <article
                key={item.documentId}
                className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {item.receiptType ||
                        (type === "bookings"
                          ? item.room?.title
                          : profile("restaurantOrder"))}
                    </p>
                    <h2 className="mt-1 text-xl font-bold">{number}</h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                      {status}
                    </p>
                  </div>
                  <p className="text-xl font-bold">
                    ${Number(item.totalAmount || 0).toFixed(2)}
                  </p>
                </div>
                {item.receipt?.receiptNumber && (
                  <AppLink
                    to={`/my-receipts/${item.receipt.receiptNumber}`}
                    className="mt-5 inline-block font-semibold text-primary-Blue"
                  >
                    {profile("viewReceipt")}
                  </AppLink>
                )}
                {type === "receipts" && (
                  <AppLink
                    to={`/my-receipts/${item.receiptNumber}`}
                    className="mt-5 inline-block font-semibold text-primary-Blue"
                  >
                    {profile("viewReceipt")}
                  </AppLink>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl bg-white p-12 text-center text-slate-500 dark:bg-slate-900 dark:text-slate-400">
          {profile("historyEmpty")}
        </div>
      )}
    </section>
  );
}
