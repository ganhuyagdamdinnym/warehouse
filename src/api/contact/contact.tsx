import { request } from "../client";
import type {
  GetContactsParams,
  ContactListResponse,
  Contact,
} from "../../models/types/contact";

export async function getContacts(
  params: GetContactsParams = {},
): Promise<ContactListResponse> {
  const query = new URLSearchParams({
    search: params.search ?? "",
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 10),
  });
  return request<ContactListResponse>(`/contacts?${query}`);
}

export async function getContact(id: string): Promise<Contact> {
  return request<Contact>(`/contacts/${id}`);
}

export async function createContact(
  data: Omit<Contact, "id">,
): Promise<{ message: string; id: number }> {
  return request("/contacts", { method: "POST", body: data });
}

export async function updateContact(
  id: string,
  data: Omit<Contact, "id">,
): Promise<{ message: string }> {
  return request(`/contacts/${id}`, { method: "PUT", body: data });
}

export async function deleteContact(id: string): Promise<{ message: string }> {
  return request(`/contacts/${id}`, { method: "DELETE" });
}
