import { request } from "../client";
import type {
  GetUsersParams,
  UserListResponse,
  User,
  CreateUserBody,
} from "../../models/types/user";

export async function getUsers(
  params: GetUsersParams = {},
): Promise<UserListResponse> {
  const query = new URLSearchParams({
    search: params.search ?? "",
    role: params.role ?? "All",
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 10),
  });
  return request<UserListResponse>(`/users?${query}`);
}

export async function getUser(id: string): Promise<User> {
  return request<User>(`/users/${id}`);
}

export async function createUser(
  data: CreateUserBody,
): Promise<{ message: string; id: number }> {
  return request("/users", { method: "POST", body: data });
}

export async function updateUser(
  id: string,
  data: Partial<CreateUserBody>,
): Promise<{ message: string }> {
  return request(`/users/${id}`, { method: "PUT", body: data });
}

export async function deleteUser(id: string): Promise<{ message: string }> {
  return request(`/users/${id}`, { method: "DELETE" });
}
