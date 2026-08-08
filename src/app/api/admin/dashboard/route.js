import { requireApiAdmin } from "@/lib/auth";
import { buildDashboardData } from "@/lib/dashboard-data";
import { apiErrorResponse, strapi } from "@/lib/strapi";

function records(payload) {
  return Array.isArray(payload) ? payload : payload?.data || [];
}

function withPage(path, page) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}pagination[page]=${page}&pagination[pageSize]=1000`;
}

async function fetchAll(path, token) {
  const firstPayload = await strapi.get(withPage(path, 1), { token });
  const firstPage = records(firstPayload);
  const pageCount = Number(firstPayload?.meta?.pagination?.pageCount || 1);
  if (pageCount <= 1) return firstPage;

  const remainingPayloads = await Promise.all(
    Array.from({ length: pageCount - 1 }, (_, index) =>
      strapi.get(withPage(path, index + 2), { token }),
    ),
  );
  return [firstPage, ...remainingPayloads.map(records)].flat();
}

const COLLECTIONS = {
  payments:
    "/api/payments?fields[0]=documentId&fields[1]=paymentNumber&fields[2]=paymentType&fields[3]=amount&fields[4]=currency&fields[5]=status&fields[6]=paidAt&fields[7]=createdAt",
  rooms: "/api/rooms?fields[0]=documentId&fields[1]=status&fields[2]=available",
  bookings:
    "/api/bookings?fields[0]=documentId&fields[1]=bookingNumber&fields[2]=bookingStatus&fields[3]=totalAmount&fields[4]=checkIn&fields[5]=createdAt",
  orders:
    "/api/food-orders?fields[0]=documentId&fields[1]=orderNumber&fields[2]=orderStatus&fields[3]=totalAmount&fields[4]=orderDate&fields[5]=createdAt",
  users: "/api/users?fields[0]=id&fields[1]=createdAt",
};

export async function GET(request) {
  try {
    const guard = await requireApiAdmin();
    if (guard.response) return guard.response;

    const query = new URL(request.url).searchParams;
    const timeZone = process.env.RESORT_TIMEZONE || "Asia/Phnom_Penh";
    const entries = Object.entries(COLLECTIONS);
    const results = await Promise.allSettled(
      entries.map(([, path]) => fetchAll(path, guard.auth.token)),
    );
    const availableCount = results.filter(
      (result) => result.status === "fulfilled",
    ).length;
    if (availableCount === 0) throw results[0].reason;

    const collections = {};
    const warnings = [];
    results.forEach((result, index) => {
      const name = entries[index][0];
      if (result.status === "fulfilled") collections[name] = result.value;
      else {
        collections[name] = [];
        warnings.push(name);
      }
    });

    let dashboard;
    try {
      dashboard = buildDashboardData({
        ...collections,
        period: query.get("period") || "last30",
        from: query.get("from") || undefined,
        to: query.get("to") || undefined,
        timeZone,
      });
    } catch (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ ...dashboard, warnings });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
