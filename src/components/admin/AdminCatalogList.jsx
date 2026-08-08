"use client";

import { useEffect, useMemo, useState } from "react";
import AppLink from "@/components/navigation/AppLink";
import { useTranslations } from "next-intl";

export default function AdminCatalogList({ type }) {
  const t = useTranslations("Admin");
  const isRoom = type === "room";
  const endpoint = isRoom ? "/api/admin/rooms" : "/api/admin/food";
  const basePath = isRoom ? "/admin/rooms" : "/admin/food";
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch(endpoint, { cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok)
          throw new Error(payload.error || "Unable to load records.");
        if (active) setItems(payload.data || []);
      })
      .catch((requestError) => active && setError(requestError.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [endpoint]);

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        const label = String(isRoom ? item.title : item.name).toLowerCase();
        const matchesSearch = label.includes(search.toLowerCase());
        const matchesFilter =
          filter === "all" ||
          (isRoom ? item.status === filter : String(item.available) === filter);
        return matchesSearch && matchesFilter;
      }),
    [filter, isRoom, items, search],
  );

  async function remove(item) {
    const label = isRoom ? item.title : item.name;
    if (!window.confirm(t("deleteConfirm", { name: label }))) return;
    const response = await fetch(`${endpoint}/${item.documentId}`, {
      method: "DELETE",
    });
    const payload = await response.json();
    if (!response.ok) return setError(payload.error || "Delete failed.");
    setItems((current) =>
      current.filter((entry) => entry.documentId !== item.documentId),
    );
  }

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            {isRoom ? t("rooms") : t("food")}
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            {t("searchHelp")}
          </p>
        </div>
        <AppLink
          to={`${basePath}/create`}
          className="rounded-xl bg-primary-Blue px-5 py-3 font-semibold text-white"
        >
          {isRoom ? t("addRoom") : t("addFood")}
        </AppLink>
      </div>
      <div className="mt-7 grid gap-3 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${isRoom ? "rooms" : "food"}`}
          className="rounded-lg border border-slate-300 px-4 py-3"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-4 py-3"
        >
          <option value="all">
            All {isRoom ? "statuses" : "availability"}
          </option>
          {isRoom ? (
            <>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
              <option value="unavailable">Unavailable</option>
            </>
          ) : (
            <>
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
            </>
          )}
        </select>
      </div>
      {error && (
        <p className="mt-5 rounded-xl bg-red-50 p-4 text-red-700" role="alert">
          {error}
        </p>
      )}
      {loading ? (
        <div className="mt-6 h-64 animate-pulse rounded-2xl bg-white" />
      ) : filtered.length ? (
        <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-slate-50 text-slate-600">
              <tr>
                <th className="p-4">{isRoom ? "Room" : "Food"}</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">{isRoom ? "Status" : "Available"}</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.documentId} className="border-b last:border-0">
                  <td className="p-4 font-semibold">
                    {isRoom ? item.title : item.name}
                    {isRoom && (
                      <span className="block text-xs font-normal text-slate-500">
                        {item.roomNumber}
                      </span>
                    )}
                  </td>
                  <td className="p-4">{item.category?.name || "—"}</td>
                  <td className="p-4">${Number(item.price).toFixed(2)}</td>
                  <td className="p-4">
                    {isRoom ? item.status : item.available ? "Yes" : "No"}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <AppLink
                        to={`${basePath}/${item.documentId}/edit`}
                        className="rounded-lg border px-3 py-2 hover:bg-slate-50"
                      >
                        Edit
                      </AppLink>
                      <button
                        onClick={() => remove(item)}
                        className="rounded-lg border border-red-200 px-3 py-2 text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl bg-white p-12 text-center text-slate-500 dark:bg-slate-900 dark:text-slate-400">
          {t("noMatches")}
        </div>
      )}
    </section>
  );
}
