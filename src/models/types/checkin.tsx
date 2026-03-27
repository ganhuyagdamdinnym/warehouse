export interface CheckinItem {
  id?: number;
  checkin_id?: number;
  name?: string;
  code?: string;
  weight?: string;
  quantity?: string;
  productId?: number; // ← нэм
}

export interface Checkin {
  id: number;
  code: string;
  date: string;
  status: "Draft" | "Completed" | "Pending";
  contact?: string;
  warehouse?: string;
  warehouseId?: number; // ← нэм
  user?: string;
  details?: string;
  created_at?: string;
  items: CheckinItem[];
}

export interface CheckinListResponse {
  total: number;
  page: number;
  limit: number;
  data: Checkin[];
}

// Create үед ашиглах
export interface CreateCheckinPayload {
  code: string;
  date: string;
  status: "Draft" | "Completed" | "Pending";
  contact?: string;
  warehouse?: string;
  warehouseId?: number; // ← нэм
  user?: string;
  details?: string;
  items: {
    productId?: number;
    name?: string;
    code?: string;
    weight?: string;
    quantity?: string;
  }[];
}
