/**
 * Warehouse API – single entry for backend calls.
 * Use api/config for base URL, api/client for low-level request.
 */

export { API_BASE_URL } from "./config";
export { request, ApiError } from "./client";
export type { RequestOptions, RequestMethod } from "./client";

export {
  getCheckins,
  getCheckin,
  createCheckin,
  updateCheckin,
  deleteCheckin,
} from "./checkin/checkins";
export type {
  // Checkin,
  // CheckinItem,
  // CheckinListResponse,
  GetCheckinsParams,
} from "./checkin/checkins";
