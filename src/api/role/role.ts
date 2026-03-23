import { request } from "../client";

export interface RolePermission {
  id?: number;
  module: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export interface Role {
  id: string;
  name: string;
  permissions: RolePermission[];
}

export interface RoleListResponse {
  total: number;
  page: number;
  limit: number;
  data: Role[];
}

export interface GetRolesParams {
  search?: string;
  page?: number;
  limit?: number;
}

export async function getRoles(
  params: GetRolesParams = {},
): Promise<RoleListResponse> {
  const query = new URLSearchParams({
    search: params.search ?? "",
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 10),
  });
  return request<RoleListResponse>(`/roles?${query}`);
}

export async function getRole(id: string): Promise<Role> {
  return request<Role>(`/roles/${id}`);
}

export async function createRole(
  data: Omit<Role, "id">,
): Promise<{ message: string; id: number }> {
  return request("/roles", { method: "POST", body: data });
}

export async function updateRole(
  id: string,
  data: Omit<Role, "id">,
): Promise<{ message: string }> {
  return request(`/roles/${id}`, { method: "PUT", body: data });
}

export async function deleteRole(id: string): Promise<{ message: string }> {
  return request(`/roles/${id}`, { method: "DELETE" });
}
