import { request } from "../client";
import type {
  Transfer,
  GetTransfersParams,
  TransferListResponse,
} from "../../models/types/transfer";

export async function getTransfers(
  params: GetTransfersParams = {},
): Promise<TransferListResponse> {
  const query = new URLSearchParams({
    search: params.search ?? "",
    status: params.status ?? "All",
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 10),
  });
  return request<TransferListResponse>(`/transfers?${query}`);
}

export async function getTransfer(id: string): Promise<Transfer> {
  return request<Transfer>(`/transfers/${id}`);
}

export async function createTransfer(
  data: Omit<Transfer, "id">,
): Promise<{ message: string; id: number }> {
  return request("/transfers", { method: "POST", body: data });
}

export async function updateTransfer(
  id: string,
  data: Omit<Transfer, "id">,
): Promise<{ message: string }> {
  return request(`/transfers/${id}`, { method: "PUT", body: data });
}

export async function deleteTransfer(id: string): Promise<{ message: string }> {
  return request(`/transfers/${id}`, { method: "DELETE" });
}
