export interface TransferItem {
  id?: number;
  name?: string;
  code?: string;
  weight?: string;
  quantity?: string;
  unit?: string;
}

export interface Transfer {
  id: string;
  code: string;
  date: string;
  status: "Draft" | "Completed" | "Pending";
  fromWarehouseId: number;
  toWarehouseId: number;
  // Хэрэв Backend-ээс агуулахын объект ирж байгаа бол:
  fromWarehouse?: { name: string };
  toWarehouse?: { name: string };
  user?: string;
  details?: string;
  items?: TransferItem[];
}

export interface TransferListResponse {
  total: number;
  page: number;
  limit: number;
  data: Transfer[];
}

export interface GetTransfersParams {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}
