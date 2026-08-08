"use client";

import { useEffect, useState } from "react";
import Navbar from "../layout/NoPageChrome";
import Footer from "../layout/NoPageChrome";
import AppLink from "../navigation/AppLink";
import { normalizeActivity } from "../../lib/catalog";

const money = (value) =>
  Number(value) > 0
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value)
    : "Complimentary";

export default function ActivityDetail({ slug }) {
  const [activity, setActivity] = useState(null);
  const [related, setRelated] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(`/api/activities/${encodeURIComponent(slug)}`, {
        cache: "no-store",
      }).then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error);
        return normalizeActivity(payload.data);
      }),
      fetch("/api/activities", { cache: "no-store" }).then((response) =>
        response.json(),
      ),
    ])
      .then(([current, list]) => {
        setActivity(current);
        setRelated(
          (list.data || [])
            .map(normalizeActivity)
            .filter((item) => item.slug !== slug)
            .slice(0, 3),
        );
      })
      .catch((requestError) =>
        setError(requestError.message || "Activity not found."),
      );
  }, [slug]);

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
  if (!activity)
    return <div className="min-h-screen animate-pulse bg-slate-100" />;
  const gallery = [activity.image, ...activity.gallery].filter(
    (url, index, all) => url && all.indexOf(url) === index,
  );

  return (
    <div className="bg-slate-50">
      <Navbar />
      <main className="pb-16 pt-24">
        <section className="mx-3 grid gap-8 lg:mx-16 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <img
              src={gallery[0]}
              alt={activity.title}
              className="h-[55vh] w-full rounded-3xl object-cover shadow-lg"
            />
            {gallery.length > 1 && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {gallery.slice(1, 4).map((image) => (
                  <img
                    key={image}
                    src={image}
                    alt=""
                    className="h-32 w-full rounded-2xl object-cover"
                  />
                ))}
              </div>
            )}
          </div>
          <aside className="rounded-3xl bg-white p-7 shadow-sm">
            <p className="font-bold uppercase tracking-widest text-primary-Blue">
              {activity.activityType} · {activity.difficulty}
            </p>
            <h1 className="mt-3 text-4xl font-bold">{activity.title}</h1>
            <p className="mt-5 leading-7 text-slate-600">
              {activity.description}
            </p>
            <dl className="mt-7 grid grid-cols-2 gap-5">
              <div>
                <dt className="text-sm text-slate-400">Duration</dt>
                <dd className="font-bold">{activity.duration}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-400">Price</dt>
                <dd className="font-bold">{money(activity.price)}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-sm text-slate-400">Location</dt>
                <dd className="font-bold">{activity.location}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-sm text-slate-400">Availability</dt>
                <dd
                  className={`font-bold ${activity.available ? "text-emerald-700" : "text-red-700"}`}
                >
                  {activity.available ? "Available" : "Currently unavailable"}
                </dd>
              </div>
            </dl>
            <AppLink
              to="/about#contact"
              className="mt-8 block rounded-xl bg-primary-Blue px-5 py-3 text-center font-bold text-white"
            >
              Contact concierge
            </AppLink>
          </aside>
        </section>
        <section className="mx-3 mt-12 grid gap-6 lg:mx-16 lg:grid-cols-3">
          <Info title="Available schedule" items={activity.schedule} />
          <Info title="Requirements" items={activity.requirements} />
          <Info title="Things to bring" items={activity.thingsToBring} />
          <article className="rounded-3xl bg-amber-50 p-6 lg:col-span-3">
            <h2 className="text-xl font-bold">Safety notes</h2>
            <p className="mt-3 text-amber-900">
              {activity.safetyNotes ||
                "Please follow the instructions provided by resort staff."}
            </p>
          </article>
        </section>
        {related.length > 0 && (
          <section className="mx-3 mt-14 lg:mx-16">
            <h2 className="text-3xl font-bold">Related activities</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {related.map((item) => (
                <AppLink
                  key={item.documentId}
                  to={`/activities/${item.slug}`}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm"
                >
                  <img
                    src={item.image}
                    alt=""
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-5">
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <p className="mt-2 text-sm text-slate-500">
                      {item.duration} · {item.location}
                    </p>
                  </div>
                </AppLink>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

function Info({ title, items }) {
  return (
    <article className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold">{title}</h2>
      {items?.length ? (
        <ul className="mt-4 space-y-2 text-slate-600">
          {items.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-slate-500">
          Contact the concierge for details.
        </p>
      )}
    </article>
  );
}
