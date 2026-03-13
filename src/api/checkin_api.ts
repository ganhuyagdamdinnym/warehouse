const BASE_URL = "http://localhost:3000/api";

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

// Бүх checkin авах
export const getCheckins = async (params: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<CheckinListResponse> => {
  const query = new URLSearchParams({
    search: params.search || "",
    status: params.status || "All",
    page: String(params.page || 1),
    limit: String(params.limit || 10),
  });
  const res = await fetch(`${BASE_URL}/checkins?${query}`);
  return res.json();
};

// Шинэ checkin үүсгэх
export const createCheckin = async (data: Omit<Checkin, "id">) => {
  const res = await fetch(`${BASE_URL}/checkins`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

// Checkin засах
export const updateCheckin = async (id: string, data: Omit<Checkin, "id">) => {
  const res = await fetch(`${BASE_URL}/checkins/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

// Checkin устгах
export const deleteCheckin = async (id: string) => {
  const res = await fetch(`${BASE_URL}/checkins/${id}`, {
    method: "DELETE",
  });
  return res.json();
};
