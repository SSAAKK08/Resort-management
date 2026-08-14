"use client";

import { useEffect, useState } from "react";
import banner from "../../assets/promotion/banner.jpg";
import AppLink from "../navigation/AppLink";
import { normalizePromotion } from "../../lib/catalog";
import { useLocale, useTranslations } from "next-intl";

const discountLabel = (promotion) =>
  promotion.discountType === "percentage"
    ? `${promotion.discountValue}% OFF`
    : `$${promotion.discountValue} OFF`;

export default function Promotion() {
  const locale = useLocale();
  const t = useTranslations("Promotions");
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  useEffect(() => {
    fetch("/api/promotions", { cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok)
          throw new Error(payload.error || "Unable to load promotions.");
        setPromotions(
          (payload.data || []).map((item) => normalizePromotion(item, locale)),
        );
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [locale]);

  async function copyCode(code) {
    await navigator.clipboard.writeText(code);
    setCopied(code);
    window.setTimeout(() => setCopied(""), 1800);
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950">
      <header
        className="relative flex min-h-[70vh] items-end overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${banner.src})` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/25 to-transparent" />
        <div className="relative mx-3 max-w-3xl pb-14 text-white lg:mx-16">
          <p className="font-semibold uppercase tracking-[0.25em] text-cyan-200">{t("eyebrow")} </p>
          <h1 className="mt-3 text-4xl font-bold md:text-6xl">{t("title")}</h1>
          <p className="mt-4 text-lg text-white/80">{t("intro")}</p>
        </div>
      </header>
      <main className="mx-3 py-14 lg:mx-16">
        <div className="mb-8">
          <p className="font-semibold uppercase tracking-widest text-primary-Blue"> {t("section")}</p>
          <h2 className="mt-2 text-3xl font-bold">{t("available")}</h2>
        </div>

        {loading && (
          <div className="grid gap-6 lg:grid-cols-2">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="h-96 animate-pulse rounded-3xl bg-slate-200"
              />
            ))}
          </div>
        )}

        {error && (
          <p className="rounded-2xl bg-red-50 p-5 text-red-700">{error}</p>
        )}
        {!loading && !error && !promotions.length && (
          <div className="rounded-3xl border border-dashed p-12 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
            {t("empty")}
          </div>
        )}
        <section className="grid gap-7 lg:grid-cols-2">
          {promotions.map((promotion) => (
            <article
              key={promotion.documentId}
              className="overflow-hidden rounded-3xl bg-white shadow-sm"
            >
              <AppLink to={`/promotion/${promotion.slug}`}>
                <img
                  src={promotion.image}
                  alt={promotion.title}
                  className="h-72 w-full object-cover"
                />
              </AppLink>
              <div className="p-7">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="rounded-full bg-cyan-50 px-4 py-2 font-bold text-primary-Blue">
                    {discountLabel(promotion)}
                  </span>
                  <span
                    className={
                      promotion.active
                        ? "font-semibold text-emerald-700"
                        : "font-semibold text-red-700"
                    }
                  >
                    {promotion.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <AppLink to={`/promotion/${promotion.slug}`}>
                  <h3 className="mt-5 text-3xl font-bold">{promotion.title}</h3>
                </AppLink>
                <p className="mt-3 text-slate-600">{promotion.description}</p>
                <div className="mt-6 flex items-center justify-between rounded-2xl border border-dashed border-primary-Blue bg-cyan-50/40 p-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-500">
                      Promotion code
                    </p>
                    <strong className="text-xl tracking-wider">
                      {promotion.promotionCode}
                    </strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyCode(promotion.promotionCode)}
                    className="rounded-xl bg-white px-4 py-2 font-bold text-primary-Blue shadow-sm"
                  >
                    {copied === promotion.promotionCode ? "Copied!" : "Copy"}
                  </button>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <AppLink
                    to={`/promotion/${promotion.slug}`}
                    className="rounded-xl border px-5 py-3 text-center font-bold"
                  >
                    View details
                  </AppLink>
                  <AppLink
                    to={`/booking?promo=${encodeURIComponent(promotion.promotionCode)}`}
                    className="rounded-xl bg-primary-Blue px-5 py-3 text-center font-bold text-white"
                  >
                    Apply to booking
                  </AppLink>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
