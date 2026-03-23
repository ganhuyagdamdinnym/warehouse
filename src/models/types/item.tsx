export interface Item {
  id: string;
  name: string;
  internalCode?: string;
  barcode?: string;
  barcodeType?: string;
  sku?: string;
  category?: string;
  unit?: string;
  location?: string;
  description?: string;
  image?: string;
  trackStock?: boolean;
  stockAlert?: number;
  createdAt?: string;
  stock?: number;
}

export interface ItemListResponse {
  total: number;
  page: number;
  limit: number;
  data: Item[];
}

export interface GetItemsParams {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}
