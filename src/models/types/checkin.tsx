export interface CheckinItem {
  id?: number;
  name: string;
  code: string;
  weight: string;
  quantity: string;
}

export interface Checkin {
  id: string;
  code: string;
  date: string;
  status: "Draft" | "Completed" | "Pending";
  contact: string;
  warehouse: string;
  user: string;
  details: string;
  items: CheckinItem[];
}

export interface CheckinListResponse {
  total: number;
  page: number;
  limit: number;
  data: Checkin[];
}
