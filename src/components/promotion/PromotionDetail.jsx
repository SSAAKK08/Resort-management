"use client";

import { useEffect, useState } from "react";
import Navbar from "../layout/NoPageChrome";
import Footer from "../layout/NoPageChrome";
import AppLink from "../navigation/AppLink";
import { normalizePromotion } from "../../lib/catalog";
import { useLocale } from "next-intl";

export default function PromotionDetail({ slug }) {
  const locale = useLocale();
  const [promotion, setPromotion] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    fetch(`/api/promotions/${encodeURIComponent(slug)}`, { cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok)
          throw new Error(payload.error || "Promotion not found.");
        setPromotion(normalizePromotion(payload.data, locale));
      })
      .catch((requestError) => setError(requestError.message));
  }, [locale, slug]);
  if (error)
    return (
      <>
        <Navbar />
        <main className="mx-auto min-h-[70vh] max-w-4xl px-4 pt-32">
          <p className="rounded-2xl bg-red-50 p-5 text-red-700">{error}</p>
        </main>
        <Footer />
      </>
    );
  if (!promotion)
    return <div className="min-h-screen animate-pulse bg-slate-100" />;
  const label =
    promotion.discountType === "percentage"
      ? `${promotion.discountValue}% OFF`
      : `$${promotion.discountValue} OFF`;
  const rooms = Array.isArray(promotion.applicableRooms)
    ? promotion.applicableRooms
    : [];
  return (
    <div className="bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="pb-16 pt-24">
        <section className="mx-3 grid overflow-hidden rounded-3xl bg-white shadow-lg lg:mx-16 lg:grid-cols-2">
          <img
            src={promotion.image}
            alt={promotion.title}
            className="h-full min-h-[480px] w-full object-cover"
          />
          <div className="p-7 lg:p-12">
            <span className="rounded-full bg-cyan-50 px-4 py-2 font-bold text-primary-Blue">
              {label}
            </span>
            <h1 className="mt-6 text-4xl font-bold">{promotion.title}</h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              {promotion.description}
            </p>
            <div className="mt-7 rounded-2xl border border-dashed border-primary-Blue bg-cyan-50 p-5">
              <p className="text-xs uppercase tracking-widest text-slate-500">
                Use code
              </p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <strong className="text-2xl tracking-wider">
                  {promotion.promotionCode}
                </strong>
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(
                      promotion.promotionCode,
                    );
                    setCopied(true);
                  }}
                  className="rounded-xl bg-white px-4 py-2 font-bold text-primary-Blue"
                >
                  {copied ? "Copied!" : "Copy code"}
                </button>
              </div>
            </div>

            <dl className="mt-7 grid grid-cols-2 gap-5 text-sm">
              <div>
                <dt className="text-slate-400">Starts</dt>
                <dd className="font-bold">{promotion.startDate}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Ends</dt>
                <dd className="font-bold">{promotion.endDate}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Minimum room subtotal</dt>
                <dd className="font-bold">${promotion.minimumBookingAmount}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Availability</dt>
                <dd className="font-bold">
                  {promotion.usageLimit
                    ? `${Math.max(0, promotion.usageLimit - promotion.usedCount)} uses left`
                    : "No usage limit"}
                </dd>
              </div>
            </dl>
            <AppLink
              to={`/booking?promo=${encodeURIComponent(promotion.promotionCode)}`}
              className="mt-8 block rounded-xl bg-primary-Blue px-6 py-4 text-center font-bold text-white"
            >
              Continue to booking
            </AppLink>
          </div>
        </section>
        <section className="mx-3 mt-10 grid gap-6 lg:mx-16 lg:grid-cols-2">
          <article className="rounded-3xl bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-bold">Terms and conditions</h2>
            <p className="mt-4 leading-7 text-slate-600">
              {promotion.termsAndConditions ||
                "Promotion validation is completed securely when you apply the code during booking."}
            </p>
          </article>
          <article className="rounded-3xl bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-bold">Applicable rooms</h2>
            {rooms.length ? (
              <ul className="mt-4 space-y-2 text-slate-600">
                {rooms.map((room) => (
                  <li key={room.documentId}>• {room.title}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-slate-600">
                All available rooms are eligible, subject to the minimum booking
                amount.
              </p>
            )}
          </article>
        </section>
      </main>
      <Footer />
    </div>
  );
}
