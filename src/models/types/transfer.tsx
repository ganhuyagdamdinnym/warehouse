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
  fromWarehouse: string;
  toWarehouse: string;
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
