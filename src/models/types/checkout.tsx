export interface CheckoutItem {
  id?: number;
  name: string;
  code: string;
  weight: string;
  quantity: string;
}

export interface Checkout {
  id: string;
  code: string;
  date: string;
  status: "Draft" | "Completed" | "Pending";
  contact: string;
  warehouse: string;
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
