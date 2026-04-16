import { request } from "../client";
import type {
  GetUsersParams,
  UserListResponse,
  User,
  CreateUserBody,
  UpdatePasswordBody,
  UpdateProfilePayload,
  UpdateProfileResponse,
} from "../../models/types/user";
import { getToken } from "../../utils/auth";

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

export async function getUserInfo(): Promise<{ message: string }> {
  return request(`/userInfo`, { method: "GET" });
}

//update infos

export async function updateProfile(
  data: UpdateProfilePayload,
): Promise<UpdateProfileResponse> {
  return request("/users/updateProfile", {
    method: "POST",
    body: data,
  });
}
export async function updatePassword(
  data: UpdatePasswordBody,
): Promise<{ message: string }> {
  const token = getToken(); // Энд шууд токеноо авч байна

  // Хэрэв Backend 5000 порт дээр бол:
  return request(`http://localhost:3000/api/users/updatePassword`, {
    method: "POST",
    body: data,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}
export async function changeLogo(data: {
  logoImage: string;
}): Promise<{ message: string }> {
  const token = getToken();
  return request(`/users/changeLogo`, {
    method: "POST",
    body: data,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}
