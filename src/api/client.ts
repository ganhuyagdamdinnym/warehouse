import { API_BASE_URL } from "./config";

export type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestOptions {
  method?: RequestMethod;
  body?: unknown;
  headers?: Record<string, string>;
}

export class ApiError extends Error {
  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Shared API request helper. Uses API_BASE_URL and JSON.
 */
export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, headers = {} } = options;
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };
  if (body !== undefined && method !== "GET") {
    config.body = JSON.stringify(body);
  }

  const res = await fetch(url, config);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(
      (data as { error?: string })?.error || res.statusText || "API error",
      res.status,
      data,
    );
  }

  return data as T;
}
