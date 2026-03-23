// dashboard.api.ts
import { request } from "../client";

export interface StatItem {
  value: number;
  growth: string;
  up: boolean;
  sub: string;
}

export interface DashboardResponse {
  checkins: StatItem;
  checkouts: StatItem;
  items: StatItem;
  contacts: StatItem;
  warehouses: StatItem;
  transfers: StatItem;
  adjustments: StatItem;
  users: StatItem;
}

export async function getDashboard(): Promise<DashboardResponse> {
  return request<DashboardResponse>("/dashboard");
}

// activity.api.ts

export type ActivityType = "checkin" | "checkout" | "adjustment";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  code: string;
  description: string;
  status: string;
  created_at: string;
}

export interface ActivityResponse {
  data: ActivityItem[];
}

export async function getRecentActivity(limit = 5): Promise<ActivityResponse> {
  return request<ActivityResponse>(`/dashboard/activity?limit=${limit}`);
}
