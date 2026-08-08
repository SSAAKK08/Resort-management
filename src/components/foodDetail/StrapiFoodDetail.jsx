"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaArrowLeft, FaCheck, FaClock, FaMinus, FaPlus } from "react-icons/fa";
import AppLink from "@/components/navigation/AppLink";
import ResCard from "@/components/cards/ResCard";
import { normalizeFood } from "@/lib/catalog";

const CART_KEY = "resortFoodCart";

export default function StrapiFoodDetail() {
  const { slug } = useParams();
  const router = useRouter();
  const [food, setFood] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(`/api/food/${encodeURIComponent(slug)}`, {
        cache: "no-store",
      }).then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error);
        return normalizeFood(payload.data);
      }),
      fetch("/api/food", { cache: "no-store" }).then((response) =>
        response.json(),
      ),
    ])
      .then(([current, all]) => {
        setFood(current);
        setRelated(
          (all.data || [])
            .map(normalizeFood)
            .filter(
              (item) =>
                item.slug !== current.slug &&
                item.category === current.category,
            )
            .slice(0, 3),
        );
      })
      .catch((requestError) =>
        setError(requestError.message || "Unable to load this dish."),
      );
  }, [slug]);

  function addToOrder() {
    if (!food.available)
      return setMessage("This dish is currently unavailable.");
    const cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    const existing = cart.find((item) => item.documentId === food.documentId);
    const next = existing
      ? cart.map((item) =>
          item.documentId === food.documentId
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        )
      : [
          ...cart,
          {
            documentId: food.documentId,
            slug: food.slug,
            name: food.name,
            image: food.image,
            quantity,
          },
        ];
    localStorage.setItem(CART_KEY, JSON.stringify(next));
    setMessage(`${quantity} × ${food.name} added to your order.`);
    return next;
  }

  function buyNow() {
    if (addToOrder()) router.push("/checkout");
  }

  if (error)
    return (
      <main className="min-h-screen px-5 pt-32">
        <div className="mx-auto max-w-3xl rounded-2xl bg-red-50 p-8 text-red-700">
          {error}
          <AppLink to="/restaurant" className="mt-5 block font-semibold">
            Back to Restaurant
          </AppLink>
        </div>
      </main>
    );
  if (!food) return <div className="min-h-screen animate-pulse bg-slate-100" />;

  const gallery = [food.image, ...food.gallery].filter(
    (url, index, array) => url && array.indexOf(url) === index,
  );
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-7xl px-4 pb-20 pt-32">
        <AppLink
          to="/restaurant"
          className="inline-flex items-center gap-2 font-semibold text-primary-Blue"
        >
          <FaArrowLeft /> Back to Restaurant
        </AppLink>
        <section className="mt-6 grid grid-cols-12 gap-4">
          <img
            src={gallery[0]}
            alt={food.name}
            className="col-span-12 h-[360px] w-full rounded-2xl object-cover lg:col-span-8 lg:h-[540px]"
          />
          <div className="col-span-12 grid grid-cols-2 gap-4 lg:col-span-4 lg:grid-cols-1">
            {(gallery.slice(1, 3).length
              ? gallery.slice(1, 3)
              : [food.image, food.image]
            ).map((image, index) => (
              <img
                key={`${image}-${index}`}
                src={image}
                alt={`${food.name} gallery ${index + 1}`}
                className="h-52 w-full rounded-2xl object-cover lg:h-[262px]"
              />
            ))}
          </div>
        </section>
        <section className="mt-10 grid grid-cols-12 gap-10">
          <div className="col-span-12 lg:col-span-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary-Blue">
              {food.category}
            </p>
            <h1 className="mt-3 text-4xl font-bold text-slate-900 lg:text-5xl">
              {food.name}
            </h1>
            <div className="mt-5 flex flex-wrap gap-5 border-b pb-6 text-slate-600">
              <span className="flex items-center gap-2">
                <FaClock /> {food.preparationTime || "—"} minutes
              </span>
              <span className="flex items-center gap-2">
                <FaCheck /> {food.available ? "Available" : "Unavailable"}
              </span>
            </div>
            <p className="mt-7 text-lg leading-8 text-slate-600">
              {food.description}
            </p>
            <h2 className="mt-9 text-2xl font-bold">Ingredients</h2>
            {food.ingredients.length ? (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {food.ingredients.map((ingredient) => (
                  <div
                    key={ingredient}
                    className="flex items-center gap-3 rounded-xl bg-white p-4"
                  >
                    <FaCheck className="text-primary-Blue" />
                    {ingredient}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-slate-500">
                Ingredient details are not available.
              </p>
            )}
          </div>
          <aside className="col-span-12 lg:col-span-4">
            <div className="sticky top-28 rounded-2xl bg-white p-6 shadow-xl">
              <p className="text-3xl font-bold">${food.price.toFixed(2)}</p>
              <p className="mt-1 text-sm text-slate-500">
                Current Strapi menu price
              </p>
              <div className="mt-6 flex items-center justify-between rounded-xl border p-3">
                <span className="font-medium">Quantity</span>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="rounded-lg border p-2"
                  >
                    <FaMinus />
                  </button>
                  <strong>{quantity}</strong>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="rounded-lg border p-2"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
              <button
                type="button"
                disabled={!food.available}
                onClick={addToOrder}
                className="mt-5 w-full rounded-xl bg-primary-Blue py-3 font-semibold text-white disabled:bg-slate-300"
              >
                Add to Order
              </button>
              <button
                type="button"
                disabled={!food.available}
                onClick={buyNow}
                className="mt-3 w-full rounded-xl border border-primary-Blue py-3 font-semibold text-primary-Blue disabled:border-slate-300 disabled:text-slate-400"
              >
                Buy Now
              </button>
              {message && (
                <p className="mt-4 text-sm" role="status">
                  {message}
                </p>
              )}
            </div>
          </aside>
        </section>
        <section className="mt-16">
          <h2 className="text-3xl font-bold">Related Foods</h2>
          {related.length ? (
            <div className="mt-7 grid grid-cols-12 gap-5">
              {related.map((item) => (
                <ResCard
                  key={item.documentId}
                  id={item.id}
                  slug={item.slug}
                  images={item.image}
                  title={item.name}
                  description={item.description}
                  price={item.price}
                  typesof={item.category}
                />
              ))}
            </div>
          ) : (
            <p className="mt-4 text-slate-500">
              No related foods are available.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
