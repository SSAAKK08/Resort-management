"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  FiArrowDownRight,
  FiArrowUpRight,
  FiCalendar,
  FiClipboard,
  FiCoffee,
  FiCreditCard,
  FiHome,
  FiMinus,
  FiRefreshCw,
  FiShoppingBag,
  FiUsers,
} from "react-icons/fi";
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const PERIODS = ["today", "last7", "last30", "month", "year", "custom"];
const CURRENCY_SERIES = new Set(["room", "restaurant", "other", "total"]);
const STATUSES = new Set([
  "pending",
  "confirmed",
  "checked-in",
  "checked-out",
  "cancelled",
  "preparing",
  "ready",
  "completed",
]);

function DashboardCard({ children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className}`}
    >
      {children}
    </section>
  );
}

function MetricTrend({ metric, t }) {
  const Icon =
    metric.direction === "up"
      ? FiArrowUpRight
      : metric.direction === "down"
        ? FiArrowDownRight
        : FiMinus;
  const color =
    metric.direction === "up"
      ? "text-emerald-600 dark:text-emerald-400"
      : metric.direction === "down"
        ? "text-red-600 dark:text-red-400"
        : "text-slate-500 dark:text-slate-400";
  return (
    <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
      <span className={`inline-flex items-center gap-1 font-bold ${color}`}>
        <Icon aria-hidden="true" />
        {metric.change === 0 ? t("noChange") : `${Math.abs(metric.change)}%`}
      </span>
      <span className="text-slate-500 dark:text-slate-400">
        {t("comparison")}
      </span>
    </div>
  );
}

function DashboardMetricCard({
  definition,
  metric,
  money: formatMoney,
  number: formatNumber,
  t,
}) {
  const Icon = definition.Icon;
  const value = definition.rooms
    ? `${formatNumber(metric.value)} / ${formatNumber(metric.total)}`
    : definition.currency
      ? formatMoney(metric.value)
      : formatNumber(metric.value);
  return (
    <DashboardCard className="p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {definition.label}
          </p>
          <p className="mt-2 truncate text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
            {value}
          </p>
        </div>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-Blue/10 text-xl text-primary-Blue dark:bg-primary-Blue/15">
          <Icon aria-hidden="true" />
        </span>
      </div>
      <p className="mt-2 min-h-5 text-xs text-slate-500 dark:text-slate-400">
        {definition.help}
      </p>
      <MetricTrend metric={metric} t={t} />
    </DashboardCard>
  );
}

function DashboardSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading dashboard"
      className="animate-pulse space-y-7"
    >
      <div className="h-32 rounded-2xl bg-white dark:bg-slate-900" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div
            key={index}
            className="h-44 rounded-2xl bg-white dark:bg-slate-900"
          />
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-3">
        <div className="h-96 rounded-2xl bg-white xl:col-span-2 dark:bg-slate-900" />
        <div className="h-96 rounded-2xl bg-white dark:bg-slate-900" />
      </div>
    </div>
  );
}

function DashboardChartHeader({ title, help }) {
  return (
    <div className="px-5 pb-2 pt-5 sm:px-6">
      <h2 className="text-lg font-bold text-slate-950 dark:text-white">
        {title}
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{help}</p>
    </div>
  );
}

function DashboardChartTooltip({
  active,
  payload,
  label,
  money: formatMoney,
  number: formatNumber,
  date: formatDate,
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 p-3 text-xs shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-950/95">
      <p className="mb-2 font-semibold text-slate-900 dark:text-white">
        {formatDate(label)}
      </p>
      <div className="space-y-1.5">
        {payload.map((item) => (
          <div
            key={item.dataKey}
            className="flex min-w-40 items-center justify-between gap-5"
          >
            <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: item.color,
                  opacity: item.fillOpacity || 1,
                }}
              />
              {item.name}
            </span>
            <strong>
              {CURRENCY_SERIES.has(item.dataKey)
                ? formatMoney(item.value)
                : formatNumber(item.value)}
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardEmptyChart({ children }) {
  return (
    <div className="grid h-72 place-items-center px-6 text-center text-sm text-slate-500 dark:text-slate-400">
      {children}
    </div>
  );
}

function DashboardStatus({ status, t }) {
  const colors = {
    confirmed:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
    completed:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
    ready: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300",
    preparing:
      "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
    cancelled: "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300",
    pending:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  };
  const label = STATUSES.has(status)
    ? t(`statusValues.${status}`)
    : String(status || "—").replaceAll("-", " ");
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${colors[status] || colors.pending}`}
    >
      {label}
    </span>
  );
}

function DashboardRecentTable({
  title,
  href,
  items,
  type,
  money: formatMoney,
  date: formatDate,
  t,
}) {
  return (
    <DashboardCard className="min-w-0 overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-5 dark:border-slate-800 sm:px-6">
        <h2 className="font-bold text-slate-950 dark:text-white">{title}</h2>
        <Link
          href={href}
          className="shrink-0 text-sm font-semibold text-primary-Blue hover:underline"
        >
          {t("viewAll")}
        </Link>
      </div>
      {items.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950/50 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3 sm:px-6">{t("number")}</th>
                <th className="px-4 py-3">{t("date")}</th>
                <th className="px-4 py-3">{t("status")}</th>
                <th className="px-5 py-3 text-right sm:px-6">{t("amount")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {items.map((item) => {
                const recordNumber = item.bookingNumber || item.orderNumber;
                const recordStatus = item.bookingStatus || item.orderStatus;
                return (
                  <tr
                    key={item.documentId || recordNumber}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                  >
                    <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white sm:px-6">
                      {recordNumber}
                    </td>
                    <td className="px-4 py-4 text-slate-500 dark:text-slate-400">
                      {formatDate(
                        item.createdAt || item.orderDate || item.checkIn,
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <DashboardStatus status={recordStatus} t={t} />
                    </td>
                    <td className="px-5 py-4 text-right font-semibold sm:px-6">
                      {formatMoney(item.totalAmount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid min-h-44 place-items-center px-6 text-sm text-slate-500 dark:text-slate-400">
          {t(type === "bookings" ? "noRecentBookings" : "noRecentOrders")}
        </div>
      )}
    </DashboardCard>
  );
}

export default function AdminDashboard() {
  const t = useTranslations("Dashboard");
  const locale = useLocale();
  const localeCode = locale === "km" ? "km-KH" : "en-US";
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [period, setPeriod] = useState("last30");
  const [custom, setCustom] = useState({ from: "", to: "" });
  const [appliedCustom, setAppliedCustom] = useState(null);
  const [retry, setRetry] = useState(0);
  const hasData = useRef(false);
  const requestQuery = useMemo(() => {
    if (period === "custom" && !appliedCustom) return null;
    const params = new URLSearchParams({ period });
    if (period === "custom") {
      params.set("from", appliedCustom.from);
      params.set("to", appliedCustom.to);
    }
    return params.toString();
  }, [appliedCustom, period]);

  useEffect(() => {
    if (!requestQuery) return undefined;
    const controller = new AbortController();
    queueMicrotask(() => {
      if (controller.signal.aborted) return;
      if (hasData.current) setRefreshing(true);
      else setLoading(true);
      setError("");
    });
    fetch(`/api/admin/dashboard?${requestQuery}`, {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok)
          throw new Error(payload.error || "Dashboard data could not load.");
        hasData.current = true;
        setData(payload);
      })
      .catch((requestError) => {
        if (requestError.name !== "AbortError") setError(requestError.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
          setRefreshing(false);
        }
      });
    return () => controller.abort();
  }, [requestQuery, retry]);

  const currency = data?.currency || "USD";
  const formatMoney = useMemo(
    () =>
      new Intl.NumberFormat(localeCode, {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      }).format,
    [currency, localeCode],
  );
  const formatNumber = useMemo(
    () =>
      new Intl.NumberFormat(localeCode, { maximumFractionDigits: 1 }).format,
    [localeCode],
  );
  const formatDate = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(localeCode, {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: data?.timeZone || "Asia/Phnom_Penh",
    });
    return (value) => {
      if (!value) return "—";
      const normalized = /^\d{4}-\d{2}-\d{2}$/.test(value)
        ? `${value}T12:00:00Z`
        : value;
      const parsed = new Date(normalized);
      return Number.isNaN(parsed.getTime()) ? "—" : formatter.format(parsed);
    };
  }, [data?.timeZone, localeCode]);
  const formatChartDate = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(localeCode, {
      month: "short",
      day: "numeric",
    });
    return (value) => formatter.format(new Date(`${value}T12:00:00Z`));
  }, [localeCode]);

  if (loading && !data) return <DashboardSkeleton />;
  if (error && !data)
    return (
      <div
        role="alert"
        className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
      >
        <h1 className="text-xl font-bold">{t("errorTitle")}</h1>
        <p className="mt-2 text-sm">{error}</p>
        <button
          type="button"
          onClick={() => setRetry((value) => value + 1)}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary-Blue px-4 py-2.5 font-semibold text-white"
        >
          <FiRefreshCw />
          {t("retry")}
        </button>
      </div>
    );

  const metrics = data.metrics;
  const definitions = [
    { key: "totalRevenue", Icon: FiCreditCard, currency: true },
    { key: "roomRevenue", Icon: FiHome, currency: true },
    { key: "restaurantRevenue", Icon: FiCoffee, currency: true },
    { key: "todayRevenue", Icon: FiCalendar, currency: true },
    { key: "bookings", Icon: FiClipboard },
    { key: "orders", Icon: FiShoppingBag },
    { key: "customers", Icon: FiUsers },
    { key: "availableRooms", Icon: FiHome, rooms: true },
  ].map((item) => ({
    ...item,
    label: t(`metrics.${item.key}`),
    help:
      item.key === "availableRooms"
        ? t("metrics.availableRoomsHelp", {
            occupied: formatNumber(metrics.availableRooms.occupied),
            total: formatNumber(metrics.availableRooms.total),
          })
        : t(`metrics.${item.key}Help`),
  }));
  const hasRevenue = data.charts.revenue.some((row) => row.total > 0);
  const hasActivity = data.charts.activity.some(
    (row) => row.bookings > 0 || row.orders > 0,
  );
  const updated = new Intl.DateTimeFormat(localeCode, {
    hour: "numeric",
    minute: "2-digit",
    timeZone: data.timeZone,
  }).format(new Date(data.generatedAt));
  const tooltip = (
    <DashboardChartTooltip
      money={formatMoney}
      number={formatNumber}
      date={formatChartDate}
    />
  );

  return (
    <div className="mx-auto max-w-[1600px] space-y-7">
      <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-Blue">
              {t("eyebrow")}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              {t("title")}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              {t("subtitle")}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>{t("updated", { time: updated })}</span>
              <span>· {data.timeZone}</span>
              {refreshing && (
                <span className="font-semibold text-primary-Blue">
                  {t("updating")}
                </span>
              )}
            </div>
          </div>
          <div className="min-w-0 xl:max-w-2xl">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t("periodLabel")}
            </p>
            <div className="flex flex-wrap gap-2">
              {PERIODS.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPeriod(key)}
                  aria-pressed={period === key}
                  className={`rounded-xl border px-3.5 py-2 text-sm font-semibold transition ${period === key ? "border-primary-Blue bg-primary-Blue text-white" : "border-slate-200 bg-white text-slate-600 hover:border-primary-Blue hover:text-primary-Blue dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"}`}
                >
                  {t(`periods.${key}`)}
                </button>
              ))}
            </div>
            {period === "custom" && (
              <form
                className="mt-3 flex flex-col gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-950 sm:flex-row sm:items-end"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (custom.from && custom.to && custom.from <= custom.to)
                    setAppliedCustom(custom);
                }}
              >
                {[
                  ["from", t("from")],
                  ["to", t("to")],
                ].map(([name, label]) => (
                  <label
                    key={name}
                    className="min-w-0 flex-1 text-xs font-semibold text-slate-600 dark:text-slate-300"
                  >
                    {label}
                    <input
                      required
                      type="date"
                      value={custom[name]}
                      onChange={(event) =>
                        setCustom((value) => ({
                          ...value,
                          [name]: event.target.value,
                        }))
                      }
                      className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                    />
                  </label>
                ))}
                <button
                  type="submit"
                  className="rounded-lg bg-primary-Blue px-4 py-2.5 text-sm font-semibold text-white"
                >
                  {t("apply")}
                </button>
              </form>
            )}
          </div>
        </div>
      </header>

      {error && (
        <div
          role="alert"
          className="flex flex-wrap justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setRetry((value) => value + 1)}
            className="font-bold underline"
          >
            {t("retry")}
          </button>
        </div>
      )}
      {data.warnings?.length > 0 && (
        <p
          role="status"
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
        >
          {t("partialWarning", { collections: data.warnings.join(", ") })}
        </p>
      )}

      <section
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label={t("title")}
      >
        {definitions.map((definition) => (
          <DashboardMetricCard
            key={definition.key}
            definition={definition}
            metric={metrics[definition.key]}
            money={formatMoney}
            number={formatNumber}
            t={t}
          />
        ))}
      </section>

      <div className="grid gap-5 xl:grid-cols-3">
        <DashboardCard className="min-w-0 xl:col-span-2">
          <DashboardChartHeader
            title={t("revenueOverview")}
            help={t("revenueOverviewHelp")}
          />
          {hasRevenue ? (
            <div className="h-80 w-full px-1 pb-4 pr-3 sm:h-96 sm:px-3 sm:pr-5">
              <ResponsiveContainer>
                <ComposedChart
                  data={data.charts.revenue}
                  margin={{ top: 20, right: 8, left: 4 }}
                >
                  <CartesianGrid
                    stroke="currentColor"
                    strokeOpacity={0.08}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatChartDate}
                    minTickGap={28}
                    tick={{ fill: "currentColor", fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tickFormatter={formatMoney}
                    width={72}
                    tick={{ fill: "currentColor", fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={tooltip} />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
                  <Bar
                    dataKey="room"
                    name={t("series.room")}
                    stackId="revenue"
                    fill="var(--primary1)"
                  />
                  <Bar
                    dataKey="restaurant"
                    name={t("series.restaurant")}
                    stackId="revenue"
                    fill="var(--primary1)"
                    fillOpacity={0.5}
                  />
                  {data.charts.distribution.some(
                    (item) => item.key === "other",
                  ) && (
                    <Bar
                      dataKey="other"
                      name={t("series.other")}
                      stackId="revenue"
                      fill="var(--primary1)"
                      fillOpacity={0.25}
                    />
                  )}
                  <Line
                    dataKey="total"
                    name={t("series.total")}
                    type="monotone"
                    stroke="var(--primary1)"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <DashboardEmptyChart>{t("noChartData")}</DashboardEmptyChart>
          )}
        </DashboardCard>
        <DashboardCard className="min-w-0">
          <DashboardChartHeader
            title={t("distribution")}
            help={t("distributionHelp")}
          />
          {hasRevenue ? (
            <div className="h-80 px-3 pb-4 sm:h-96">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data.charts.distribution}
                    dataKey="value"
                    nameKey="key"
                    innerRadius="55%"
                    outerRadius="78%"
                    paddingAngle={3}
                    stroke="none"
                  >
                    {data.charts.distribution.map((item, index) => (
                      <Cell
                        key={item.key}
                        fill="var(--primary1)"
                        fillOpacity={[0.95, 0.55, 0.3][index]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [
                      formatMoney(value),
                      t(`series.${name}`),
                    ]}
                    contentStyle={{ borderRadius: 12, fontSize: 12 }}
                  />
                  <Legend
                    formatter={(value) => t(`series.${value}`)}
                    wrapperStyle={{ fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <DashboardEmptyChart>{t("noChartData")}</DashboardEmptyChart>
          )}
        </DashboardCard>
      </div>

      <DashboardCard className="min-w-0">
        <DashboardChartHeader
          title={t("activityOverview")}
          help={t("activityOverviewHelp")}
        />
        {hasActivity ? (
          <div className="h-72 w-full px-1 pb-4 pr-3 sm:h-80 sm:px-3 sm:pr-5">
            <ResponsiveContainer>
              <AreaChart
                data={data.charts.activity}
                margin={{ top: 16, right: 8 }}
              >
                <CartesianGrid
                  stroke="currentColor"
                  strokeOpacity={0.08}
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatChartDate}
                  minTickGap={28}
                  tick={{ fill: "currentColor", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  width={40}
                  tick={{ fill: "currentColor", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={tooltip} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
                <Area
                  dataKey="bookings"
                  name={t("series.bookings")}
                  type="monotone"
                  stroke="var(--primary1)"
                  fill="var(--primary1)"
                  fillOpacity={0.2}
                  strokeWidth={2.5}
                />
                <Area
                  dataKey="orders"
                  name={t("series.orders")}
                  type="monotone"
                  stroke="var(--primary1)"
                  strokeDasharray="6 4"
                  fill="var(--primary1)"
                  fillOpacity={0.07}
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <DashboardEmptyChart>{t("noChartData")}</DashboardEmptyChart>
        )}
      </DashboardCard>

      <div className="grid gap-5 2xl:grid-cols-2">
        <DashboardRecentTable
          title={t("recentBookings")}
          href="/admin/bookings"
          items={data.recent.bookings}
          type="bookings"
          money={formatMoney}
          date={formatDate}
          t={t}
        />
        <DashboardRecentTable
          title={t("recentOrders")}
          href="/admin/orders"
          items={data.recent.orders}
          type="orders"
          money={formatMoney}
          date={formatDate}
          t={t}
        />
      </div>
    </div>
  );
}
