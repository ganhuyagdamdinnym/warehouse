import { request } from "../client";
import type {
  UnitListResponse,
  GetUnitsParams,
  Unit,
} from "../../models/types/unit";

export async function getUnits(
  params: GetUnitsParams = {},
): Promise<UnitListResponse> {
  const query = new URLSearchParams({
    search: params.search ?? "",
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 100),
  });
  return request<UnitListResponse>(`/units?${query}`);
}

export async function getUnit(id: string): Promise<Unit> {
  return request<Unit>(`/units/${id}`);
}

export async function createUnit(
  data: Omit<Unit, "id" | "parent">,
): Promise<{ message: string; id: number }> {
  return request("/units", { method: "POST", body: data });
}

export async function updateUnit(
  id: string,
  data: Omit<Unit, "id" | "parent">,
): Promise<{ message: string }> {
  return request(`/units/${id}`, { method: "PUT", body: data });
}

export async function deleteUnit(id: string): Promise<{ message: string }> {
  return request(`/units/${id}`, { method: "DELETE" });
}
