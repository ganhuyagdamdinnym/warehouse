import { request } from "../client";
import type {
  Checkin,
  CheckinItem,
  CheckinListResponse,
  CreateCheckinPayload,
} from "../../models/types/checkin";

// Өгөгдлийг форматлах функц (ID-г string болгох анхны логик хэвээр)
function normalizeCheckin(raw: Record<string, unknown>): Checkin {
  const c = raw as any;
  return {
    ...c,
    id: String(c.id ?? ""),
    items: (c.items || []).map((i: any) => ({
      ...i,
      id: i.id,
      productId: i.productId, // Моделд нэмэгдсэн талбар
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

export interface GetCheckinsParams {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

// Бүх checkin-уудыг авах
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

// Нэг checkin-ийн дэлгэрэнгүй
export async function getCheckin(id: string): Promise<Checkin> {
  const res = await request<Record<string, unknown>>(`/checkins/${id}`);
  return normalizeCheckin(res);
}

export async function createCheckin(
  data: CreateCheckinPayload,
): Promise<{ message: string; id: number }> {
  // body: JSON.stringify(data) байсныг body: data болгож өөрчлөв
  return request("/checkins", {
    method: "POST",
    body: data,
  });
}

export async function updateCheckin(
  id: string,
  data: CreateCheckinPayload,
): Promise<{ message: string }> {
  return request(`/checkins/${id}`, {
    method: "PUT",
    body: data,
  });
}
// Устгах
export async function deleteCheckin(id: string): Promise<{ message: string }> {
  return request(`/checkins/${id}`, {
    method: "DELETE",
  });
}
