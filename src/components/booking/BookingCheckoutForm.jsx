"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AppLink from "@/components/navigation/AppLink";
import { normalizeFood } from "@/lib/catalog";
import { useLocale, useTranslations } from "next-intl";
import { useUser } from "@clerk/nextjs";
import { hasClerkPublishableKey } from "@/lib/clerk-config";

const money = (value, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    Number(value || 0),
  );

function countNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(`${checkIn}T00:00:00Z`);
  const end = new Date(`${checkOut}T00:00:00Z`);
  return Math.max(0, Math.round((end - start) / 86400000));
}

function ClerkBookingCheckoutForm(props) {
  const { isLoaded, isSignedIn, user } = useUser();
  return (
    <BookingCheckoutContent
      {...props}
      clerkAuth={{ isLoaded, isSignedIn, user }}
    />
  );
}

function BookingCheckoutContent({
  rooms,
  initialRoomSlug = "",
  initialPromotionCode = "",
  clerkAuth = null,
}) {
  const locale = useLocale();
  const t = useTranslations("Forms");
  const router = useRouter();
  const initialRoom =
    rooms.find((room) => room.slug === initialRoomSlug) || rooms[0];
  const [roomDocumentId, setRoomDocumentId] = useState(
    initialRoom?.documentId || "",
  );
  const [foods, setFoods] = useState([]);
  const [includeFood, setIncludeFood] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [session, setSession] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [sessionError, setSessionError] = useState("");
  const [sessionRequest, setSessionRequest] = useState(0);
  const [settings, setSettings] = useState({
    taxPercentage: 0,
    currency: "USD",
  });
  const [form, setForm] = useState({
    checkIn: "",
    checkOut: "",
    numberOfGuests: 1,
    fullName: "",
    phone: "",
    address: "",
    specialRequest: "",
    promotionCode: initialPromotionCode.toUpperCase(),
  });
  const [promotion, setPromotion] = useState(null);
  const [promoStatus, setPromoStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/food", { cache: "no-store" }).then((response) =>
        response.json(),
      ),
      fetch("/api/resort-settings", { cache: "no-store" }).then((response) =>
        response.json(),
      ),
    ])
      .then(([foodPayload, settingPayload]) => {
        setFoods(
          (foodPayload.data || [])
            .map((item) => normalizeFood(item, locale))
            .filter((food) => food.available !== false),
        );
        const resort = settingPayload.data || settingPayload;
        setSettings({
          taxPercentage: Number(resort?.taxPercentage || 0),
          currency: resort?.currency || "USD",
        });
      })
      .catch(() =>
        setError(
          "Some booking information could not be loaded. Please refresh the page.",
        ),
      );
  }, [locale]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/auth/session", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json().catch(() => ({}));
        if (!response.ok)
          throw new Error(payload.error || t("resortSessionUnavailable"));
        setSession(payload.user ? payload : null);
        setSessionError("");
        setForm((current) => ({
          ...current,
          fullName:
            payload.profile?.fullName ||
            payload.user?.username ||
            clerkAuth?.user?.fullName ||
            "",
        }));
      })
      .catch((requestError) => {
        if (requestError.name !== "AbortError") {
          setSession(null);
          setSessionError(
            requestError.message || t("resortSessionUnavailable"),
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setSessionLoading(false);
      });
    return () => controller.abort();
  }, [sessionRequest, t, clerkAuth?.user?.fullName]);

  const clerkIsLoading = Boolean(clerkAuth && !clerkAuth.isLoaded);
  const isAuthenticated = clerkAuth
    ? Boolean(clerkAuth.isLoaded && clerkAuth.isSignedIn)
    : Boolean(session?.user);
  const accountEmail =
    session?.user?.email ||
    clerkAuth?.user?.primaryEmailAddress?.emailAddress ||
    "";

  function retrySession() {
    setSessionLoading(true);
    setSessionError("");
    setSessionRequest((value) => value + 1);
  }

  const selectedRoom =
    rooms.find((room) => room.documentId === roomDocumentId) || rooms[0];
  const nights = countNights(form.checkIn, form.checkOut);
  const roomSubtotal = Number(selectedRoom?.price || 0) * nights;
  const foodSubtotal = includeFood
    ? foods.reduce(
        (sum, food) =>
          sum + food.price * Number(quantities[food.documentId] || 0),
        0,
      )
    : 0;
  const discountAmount = Number(promotion?.discountAmount || 0);
  const taxableAmount = Math.max(
    0,
    roomSubtotal + foodSubtotal - discountAmount,
  );
  const tax = (taxableAmount * settings.taxPercentage) / 100;
  const total = taxableAmount + tax;
  const selectedFoodItems = useMemo(
    () =>
      Object.entries(quantities)
        .filter(([, quantity]) => Number(quantity) > 0)
        .map(([documentId, quantity]) => ({
          documentId,
          quantity: Number(quantity),
        })),
    [quantities],
  );

  function updateForm(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
    if (["checkIn", "checkOut", "promotionCode"].includes(name)) {
      setPromotion(null);
      setPromoStatus("");
    }
  }

  async function validatePromotion() {
    setPromoStatus("Validating...");
    setPromotion(null);
    try {
      const response = await fetch("/api/promotions/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.promotionCode,
          roomDocumentId,
          checkIn: form.checkIn,
          checkOut: form.checkOut,
        }),
      });
      const payload = await response.json();
      if (!response.ok)
        throw new Error(payload.error || "Promotion is not valid.");
      setPromotion(payload);
      setPromoStatus(`${payload.code} applied successfully.`);
    } catch (requestError) {
      setPromoStatus(requestError.message);
    }
  }

  async function submitBooking(event) {
    event.preventDefault();
    setError("");
    if (!isAuthenticated) return setError(t("loginRequired"));
    if (!session?.user)
      return setError(sessionError || t("resortSessionUnavailable"));
    if (!selectedRoom || nights < 1)
      return setError(
        "Select a room and a valid check-in/check-out date range.",
      );
    if (includeFood && !selectedFoodItems.length)
      return setError(
        "Select at least one food item or turn off optional food ordering.",
      );
    if (form.promotionCode && !promotion)
      return setError("Validate the promotion code before booking.");
    if (
      !window.confirm(
        `Confirm this booking for ${money(total, settings.currency)}?`,
      )
    )
      return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomDocumentId,
          checkIn: form.checkIn,
          checkOut: form.checkOut,
          numberOfGuests: Number(form.numberOfGuests),
          specialRequest: form.specialRequest,
          customerInfo: {
            fullName: form.fullName,
            phone: form.phone,
            address: form.address,
          },
          promotionCode: promotion?.code || "",
          foodItems: includeFood ? selectedFoodItems : [],
        }),
      });
      const payload = await response.json();
      if (!response.ok)
        throw new Error(payload.error || "Unable to complete the booking.");
      router.push(
        `/my-receipts/${encodeURIComponent(payload.data.receiptNumber)}`,
      );
      router.refresh();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!rooms.length) return null;

  return (
    <section
      id="booking-form"
      className="mx-3 mt-12 rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm lg:mx-16 lg:p-8"
    >
      <div className="mb-7">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-Blue">
          Sea Breeze
        </p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
          {t("bookStay")}
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Room, food, promotion, tax, and final total are recalculated securely
          by the server.
        </p>
      </div>
      {!clerkIsLoading && !isAuthenticated && (
        <p className="mb-5 rounded-xl bg-amber-50 p-4 text-amber-800">
          {t("prepareBooking")}{" "}
          <AppLink to="/login?next=/booking" className="font-bold underline">
            {t("loginAction")}
          </AppLink>{" "}
          {t("beforeSubmitting")}
        </p>
      )}
      {isAuthenticated && !sessionLoading && !session?.user && (
        <div
          className="mb-5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100"
          role="alert"
        >
          <p className="font-semibold">{t("signedInSyncPending")}</p>
          <p className="mt-1 text-sm">
            {sessionError || t("resortSessionUnavailable")}
          </p>
          <button
            type="button"
            onClick={retrySession}
            className="mt-3 rounded-lg bg-primary-Blue px-4 py-2 font-semibold text-white"
          >
            {t("retrySession")}
          </button>
        </div>
      )}
      <form
        onSubmit={submitBooking}
        className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr]"
      >
        <div className="space-y-7">
          <fieldset className="grid gap-4 rounded-2xl bg-white p-5 dark:bg-slate-900 sm:grid-cols-2">
            <legend className="px-2 text-lg font-bold">
              {t("stayDetails")}
            </legend>
            <label className="sm:col-span-2">
              Room
              <select
                value={roomDocumentId}
                onChange={(event) => {
                  setRoomDocumentId(event.target.value);
                  setPromotion(null);
                  setPromoStatus("");
                }}
                className="mt-2 w-full rounded-xl border p-3"
                required
              >
                {rooms.map((room) => (
                  <option key={room.documentId} value={room.documentId}>
                    {room.title} — {money(room.price, settings.currency)}/night
                  </option>
                ))}
              </select>
            </label>
            <label>
              Check-in
              <input
                type="date"
                min={new Date().toISOString().slice(0, 10)}
                value={form.checkIn}
                onChange={(event) => updateForm("checkIn", event.target.value)}
                className="mt-2 w-full rounded-xl border p-3"
                required
              />
            </label>
            <label>
              Check-out
              <input
                type="date"
                min={form.checkIn || new Date().toISOString().slice(0, 10)}
                value={form.checkOut}
                onChange={(event) => updateForm("checkOut", event.target.value)}
                className="mt-2 w-full rounded-xl border p-3"
                required
              />
            </label>
            <label>
              Guests
              <input
                type="number"
                min="1"
                max={selectedRoom?.maximumGuests || 1}
                value={form.numberOfGuests}
                onChange={(event) =>
                  updateForm("numberOfGuests", event.target.value)
                }
                className="mt-2 w-full rounded-xl border p-3"
                required
              />
            </label>
            <label className="sm:col-span-2">
              Special request
              <textarea
                value={form.specialRequest}
                onChange={(event) =>
                  updateForm("specialRequest", event.target.value)
                }
                className="mt-2 min-h-24 w-full rounded-xl border p-3"
                maxLength="5000"
              />
            </label>
          </fieldset>

          <fieldset className="grid gap-4 rounded-2xl bg-white p-5 dark:bg-slate-900 sm:grid-cols-2">
            <legend className="px-2 text-lg font-bold">
              {t("customerInfo")}
            </legend>
            <label>
              Full name
              <input
                value={form.fullName}
                onChange={(event) => updateForm("fullName", event.target.value)}
                className="mt-2 w-full rounded-xl border p-3"
                required
              />
            </label>
            <label>
              Email
              <input
                value={accountEmail}
                className="mt-2 w-full rounded-xl border bg-slate-100 p-3"
                readOnly
                placeholder={t("emailAfterLogin")}
              />
            </label>
            <label>
              Phone
              <input
                value={form.phone}
                onChange={(event) => updateForm("phone", event.target.value)}
                className="mt-2 w-full rounded-xl border p-3"
              />
            </label>
            <label>
              Address
              <input
                value={form.address}
                onChange={(event) => updateForm("address", event.target.value)}
                className="mt-2 w-full rounded-xl border p-3"
              />
            </label>
          </fieldset>

          <div className="rounded-2xl bg-white p-5">
            <button
              type="button"
              onClick={() => {
                setIncludeFood((value) => !value);
                setQuantities({});
              }}
              className="flex w-full items-center justify-between text-left"
            >
              <span>
                <strong className="block text-lg">
                  Would you like to order food for your stay?
                </strong>
                <span className="text-sm text-slate-500">
                  Optional — skip it without affecting your room booking.
                </span>
              </span>
              <span className="text-2xl">{includeFood ? "−" : "+"}</span>
            </button>
            {includeFood && (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {foods.length ? (
                  foods.map((food) => (
                    <label
                      key={food.documentId}
                      className="flex items-center gap-3 rounded-xl border p-3"
                    >
                      <img
                        src={food.image}
                        alt=""
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                      <span className="min-w-0 flex-1">
                        <strong className="block truncate">{food.name}</strong>
                        <span className="text-sm text-primary-Blue">
                          {money(food.price, settings.currency)}
                        </span>
                      </span>
                      <input
                        aria-label={`${food.name} quantity`}
                        type="number"
                        min="0"
                        max="99"
                        value={quantities[food.documentId] || 0}
                        onChange={(event) =>
                          setQuantities((current) => ({
                            ...current,
                            [food.documentId]: Number(event.target.value),
                          }))
                        }
                        className="w-16 rounded-lg border p-2"
                      />
                    </label>
                  ))
                ) : (
                  <p className="text-slate-500">
                    No food is currently available.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-white p-5">
            <label className="font-bold">Promotion code</label>
            <div className="mt-2 flex gap-2">
              <input
                value={form.promotionCode}
                onChange={(event) =>
                  updateForm("promotionCode", event.target.value.toUpperCase())
                }
                className="min-w-0 flex-1 rounded-xl border p-3 uppercase"
                placeholder="SUMMER20"
              />
              <button
                type="button"
                onClick={validatePromotion}
                disabled={
                  !form.promotionCode ||
                  !roomDocumentId ||
                  !form.checkIn ||
                  !form.checkOut ||
                  promoStatus === "Validating..."
                }
                className="rounded-xl bg-slate-900 px-5 font-semibold text-white disabled:opacity-50"
              >
                Apply
              </button>
            </div>
            {promoStatus && (
              <p
                className={`mt-2 text-sm ${promotion ? "text-emerald-700" : "text-amber-700"}`}
              >
                {promoStatus}
              </p>
            )}
          </div>
        </div>

        <aside className="h-fit rounded-2xl bg-primary-Blue p-6 text-white lg:sticky lg:top-24">
          <h3 className="text-xl font-bold">Booking summary</h3>
          <p className="mt-2 text-sm text-white/75">
            {selectedRoom?.title} · {nights || 0} night(s)
          </p>
          <div className="mt-6 space-y-3">
            <div className="flex justify-between">
              <span>Room subtotal</span>
              <strong>{money(roomSubtotal, settings.currency)}</strong>
            </div>
            <div className="flex justify-between">
              <span>Food subtotal</span>
              <strong>{money(foodSubtotal, settings.currency)}</strong>
            </div>
            <div className="flex justify-between text-emerald-200">
              <span>Promotion discount</span>
              <strong>−{money(discountAmount, settings.currency)}</strong>
            </div>
            <div className="flex justify-between">
              <span>Tax ({settings.taxPercentage}%)</span>
              <strong>{money(tax, settings.currency)}</strong>
            </div>
            <div className="flex justify-between border-t border-white/30 pt-4 text-xl">
              <span>Final total</span>
              <strong>{money(total, settings.currency)}</strong>
            </div>
          </div>
          {error && (
            <p
              className="mt-5 rounded-xl bg-red-950/30 p-3 text-sm"
              role="alert"
            >
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-xl bg-white px-5 py-3 font-bold text-primary-Blue disabled:opacity-60"
          >
            {submitting ? "Saving booking..." : "Confirm booking"}
          </button>
          <p className="mt-3 text-xs text-white/70">
            University-project mock payment. No real payment gateway is
            connected.
          </p>
        </aside>
      </form>
    </section>
  );
}

export default function BookingCheckoutForm(props) {
  return hasClerkPublishableKey() ? (
    <ClerkBookingCheckoutForm {...props} />
  ) : (
    <BookingCheckoutContent {...props} />
  );
}
