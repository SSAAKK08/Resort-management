"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const CONFIG = {
  bookings: {
    title: "Bookings",
    statusField: "bookingStatus",
    statuses: [
      "pending",
      "confirmed",
      "checked-in",
      "checked-out",
      "cancelled",
    ],
  },
  orders: {
    title: "Food Orders",
    statusField: "orderStatus",
    statuses: ["pending", "preparing", "ready", "completed", "cancelled"],
  },
  payments: { title: "Payments" },
  receipts: { title: "Receipts" },
  users: { title: "Users" },
  messages: {
    title: "Contact Messages",
    statusField: "status",
    statuses: ["new", "read", "replied"],
  },
};

function cells(type, item) {
  if (type === "bookings")
    return [
      item.bookingNumber,
      item.room?.title || "—",
      item.user?.email || "—",
      `$${Number(item.totalAmount || 0).toFixed(2)}`,
    ];
  if (type === "orders")
    return [
      item.orderNumber,
      item.user?.email || "—",
      item.orderDate ? new Date(item.orderDate).toLocaleString() : "—",
      `$${Number(item.totalAmount || 0).toFixed(2)}`,
    ];
  if (type === "payments")
    return [
      item.paymentNumber,
      item.paymentType,
      item.method,
      `$${Number(item.amount || 0).toFixed(2)}`,
      item.status,
    ];
  if (type === "receipts")
    return [
      item.receiptNumber,
      item.receiptType,
      item.customerEmail,
      `$${Number(item.totalAmount || 0).toFixed(2)}`,
    ];
  if (type === "users")
    return [
      item.username,
      item.email,
      item.confirmed ? "Confirmed" : "Unconfirmed",
      item.blocked ? "Blocked" : "Active",
    ];
  return [item.fullName, item.email, item.phone || "—", item.message];
}

const HEADERS = {
  bookings: ["Booking", "Room", "Customer", "Total"],
  orders: ["Order", "Customer", "Date", "Total"],
  payments: ["Payment", "Type", "Method", "Amount", "Status"],
  receipts: ["Receipt", "Type", "Customer", "Total"],
  users: ["Username", "Email", "Confirmed", "Account"],
  messages: ["Name", "Email", "Phone", "Message"],
};

export default function AdminRecordsTable({ type }) {
  const t = useTranslations("Admin");
  const baseConfig = CONFIG[type];
  const titleKeys = {
    bookings: "bookings",
    orders: "orders",
    payments: "payments",
    receipts: "receipts",
    users: "users",
    messages: "messages",
  };
  const config = { ...baseConfig, title: t(titleKeys[type]) };
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/records/${type}`, { cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error);
        setItems(Array.isArray(payload) ? payload : payload.data || []);
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [type]);

  async function updateStatus(item, status) {
    const response = await fetch(`/api/admin/records/${type}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documentId: item.documentId, status }),
    });
    const payload = await response.json();
    if (!response.ok) return setError(payload.error || "Status update failed.");
    setItems((current) =>
      current.map((entry) =>
        entry.documentId === item.documentId
          ? { ...entry, [config.statusField]: status }
          : entry,
      ),
    );
  }

  return (
    <section>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
        {config.title}
      </h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300">{t("live")}</p>
      {error && (
        <p className="mt-5 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>
      )}
      {loading ? (
        <div className="mt-6 h-64 animate-pulse rounded-2xl bg-white" />
      ) : items.length ? (
        <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm dark:bg-slate-900">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-slate-50">
              <tr>
                {HEADERS[type].map((header) => (
                  <th key={header} className="p-4">
                    {header}
                  </th>
                ))}
                {config.statusField && <th className="p-4">Status</th>}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.documentId || item.id}
                  className="border-b align-top last:border-0"
                >
                  {cells(type, item).map((value, index) => (
                    <td key={index} className="max-w-sm p-4">
                      {value}
                    </td>
                  ))}
                  {config.statusField && (
                    <td className="p-4">
                      <select
                        value={item[config.statusField]}
                        onChange={(e) => updateStatus(item, e.target.value)}
                        className="rounded-lg border p-2"
                      >
                        {config.statuses.map((status) => (
                          <option key={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl bg-white p-12 text-center text-slate-500 dark:bg-slate-900 dark:text-slate-400">
          {t("empty")}
        </div>
      )}
    </section>
  );
}
