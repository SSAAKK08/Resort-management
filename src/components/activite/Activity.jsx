"use client";

import { useEffect, useState } from "react";
import banner from "../../assets/Activites/banner.png";
import resortStaff from "../../assets/Activites/resortStaff.png";
import AppLink from "../navigation/AppLink";
import { normalizeActivity } from "../../lib/catalog";
import { useLocale, useTranslations } from "next-intl";

const money = (amount) =>
  Number(amount) > 0
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
    : "Complimentary";

export default function Activity() {
  const t = useTranslations("Activities");
  const locale = useLocale();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/activities", { cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok)
          throw new Error(payload.error || "Unable to load activities.");
        setActivities(
          (payload.data || []).map((item) => normalizeActivity(item, locale)),
        );
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [locale]);

  return (
    <div className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header
        className="relative flex min-h-[68vh] items-end overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url(${banner.src})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/20 to-transparent" />
        <div className="relative mx-3 max-w-3xl pb-14 text-white lg:mx-16">
          <p className="font-semibold uppercase tracking-[0.25em] text-cyan-200">
            Explore Azurea
          </p>
          <h1 className="mt-3 text-4xl font-bold md:text-6xl">
            Experiences made for the coast
          </h1>
          <p className="mt-4 text-lg text-white/85">
            From quiet poolside mornings to guided adventures, discover every
            experience with clear schedules and safety information.
          </p>
        </div>
      </header>

      <main className="mx-3 py-14 lg:mx-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-semibold uppercase tracking-widest text-primary-Blue">
              Resort activities
            </p>
            <h2 className="mt-2 text-3xl font-bold">
              Choose your next experience
            </h2>
          </div>
          <p className="max-w-xl text-slate-600">
            Professional equipment and knowledgeable resort guides are available
            for every scheduled activity.
          </p>
        </div>
        {loading && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-96 animate-pulse rounded-3xl bg-slate-200"
              />
            ))}
          </div>
        )}
        {error && (
          <p className="rounded-2xl bg-red-50 p-5 text-red-700" role="alert">
            {error}
          </p>
        )}
        {!loading && !error && !activities.length && (
          <div className="rounded-3xl border border-dashed p-12 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
            {t("empty")}
          </div>
        )}
        {!loading && activities.length > 0 && (
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {activities.map((activity) => (
              <article
                key={activity.documentId}
                className="group overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <AppLink to={`/activities/${activity.slug}`}>
                  <img
                    src={activity.image}
                    alt={activity.title}
                    className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </AppLink>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider text-primary-Blue">
                    <span>{activity.activityType}</span>
                    <span>·</span>
                    <span>{activity.difficulty}</span>
                  </div>
                  <AppLink to={`/activities/${activity.slug}`}>
                    <h3 className="mt-3 text-2xl font-bold">
                      {activity.title}
                    </h3>
                  </AppLink>
                  <p className="mt-3 line-clamp-3 text-slate-600">
                    {activity.shortDescription}
                  </p>
                  <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-slate-400">Duration</dt>
                      <dd className="font-semibold">
                        {activity.duration || "Flexible"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-400">Price</dt>
                      <dd className="font-semibold">{money(activity.price)}</dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-slate-400">Location</dt>
                      <dd className="font-semibold">{activity.location}</dd>
                    </div>
                  </dl>
                  <AppLink
                    to={`/activities/${activity.slug}`}
                    className="mt-6 block rounded-xl bg-primary-Blue px-5 py-3 text-center font-bold text-white"
                  >
                    View Details
                  </AppLink>
                </div>
              </article>
            ))}
          </section>
        )}

        <section className="mt-16 grid items-center gap-10 overflow-hidden rounded-3xl bg-slate-900 p-7 text-white lg:grid-cols-2 lg:p-12">
          <div>
            <p className="font-semibold uppercase tracking-widest text-cyan-300">
              Uncompromising excellence
            </p>
            <h2 className="mt-3 text-3xl font-bold">
              Guided with care from start to finish
            </h2>
            <div className="mt-7 space-y-5">
              <div>
                <h3 className="text-xl font-bold">Premium equipment</h3>
                <p className="mt-1 text-white/70">
                  Professional-grade gear is inspected before every excursion
                  for comfort and safety.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold">Private concierge</h3>
                <p className="mt-1 text-white/70">
                  Our experience team helps select schedules and activities that
                  match your stay.
                </p>
              </div>
            </div>
          </div>
          <img
            src={resortStaff.src}
            alt="Resort activity staff"
            className="mx-auto max-h-96 object-contain"
          />
        </section>
      </main>
    </div>
  );
}
