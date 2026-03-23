export interface AdjustmentItem {
  id?: number;
  name: string;
  weight: number;
  quantity: number;
  unit: string;
}

export interface Adjustment {
  id: string;
  code: string;
  date: string;
  status: "Draft" | "Completed" | "Pending";
  contact: string;
  warehouse: string;
  details: string;
  items: AdjustmentItem[];
}

export interface AdjustmentListResponse {
  total: number;
  page: number;
  limit: number;
  data: Adjustment[];
}

export interface GetAdjustmentsParams {
  search?: string;
  status?: "All" | "Draft" | "Non-Draft";
  page?: number;
  limit?: number;
}
