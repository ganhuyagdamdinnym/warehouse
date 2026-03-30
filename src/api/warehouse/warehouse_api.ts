import { request } from "../client";
import type {
  GetWarehousesParams,
  WarehouseListResponse,
  Warehouse,
} from "../../models/types/warehouse";

// api/warehouse/warehouse_items_api.ts

export interface WarehouseStockItem {
  id: number;
  quantity: number;
  updatedAt: string;
  isLowStock: boolean;
  item: {
    id: number;
    name: string;
    internalCode?: string;
    sku?: string;
    category?: string;
    unit?: string;
    stockAlert?: number;
    image?: string;
  };
  warehouse: {
    id: number;
    name: string;
    code: string;
  };
}

export interface WarehouseItemsResponse {
  total: number;
  page: number;
  limit: number;
  data: WarehouseStockItem[];
}

export interface GetWarehouseItemsParams {
  search?: string;
  page?: number;
  limit?: number;
}

export async function getWarehouseItems(
  warehouseId: string,
  params: GetWarehouseItemsParams = {},
): Promise<WarehouseItemsResponse> {
  const query = new URLSearchParams({
    search: params.search ?? "",
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 10),
  });
  return request<WarehouseItemsResponse>(
    `/warehouses/${warehouseId}/items?${query}`,
  );
}

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
