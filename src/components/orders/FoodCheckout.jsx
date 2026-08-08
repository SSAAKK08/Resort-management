"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const CART_KEY = "resortFoodCart";

export default function FoodCheckout() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Cart hydration is intentionally client-only; permanent orders are stored in Strapi.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(JSON.parse(localStorage.getItem(CART_KEY) || "[]"));
  }, []);

  function update(documentId, quantity) {
    const next =
      quantity < 1
        ? items.filter((item) => item.documentId !== documentId)
        : items.map((item) =>
            item.documentId === documentId ? { ...item, quantity } : item,
          );
    setItems(next);
    localStorage.setItem(CART_KEY, JSON.stringify(next));
  }

  async function placeOrder() {
    setProcessing(true);
    setError("");
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(({ documentId, quantity }) => ({
            documentId,
            quantity,
          })),
        }),
      });
      const payload = await response.json();
      if (!response.ok)
        throw new Error(payload.error || "Order checkout failed.");
      localStorage.removeItem(CART_KEY);
      router.push(`/my-receipts/${payload.data.receiptNumber}`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setProcessing(false);
    }
  }

  return (
    <section className="rounded-2xl bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-bold">Restaurant Checkout</h1>
      <p className="mt-2 text-slate-600">
        Prices, tax, was include with good price.
      </p>
      {items.length ? (
        <div className="mt-7 space-y-4">
          {items.map((item) => (
            <div
              key={item.documentId}
              className="flex items-center gap-4 rounded-xl border p-4"
            >
              <img
                src={item.image}
                alt=""
                className="h-20 w-24 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-slate-500">
                  Current price verified at checkout
                </p>
              </div>
              <input
                aria-label={`Quantity for ${item.name}`}
                min="0"
                max="99"
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  update(item.documentId, Number(e.target.value))
                }
                className="w-20 rounded-lg border p-2"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-7 rounded-xl bg-slate-50 p-8 text-center text-slate-500">
          Your food order is empty.
        </div>
      )}
      <div className="mt-7 rounded-xl bg-blue-50 p-4 text-sm text-blue-900">
        <strong>Payment method: Mock Payment.</strong> No real payment gateway,
        card, or bank transfer is connected.
      </div>
      {error && (
        <p className="mt-4 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>
      )}
      <button
        disabled={!items.length || processing}
        onClick={placeOrder}
        className="mt-6 w-full rounded-xl bg-primary-Blue py-3 font-semibold text-white disabled:bg-slate-300"
      >
        {processing ? "Processing mock payment..." : "Place Order & Pay (Mock)"}
      </button>
    </section>
  );
}
