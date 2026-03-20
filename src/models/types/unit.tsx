export interface Unit {
  id: string;
  name: string;
  code: string;
  parentId?: number;
  parent?: { id: string; name: string; code: string };
}

export interface UnitListResponse {
  total: number;
  page: number;
  limit: number;
  data: Unit[];
}

export interface GetUnitsParams {
  search?: string;
  page?: number;
  limit?: number;
}
