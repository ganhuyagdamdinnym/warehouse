export interface CheckoutItem {
  id?: number;
  name: string;
  code: string;
  productId?: number;
  weight: string;
  quantity: string;
}

export interface Checkout {
  // [x: string]: Checkout;
  id: string;
  code: string;
  date: string;
  status: "Draft" | "Completed" | "Pending";
  contact: string;
  warehouse: string;
  warehouseId: number | null;
  user: string;
  details: string;
  items: CheckoutItem[];
}

export interface CheckoutListResponse {
  total: number;
  page: number;
  limit: number;
  data: Checkout[];
}
