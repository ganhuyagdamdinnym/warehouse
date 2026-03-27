// api/item/item_trail_api.ts
import { request } from "../client";

export interface TrailItem {
  id: number;
  createdAt: string;
  type: "CHECKIN" | "CHECKOUT" | "TRANSFER_IN" | "TRANSFER_OUT" | "ADJUSTMENT";
  quantity: number;
  warehouseFrom?: string;
  warehouseTo?: string;
  referenceCode?: string;
  note?: string;
  item: {
    id: number;
    name: string;
    internalCode?: string;
  };
}

export interface TrailListResponse {
  total: number;
  page: number;
  limit: number;
  data: TrailItem[];
}

export interface StockSummary {
  item: { id: number; name: string; stock: number; internalCode?: string };
  totalStock: number;
  warehouseStocks: {
    warehouseId: number;
    warehouseName: string;
    warehouseCode: string;
    quantity: number;
    updatedAt: string;
  }[];
}

export interface GetTrailParams {
  page?: number;
  limit?: number;
  warehouseId?: number;
}

export async function getItemTrail(
  itemId: string,
  params: GetTrailParams = {},
): Promise<TrailListResponse> {
  const query = new URLSearchParams({
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 10),
    ...(params.warehouseId ? { warehouseId: String(params.warehouseId) } : {}),
  });
  return request<TrailListResponse>(`/items/${itemId}/trail?${query}`);
}

export async function getItemStockSummary(
  itemId: string,
): Promise<StockSummary> {
  return request<StockSummary>(`/items/${itemId}/trail/summary`);
}
