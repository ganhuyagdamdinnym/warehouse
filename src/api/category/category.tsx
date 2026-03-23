import { request } from "../client";

import type {
  CategoryListResponse,
  GetCategoriesParams,
  Category,
} from "../../models/types/category";

export async function getCategories(
  params: GetCategoriesParams = {},
): Promise<CategoryListResponse> {
  const query = new URLSearchParams({
    search: params.search ?? "",
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 10),
  });
  return request<CategoryListResponse>(`/categories?${query}`);
}

export async function getCategory(id: string): Promise<Category> {
  return request<Category>(`/categories/${id}`);
}

export async function createCategory(
  data: Omit<Category, "id" | "parent" | "children">,
): Promise<{ message: string; id: number }> {
  return request("/categories", { method: "POST", body: data });
}

export async function updateCategory(
  id: string,
  data: Omit<Category, "id" | "parent" | "children">,
): Promise<{ message: string }> {
  return request(`/categories/${id}`, { method: "PUT", body: data });
}

export async function deleteCategory(id: string): Promise<{ message: string }> {
  return request(`/categories/${id}`, { method: "DELETE" });
}
