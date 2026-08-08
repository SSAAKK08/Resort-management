"use client";

import { useEffect, useState } from "react";
import AppLink from "@/components/navigation/AppLink";
import { useTranslations } from "next-intl";

export default function ProfileView() {
  const t = useTranslations("Profile");
  const common = useTranslations("Common");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [requestNumber, setRequestNumber] = useState(0);

  function retry() {
    setLoading(true);
    setError("");
    setData(null);
    setRequestNumber((value) => value + 1);
  }

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/profile", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.error || t("loadErrorBody"));
        setData(payload);
      })
      .catch((requestError) => {
        if (requestError.name !== "AbortError")
          setError(requestError.message || t("loadErrorBody"));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [requestNumber, t]);

  if (loading) {
    return (
      <div
        className="h-64 animate-pulse rounded-2xl bg-white dark:bg-slate-900"
        role="status"
        aria-label={common("loading")}
      />
    );
  }

  if (error) {
    return (
      <section
        className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100"
        role="alert"
      >
        <h1 className="text-2xl font-bold">{t("loadErrorTitle")}</h1>
        <p className="mt-3 leading-7">{error}</p>
        <button
          type="button"
          onClick={retry}
          className="mt-6 rounded-xl bg-primary-Blue px-5 py-3 font-semibold text-white"
        >
          {t("retry")}
        </button>
      </section>
    );
  }

  const user = data?.user || null;
  const profile = data?.profile || null;
  if (!user || !profile) {
    return (
      <section
        className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100"
        role="status"
      >
        <h1 className="text-2xl font-bold">{t("missingTitle")}</h1>
        <p className="mt-3 leading-7">{t("missingBody")}</p>
        <button
          type="button"
          onClick={retry}
          className="mt-6 rounded-xl bg-primary-Blue px-5 py-3 font-semibold text-white"
        >
          {t("retry")}
        </button>
      </section>
    );
  }

  const fields = [
    [common("email"), user.email],
    [common("phone"), profile.phone],
    [t("address"), profile.address],
    [t("birthDate"), profile.dateOfBirth],
    [t("role"), user.role?.name || t("defaultRole")],
    [t("bio"), profile.bio],
  ];

  return (
    <section className="rounded-2xl bg-white p-8 shadow-sm dark:bg-slate-900">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary-Blue">
        {t("resortProfile")}
      </p>
      <h1 className="mt-2 text-3xl font-bold">
        {profile.fullName || user.username || t("guest")}
      </h1>
      <dl className="mt-7 grid gap-5 sm:grid-cols-2">
        {fields.map(([label, value]) => (
          <div key={label}>
            <dt className="text-sm text-slate-500 dark:text-slate-400">
              {label}
            </dt>
            <dd className="mt-1 whitespace-pre-wrap font-medium">
              {value || t("notProvided")}
            </dd>
          </div>
        ))}
      </dl>
      <AppLink
        to="/profile/edit"
        className="mt-8 inline-block rounded-xl bg-primary-Blue px-5 py-3 font-semibold text-white"
      >
        {t("editResortProfile")}
      </AppLink>
    </section>
  );
}
