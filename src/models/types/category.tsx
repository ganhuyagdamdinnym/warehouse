export interface Category {
  id: string;
  name: string;
  code?: string;
  parentId?: string | null;
  parent?: { id: string; name: string } | null;
  children?: { id: string; name: string }[];
}

export interface CategoryListResponse {
  total: number;
  page: number;
  limit: number;
  data: Category[];
}

export interface GetCategoriesParams {
  search?: string;
  page?: number;
  limit?: number;
}
