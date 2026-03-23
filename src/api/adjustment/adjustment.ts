import { request } from "../client";
import type {
  AdjustmentListResponse,
  GetAdjustmentsParams,
  Adjustment,
} from "../../models/types/adjustment";

export async function getAdjustments(
  params: GetAdjustmentsParams = {},
): Promise<AdjustmentListResponse> {
  const query = new URLSearchParams({
    search: params.search ?? "",
    status: params.status ?? "All",
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 10),
  });
  return request<AdjustmentListResponse>(`/adjustments?${query}`);
}

export async function getAdjustment(id: string): Promise<Adjustment> {
  return request<Adjustment>(`/adjustments/${id}`);
}

export async function createAdjustment(
  data: Omit<Adjustment, "id">,
): Promise<{ message: string; id: number }> {
  return request("/adjustments", { method: "POST", body: data });
}

export async function updateAdjustment(
  id: string,
  data: Omit<Adjustment, "id">,
): Promise<{ message: string }> {
  return request(`/adjustments/${id}`, { method: "PUT", body: data });
}

export async function deleteAdjustment(
  id: string,
): Promise<{ message: string }> {
  return request(`/adjustments/${id}`, { method: "DELETE" });
}
