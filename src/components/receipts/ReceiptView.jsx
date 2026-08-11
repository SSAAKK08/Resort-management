"use client";

import { useEffect, useState } from "react";
import AppLink from "@/components/navigation/AppLink";
import { useTranslations } from "next-intl";

const money = (amount, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    Number(amount || 0),
  );

export default function ReceiptView({ receiptNumber }) {
  const t = useTranslations("Receipt");
  const [payload, setPayload] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch(`/api/receipts/${encodeURIComponent(receiptNumber)}`, {
      cache: "no-store",
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Receipt not found.");
        setPayload(data);
      })
      .catch((requestError) => setError(requestError.message));
  }, [receiptNumber]);
  if (error)
    return <p className="rounded-xl bg-red-50 p-4 text-red-700">{error}</p>;
  if (!payload)
    return <div className="h-96 animate-pulse rounded-2xl bg-white" />;
  const receipt = payload.data;
  const resort = payload.resort || {};
  const room =
    (receipt.items || []).find((item) => item.type === "room") || null;
  const foodItems = (receipt.items || []).filter(
    (item) => item.type === "food",
  );
  return (
    <section
      aria-label={t("official")}
      className="receipt-print rounded-2xl bg-white p-8 shadow-sm dark:bg-slate-900"
    >
      <header className="flex flex-wrap items-start justify-between gap-5 border-b pb-6">
        <div>
          <p className="text-sm uppercase tracking-widest text-primary-Blue">
            Official Sea Breeze receipt
          </p>
          <h1 className="mt-2 text-3xl font-bold">
            {resort.resortName || "Sea Breeze Resort"}
          </h1>
          <p className="mt-2 text-sm text-slate-500">{resort.address}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500">Receipt number</p>
          <p className="font-bold">{receipt.receiptNumber}</p>
          <p className="mt-2 text-sm">
            {new Date(receipt.issuedAt).toLocaleString()}
          </p>
        </div>
      </header>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-sm text-slate-500">Customer</p>
          <p className="font-semibold">{receipt.customerName}</p>
          <p>{receipt.customerEmail}</p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Payment</p>
          <p className="font-semibold">
            {receipt.payment?.method} · {receipt.payment?.status}
          </p>
          <p>
            {receipt.payment?.paidAt
              ? new Date(receipt.payment.paidAt).toLocaleString()
              : "—"}
          </p>
        </div>
      </div>
      {room ? (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b">
              <tr>
                <th className="py-3">Room</th>
                <th>Stay</th>
                <th>Guests</th>
                <th>Rate</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-4">
                  {room.roomTitle}
                  <span className="block text-sm text-slate-500">
                    {room.roomNumber}
                  </span>
                </td>
                <td>
                  {room.checkIn} → {room.checkOut}
                  <span className="block text-sm">
                    {room.numberOfNights} nights
                  </span>
                </td>
                <td>{room.numberOfGuests}</td>
                <td>{money(room.pricePerNight, receipt.currency)}</td>
                <td>{money(room.lineTotal, receipt.currency)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b">
              <tr>
                <th className="py-3">Food</th>
                <th>Unit price</th>
                <th>Quantity</th>
                <th>Line total</th>
              </tr>
            </thead>
            <tbody>
              {(receipt.items || []).map((item, index) => (
                <tr key={`${item.foodName}-${index}`} className="border-b">
                  <td className="py-4">{item.foodName}</td>
                  <td>{money(item.unitPrice, receipt.currency)}</td>
                  <td>{item.quantity}</td>
                  <td>{money(item.lineTotal, receipt.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {room && foodItems.length > 0 && (
        <div className="mt-8 overflow-x-auto">
          <h2 className="mb-3 text-lg font-bold">Food for the stay</h2>
          <table className="w-full text-left">
            <thead className="border-b">
              <tr>
                <th className="py-3">Food</th>
                <th>Unit price</th>
                <th>Quantity</th>
                <th>Line total</th>
              </tr>
            </thead>
            <tbody>
              {foodItems.map((item, index) => (
                <tr key={`${item.foodName}-${index}`} className="border-b">
                  <td className="py-4">{item.foodName}</td>
                  <td>{money(item.unitPrice, receipt.currency)}</td>
                  <td>{item.quantity}</td>
                  <td>{money(item.lineTotal, receipt.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="ml-auto mt-8 max-w-sm space-y-3">
        <div className="flex justify-between">
          <span>Room subtotal</span>
          <strong>
            {money(
              receipt.roomSubtotal || (room ? room.lineTotal : 0),
              receipt.currency,
            )}
          </strong>
        </div>
        {foodItems.length > 0 && (
          <div className="flex justify-between">
            <span>Food subtotal</span>
            <strong>
              {money(
                receipt.foodSubtotal || (!room ? receipt.subtotal : 0),
                receipt.currency,
              )}
            </strong>
          </div>
        )}
        {receipt.discountAmount > 0 && (
          <div className="flex justify-between text-emerald-700">
            <span>Promotion ({receipt.promotionCode})</span>
            <strong>−{money(receipt.discountAmount, receipt.currency)}</strong>
          </div>
        )}
        <div className="flex justify-between">
          <span>Tax</span>
          <strong>{money(receipt.tax, receipt.currency)}</strong>
        </div>
        <div className="flex justify-between border-t pt-3 text-xl">
          <span>Final total</span>
          <strong>{money(receipt.totalAmount, receipt.currency)}</strong>
        </div>
      </div>
      <div className="receipt-actions mt-8 flex flex-wrap gap-3">
        <button
          onClick={() => window.print()}
          className="rounded-xl bg-primary-Blue px-5 py-3 font-semibold text-white"
        >
          Print / Download PDF
        </button>
        <AppLink
          to={
            receipt.receiptType === "room-booking"
              ? "/my-bookings"
              : "/my-orders"
          }
          className="rounded-xl border px-5 py-3 font-semibold"
        >
          Back to{" "}
          {receipt.receiptType === "room-booking"
            ? "My Bookings"
            : "My Food Orders"}
        </AppLink>
      </div>
    </section>
  );
}
