import { request } from "../client";
import type {
  Checkout,
  CheckoutItem,
  CheckoutListResponse,
} from "../../models/types/checkout";

function normalizeCheckout(raw: Record<string, unknown>): Checkout {
  const c = raw as unknown as Checkout & { id?: number };
  return {
    ...c,
    id: String(c.id ?? c),
    items: (c.items || []).map((i: CheckoutItem & { id?: number }) => ({
      ...i,
      id: i.id,
    })),
  };
}

function normalizeList(res: {
  total: number;
  page: number;
  limit: number;
  data?: unknown[];
}): CheckoutListResponse {
  return {
    total: res.total,
    page: res.page,
    limit: res.limit,
    data: (res.data || []).map((c) =>
      normalizeCheckout(c as Record<string, unknown>),
    ),
  };
}

// --- API ---

export interface GetCheckoutsParams {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export async function getCheckouts(
  params: GetCheckoutsParams = {},
): Promise<CheckoutListResponse> {
  const query = new URLSearchParams({
    search: params.search ?? "",
    status: params.status ?? "All",
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 10),
  });
  const res = await request<{
    total: number;
    page: number;
    limit: number;
    data?: unknown[];
  }>(`/checkouts?${query}`);
  return normalizeList(res);
}

export async function getCheckout(id: string): Promise<Checkout> {
  const res = await request<Record<string, unknown>>(`/checkouts/${id}`);
  return normalizeCheckout(res);
}

export async function createCheckout(
  data: Omit<Checkout, "id">,
): Promise<{ message: string; id: number }> {
  return request("/checkouts", { method: "POST", body: data });
}

export async function updateCheckout(
  id: string,
  data: Omit<Checkout, "id">,
): Promise<{ message: string }> {
  return request(`/checkouts/${id}`, { method: "PUT", body: data });
}

export async function deleteCheckout(id: string): Promise<{ message: string }> {
  return request(`/checkouts/${id}`, { method: "DELETE" });
}
