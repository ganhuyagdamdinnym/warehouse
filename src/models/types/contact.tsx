export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  details?: string;
}

export interface ContactListResponse {
  total: number;
  page: number;
  limit: number;
  data: Contact[];
}

export interface GetContactsParams {
  search?: string;
  page?: number;
  limit?: number;
}
