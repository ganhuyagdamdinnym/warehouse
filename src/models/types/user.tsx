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
export interface UpdatePasswordBody {
  currentPassword: string;
  newPassword: string;
}export interface UpdateProfilePayload {
  name?: string;
  email?: string;
}
 
export interface UpdateProfileResponse {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    superAdmin: boolean;
    warehouse: string;
  };
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
