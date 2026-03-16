import { request } from "../client";
import type {
  GetWarehousesParams,
  WarehouseListResponse,
  Warehouse,
} from "../../models/types/warehouse";

export async function getWarehouses(
  params: GetWarehousesParams = {},
): Promise<WarehouseListResponse> {
  const query = new URLSearchParams({
    search: params.search ?? "",
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 10),
  });
  return request<WarehouseListResponse>(`/warehouses?${query}`);
}

export async function getWarehouse(id: string): Promise<Warehouse> {
  return request<Warehouse>(`/warehouses/${id}`);
}

export async function createWarehouse(
  data: Omit<Warehouse, "id">,
): Promise<{ message: string; id: number }> {
  return request("/warehouses", { method: "POST", body: data });
}

export async function updateWarehouse(
  id: string,
  data: Omit<Warehouse, "id">,
): Promise<{ message: string }> {
  return request(`/warehouses/${id}`, { method: "PUT", body: data });
}

export async function deleteWarehouse(
  id: string,
): Promise<{ message: string }> {
  return request(`/warehouses/${id}`, { method: "DELETE" });
}
