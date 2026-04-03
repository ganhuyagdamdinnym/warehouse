import { API_BASE_URL } from "./config";

export type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestOptions {
  method?: RequestMethod;
  body?: unknown;
  headers?: Record<string, string>;
}

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}
// ── Token авах ───────────────────────────────────────
const getToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, headers = {} } = options;
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;

  const token = getToken();

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      // ── Token автоматаар нэмэгдэнэ ──────────────
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  };

  if (body !== undefined && method !== "GET") {
    config.body = JSON.stringify(body);
  }

  const res = await fetch(url, config);
  const data = await res.json().catch(() => ({}));

  // ── 401 бол автоматаар logout ────────────────────
  if (res.status === 401) {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login";
    throw new ApiError("Нэвтрэх шаардлагатай", 401, data);
  }

  if (!res.ok) {
    throw new ApiError(
      (data as { error?: string; message?: string })?.error ||
        (data as { error?: string; message?: string })?.message ||
        res.statusText ||
        "API error",
      res.status,
      data,
    );
  }

  return data as T;
}
