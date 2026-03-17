export type UserPermission = "canView" | "canEdit" | "nothing";

export interface User {
  id: string;
  name: string;
  userName: string;
  email?: string;
  phone?: string;
  warehouse: string;
  permission: UserPermission;
  superAdmin: boolean;
  createdAt?: string;
}

export interface CreateUserBody {
  name: string;
  userName: string;
  password: string;
  email?: string;
  phone?: string;
  warehouse: string;
  permission?: UserPermission;
  superAdmin?: boolean;
}

export interface UserListResponse {
  total: number;
  page: number;
  limit: number;
  data: User[];
}

export interface GetUsersParams {
  search?: string;
  role?: "All" | "SuperAdmin" | "User";
  page?: number;
  limit?: number;
}
