import { request } from "../client";
import type { TotalListResponse } from "../../models/types/dashboard";

export const getTotals = async (): Promise<TotalListResponse> => {
  return request<TotalListResponse>(`/totals`);
};
