"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const defaults = {
  title: "",
  titleKm: "",
  name: "",
  nameKm: "",
  slug: "",
  roomNumber: "",
  description: "",
  descriptionKm: "",
  category: "",
  price: "",
  size: "",
  sizeKm: "",
  bed: "",
  bedKm: "",
  maximumGuests: "2",
  view: "",
  viewKm: "",
  status: "available",
  available: true,
  amenities: "",
  amenitiesKm: "",
  preparationTime: "25",
  ingredients: "",
  ingredientsKm: "",
};

export default function AdminCatalogForm({ type, documentId = null }) {
  const forms = useTranslations("Forms");
  const isRoom = type === "room";
  const router = useRouter();
  const endpoint = isRoom ? "/api/admin/rooms" : "/api/admin/food";
  const listPath = isRoom ? "/admin/rooms" : "/admin/food";
  const [form, setForm] = useState(defaults);
  const [categories, setCategories] = useState([]);
  const [mainFile, setMainFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [loading, setLoading] = useState(Boolean(documentId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/categories?type=${type}`, { cache: "no-store" }).then(
        (r) => r.json(),
      ),
      documentId
        ? fetch(`${endpoint}/${documentId}`, { cache: "no-store" }).then((r) =>
            r.json(),
          )
        : Promise.resolve(null),
    ])
      .then(([categoryPayload, itemPayload]) => {
        setCategories(categoryPayload.data || []);
        if (itemPayload?.data) {
          const item = itemPayload.data;
          setForm({
            ...defaults,
            ...item,
            category: item.category?.documentId || "",
            amenities: Array.isArray(item.amenities)
              ? item.amenities.join("\n")
              : "",
            amenitiesKm: Array.isArray(item.amenitiesKm)
              ? item.amenitiesKm.join("\n")
              : "",
            ingredients: Array.isArray(item.ingredients)
              ? item.ingredients.join("\n")
              : "",
            ingredientsKm: Array.isArray(item.ingredientsKm)
              ? item.ingredientsKm.join("\n")
              : "",
            available: Boolean(item.available),
          });
        }
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [documentId, endpoint, type]);

  function change(event) {
    const { name, value, type: inputType, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: inputType === "checkbox" ? checked : value,
    }));
  }

  async function upload(files) {
    if (!files.length) return [];
    const data = new FormData();
    files.forEach((file) => data.append("files", file));
    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: data,
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Image upload failed.");
    return payload.data || [];
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const [mainUploads, galleryUploads] = await Promise.all([
        mainFile ? upload([mainFile]) : Promise.resolve([]),
        galleryFiles.length ? upload(galleryFiles) : Promise.resolve([]),
      ]);
      const payload = {
        ...form,
        price: Number(form.price),
        category: form.category || null,
        available: Boolean(form.available),
        ...(isRoom
          ? {
              maximumGuests: Number(form.maximumGuests),
              amenities: form.amenities
                .split(/[\n,]/)
                .map((item) => item.trim())
                .filter(Boolean),
              amenitiesKm: form.amenitiesKm
                .split(/[\n,]/)
                .map((item) => item.trim())
                .filter(Boolean),
            }
          : {
              preparationTime: Number(form.preparationTime),
              ingredients: form.ingredients
                .split(/[\n,]/)
                .map((item) => item.trim())
                .filter(Boolean),
              ingredientsKm: form.ingredientsKm
                .split(/[\n,]/)
                .map((item) => item.trim())
                .filter(Boolean),
            }),
      };
      if (mainUploads[0]?.id) payload.mainImage = mainUploads[0].id;
      if (galleryUploads.length)
        payload.gallery = galleryUploads.map((file) => file.id);
      const response = await fetch(
        documentId ? `${endpoint}/${documentId}` : endpoint,
        {
          method: documentId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Save failed.");
      router.replace(listPath);
      router.refresh();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return (
      <div className="h-72 animate-pulse rounded-2xl bg-white dark:bg-slate-900" />
    );

  return (
    <section className="max-w-5xl">
      <h1 className="text-3xl font-bold text-slate-900">
        {documentId ? "Edit" : "Add"} {isRoom ? "Room" : "Food"}
      </h1>
      <form
        aria-label={forms("description")}
        onSubmit={submit}
        className="mt-7 space-y-6 rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900"
      >
        {error && (
          <p className="rounded-xl bg-red-50 p-4 text-red-700" role="alert">
            {error}
          </p>
        )}
        <div className="grid gap-5 md:grid-cols-2">
          <label className="text-sm font-medium">
            {isRoom ? "Room title" : "Food name"}
            <input
              required
              name={isRoom ? "title" : "name"}
              value={isRoom ? form.title : form.name}
              onChange={change}
              className="mt-2 w-full rounded-lg border p-3"
            />
          </label>
          <label className="text-sm font-medium">
            {isRoom ? "Room title (Khmer)" : "Food name (Khmer)"}
            <input
              name={isRoom ? "titleKm" : "nameKm"}
              value={isRoom ? form.titleKm : form.nameKm}
              onChange={change}
              className="mt-2 w-full rounded-lg border p-3"
              lang="km"
            />
          </label>
          <label className="text-sm font-medium">
            Slug
            <input
              required
              name="slug"
              value={form.slug}
              onChange={change}
              className="mt-2 w-full rounded-lg border p-3"
            />
          </label>
          {isRoom && (
            <label className="text-sm font-medium">
              Room number
              <input
                required
                name="roomNumber"
                value={form.roomNumber}
                onChange={change}
                className="mt-2 w-full rounded-lg border p-3"
              />
            </label>
          )}
          <label className="text-sm font-medium">
            Category
            <select
              name="category"
              value={form.category}
              onChange={change}
              className="mt-2 w-full rounded-lg border p-3"
            >
              <option value="">No category</option>
              {categories.map((category) => (
                <option key={category.documentId} value={category.documentId}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium">
            Price (USD)
            <input
              required
              min="0.01"
              step="0.01"
              type="number"
              name="price"
              value={form.price}
              onChange={change}
              className="mt-2 w-full rounded-lg border p-3"
            />
          </label>
          {isRoom ? (
            <>
              <label className="text-sm font-medium">
                Size
                <input
                  name="size"
                  value={form.size}
                  onChange={change}
                  className="mt-2 w-full rounded-lg border p-3"
                />
              </label>
              <label className="text-sm font-medium">
                Bed type
                <input
                  name="bed"
                  value={form.bed}
                  onChange={change}
                  className="mt-2 w-full rounded-lg border p-3"
                />
              </label>
              <label className="text-sm font-medium">
                Maximum guests
                <input
                  required
                  min="1"
                  type="number"
                  name="maximumGuests"
                  value={form.maximumGuests}
                  onChange={change}
                  className="mt-2 w-full rounded-lg border p-3"
                />
              </label>
              <label className="text-sm font-medium">
                View
                <input
                  name="view"
                  value={form.view}
                  onChange={change}
                  className="mt-2 w-full rounded-lg border p-3"
                />
              </label>
              <label className="text-sm font-medium">
                Status
                <select
                  name="status"
                  value={form.status}
                  onChange={change}
                  className="mt-2 w-full rounded-lg border p-3"
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </label>
            </>
          ) : (
            <label className="text-sm font-medium">
              Preparation time (minutes)
              <input
                required
                min="1"
                type="number"
                name="preparationTime"
                value={form.preparationTime}
                onChange={change}
                className="mt-2 w-full rounded-lg border p-3"
              />
            </label>
          )}
        </div>
        <label className="block text-sm font-medium">
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={change}
            rows="5"
            className="mt-2 w-full rounded-lg border p-3"
          />
        </label>
        <label className="block text-sm font-medium">
          Description (Khmer)
          <textarea
            name="descriptionKm"
            value={form.descriptionKm}
            onChange={change}
            rows="5"
            className="mt-2 w-full rounded-lg border p-3"
            lang="km"
          />
        </label>
        <label className="block text-sm font-medium">
          {isRoom ? "Amenities" : "Ingredients"} (one per line)
          <textarea
            name={isRoom ? "amenities" : "ingredients"}
            value={isRoom ? form.amenities : form.ingredients}
            onChange={change}
            rows="5"
            className="mt-2 w-full rounded-lg border p-3"
          />
        </label>
        <label className="block text-sm font-medium">
          {isRoom ? "Amenities" : "Ingredients"} (Khmer, one per line)
          <textarea
            name={isRoom ? "amenitiesKm" : "ingredientsKm"}
            value={isRoom ? form.amenitiesKm : form.ingredientsKm}
            onChange={change}
            rows="5"
            className="mt-2 w-full rounded-lg border p-3"
            lang="km"
          />
        </label>
        <label className="flex items-center gap-3 text-sm font-medium">
          <input
            type="checkbox"
            name="available"
            checked={form.available}
            onChange={change}
          />{" "}
          Available
        </label>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="text-sm font-medium">
            Main image (JPEG, PNG, WebP, GIF, AVIF; max 5 MB)
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              onChange={(e) => setMainFile(e.target.files[0] || null)}
              className="mt-2 block w-full"
            />
          </label>
          <label className="text-sm font-medium">
            Gallery images
            <input
              multiple
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              onChange={(e) => setGalleryFiles(Array.from(e.target.files))}
              className="mt-2 block w-full"
            />
          </label>
        </div>
        <div className="flex gap-3">
          <button
            disabled={saving}
            className="rounded-xl bg-primary-Blue px-6 py-3 font-semibold text-white"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={() => router.push(listPath)}
            className="rounded-xl border px-6 py-3"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
