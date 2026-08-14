"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import defaultAvatar from "@/assets/profile.png";

export default function ProfileEditor() {
  const router = useRouter();
  const { openUserProfile } = useClerk();
  const { user: clerkUser } = useUser();
  const t = useTranslations("Profile");
  const common = useTranslations("Common");
  const [form, setForm] = useState({
    phone: "",
    address: "",
    dateOfBirth: "",
    bio: "",
  });
  const [identity, setIdentity] = useState({ fullName: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [requestNumber, setRequestNumber] = useState(0);

  function retry() {
    setLoading(true);
    setLoadError("");
    setMissing(false);
    setRequestNumber((value) => value + 1);
  }

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/profile", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.error || t("loadErrorBody"));
        if (!payload.profile || !payload.user) {
          setMissing(true);
          return;
        }
        setIdentity({
          fullName: payload.profile.fullName || payload.user.username || "",
          email: payload.user.email || "",
        });
        setForm({
          phone: payload.profile.phone || "",
          address: payload.profile.address || "",
          dateOfBirth: payload.profile.dateOfBirth || "",
          bio: payload.profile.bio || "",
        });
      })
      .catch((requestError) => {
        if (requestError.name !== "AbortError")
          setLoadError(requestError.message || t("loadErrorBody"));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [requestNumber, t]);

  // block of updated data to success or not
  async function save(event) {
    event.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || t("updateFailed"));
      window.dispatchEvent(new Event("sessionChanged"));
      setMessage({ type: "success", text: t("updated") });
      router.refresh();
    } catch (error) {
      setMessage({ type: "error", text: error.message || t("updateFailed") });
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return (
      <div
        className="h-72 animate-pulse rounded-2xl bg-white dark:bg-slate-900"
        role="status"
        aria-label={common("loading")}
      />
    );

  if (loadError || missing) {
    return (
      <section
        className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100"
        role={loadError ? "alert" : "status"}
      >
        <h1 className="text-2xl font-bold">
          {loadError ? t("loadErrorTitle") : t("missingTitle")}
        </h1>
        <p className="mt-3 leading-7">{loadError || t("missingBody")}</p>
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

  const clerkName =
    clerkUser?.fullName || clerkUser?.username || identity.fullName;
  const clerkEmail =
    clerkUser?.primaryEmailAddress?.emailAddress || identity.email;
  const clerkAvatar = clerkUser?.imageUrl || defaultAvatar.src;

  return (
    <form
      onSubmit={save}
      className="space-y-6 rounded-2xl bg-white p-8 shadow-sm dark:bg-slate-900"
    >
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-primary-Blue">
          {t("resortDetails")}
        </p>
        <h1 className="mt-2 text-3xl font-bold">{t("editResortProfile")}</h1>
      </div>
      <section className="rounded-2xl border border-slate-200 p-5 dark:border-slate-700">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <img
            src={clerkAvatar}
            alt={clerkName || t("guest")}
            className="h-20 w-20 rounded-full object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-bold">
              {clerkName || t("guest")}
            </p>
            <p className="truncate text-sm text-slate-500 dark:text-slate-400">
              {clerkEmail}
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {t("accountManagedByClerk")}
            </p>
          </div>
          <button
            type="button"
            onClick={() => openUserProfile()}
            className="rounded-xl border border-primary-Blue px-4 py-2 font-semibold text-primary-Blue hover:bg-primary-Blue hover:text-white"
          >
            {t("manageAccount")}
          </button>
        </div>
      </section>
      <div className="grid gap-5 md:grid-cols-2">
        {[
          ["phone", common("phone"), "tel"],
          ["address", t("address"), "text"],
          ["dateOfBirth", t("birthDate"), "date"],
        ].map(([name, label, type]) => (
          <label key={name} className="text-sm font-medium">
            {label}
            <input
              name={name}
              type={type}
              value={form[name]}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  [name]: event.target.value,
                }))
              }
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </label>
        ))}
      </div>
      <label className="block text-sm font-medium">
        {t("bio")}
        <textarea
          rows="5"
          value={form.bio}
          onChange={(event) =>
            setForm((current) => ({ ...current, bio: event.target.value }))
          }
          className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        />
      </label>

      {/* update the status color with message */}
      {message.text && (
        <p
          className={
            message.type === "error"
              ? "text-sm text-red-600 dark:text-red-400"
              : "text-sm text-emerald-700 dark:text-emerald-400"
          }
          role="status">
          {message.text}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        {/* save button  */}
        <button
          disabled={saving}
          className="rounded-xl bg-primary-Blue px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? common("saving") : t("save")}
        </button>
        {/* cancel button */}
        <button
          type="button"
          onClick={() => router.push("/profile")}
          className="rounded-xl border border-slate-300 px-6 py-3 dark:border-slate-700"
        >
          {common("cancel")}
        </button>
      </div>
    </form>
  );
}
