import { request } from "../client";
import type {
  Checkin,
  CheckinListResponse,
  CreateCheckinPayload,
} from "../../models/types/checkin";

// --- Normalize функцүүд хэвээрээ ---
function normalizeCheckin(raw: Record<string, unknown>): Checkin {
  const c = raw as any;
  return {
    ...c,
    id: String(c.id ?? ""),
    items: (c.items || []).map((i: any) => ({
      ...i,
      id: i.id,
      productId: i.productId,
    })),
  };
}

function normalizeList(res: any): CheckinListResponse {
  return {
    total: res.total || 0,
    page: res.page || 1,
    limit: res.limit || 10,
    data: (res.data || []).map((c: any) => normalizeCheckin(c)),
  };
}

// 1. Params-т Headers нэмэх
export interface GetCheckinsParams {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
  headers?: Record<string, string>; // Нэмэгдсэн
}

// 2. Бүх checkin-уудыг авах
export async function getCheckins(
  params: GetCheckinsParams = {},
): Promise<CheckinListResponse> {
  const { headers, ...rest } = params; // Header-ийг салгаж авах

  const query = new URLSearchParams({
    search: rest.search ?? "",
    status: rest.status ?? "All",
    page: String(rest.page ?? 1),
    limit: String(rest.limit ?? 10),
  });

  const res = await request<any>(`/checkins?${query}`, {
    method: "GET",
    headers: headers, // Request-рүү дамжуулах
  });
  return normalizeList(res);
}

// 3. Нэг checkin-ийн дэлгэрэнгүй
export async function getCheckin(
  id: string,
  options?: { headers?: Record<string, string> },
): Promise<Checkin> {
  const res = await request<Record<string, unknown>>(`/checkins/${id}`, {
    headers: options?.headers,
  });
  return normalizeCheckin(res);
}

// 4. Үүсгэх
export async function createCheckin(
  data: CreateCheckinPayload,
  options?: { headers?: Record<string, string> },
): Promise<{ message: string; id: number }> {
  return request("/checkins", {
    method: "POST",
    body: data,
    headers: options?.headers,
  });
}

// 5. Засах
export async function updateCheckin(
  id: string,
  data: CreateCheckinPayload,
  options?: { headers?: Record<string, string> },
): Promise<{ message: string }> {
  return request(`/checkins/${id}`, {
    method: "PUT",
    body: data,
    headers: options?.headers,
  });
}

// 6. Устгах
export async function deleteCheckin(
  id: string,
  options?: { headers?: Record<string, string> },
): Promise<{ message: string }> {
  return request(`/checkins/${id}`, {
    method: "DELETE",
    headers: options?.headers,
  });
}
