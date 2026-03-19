import { request } from "../client";
import type {
  Item,
  ItemListResponse,
  GetItemsParams,
} from "../../models/types/item";

export async function getItems(
  params: GetItemsParams = {},
): Promise<ItemListResponse> {
  const query = new URLSearchParams({
    search: params.search ?? "",
    category: params.category ?? "",
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 10),
  });
  return request<ItemListResponse>(`/items?${query}`);
}

export async function getItem(id: string): Promise<Item> {
  return request<Item>(`/items/${id}`);
}

export async function createItem(
  data: Omit<Item, "id" | "createdAt">,
): Promise<{ message: string; id: number }> {
  return request("/items", { method: "POST", body: data });
}

export async function updateItem(
  id: string,
  data: Omit<Item, "id" | "createdAt">,
): Promise<{ message: string }> {
  return request(`/items/${id}`, { method: "PUT", body: data });
}

export async function deleteItem(id: string): Promise<{ message: string }> {
  return request(`/items/${id}`, { method: "DELETE" });
}
