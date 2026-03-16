export interface Warehouse {
  id: string;
  code: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  is_active?: number;
}

export interface WarehouseListResponse {
  total: number;
  page: number;
  limit: number;
  data: Warehouse[];
}

export interface GetWarehousesParams {
  search?: string;
  page?: number;
  limit?: number;
}
