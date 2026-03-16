import { request } from "../client";
import type {
  Checkin,
  CheckinItem,
  CheckinListResponse,
} from "../../models/types/checkin";

/** Normalize id to string (backend may return number). */
function normalizeCheckin(raw: Record<string, unknown>): Checkin {
  const c = raw as unknown as Checkin & { id?: number };
  return {
    ...c,
    id: String(c.id ?? c),
    items: (c.items || []).map((i: CheckinItem & { id?: number }) => ({
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
}): CheckinListResponse {
  return {
    total: res.total,
    page: res.page,
    limit: res.limit,
    data: (res.data || []).map((c) =>
      normalizeCheckin(c as Record<string, unknown>),
    ),
  };
}

// --- API ---

export interface GetCheckinsParams {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export async function getCheckins(
  params: GetCheckinsParams = {},
): Promise<CheckinListResponse> {
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
  }>(`/checkins?${query}`);
  return normalizeList(res);
}

export async function getCheckin(id: string): Promise<Checkin> {
  const res = await request<Record<string, unknown>>(`/checkins/${id}`);
  return normalizeCheckin(res);
}

export async function createCheckin(
  data: Omit<Checkin, "id">,
): Promise<{ message: string; id: number }> {
  return request("/checkins", { method: "POST", body: data });
}

export async function updateCheckin(
  id: string,
  data: Omit<Checkin, "id">,
): Promise<{ message: string }> {
  return request(`/checkins/${id}`, { method: "PUT", body: data });
}

export async function deleteCheckin(id: string): Promise<{ message: string }> {
  return request(`/checkins/${id}`, { method: "DELETE" });
}
