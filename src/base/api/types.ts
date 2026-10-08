export interface ApiResponse<TData> {
  status: number;
  message: string;
  data: TData;
}

export interface ApiErrorResponse {
  status?: number;
  message?: string;
  data?: unknown;
}

export interface PagePagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

export interface PageResponse<TItem> {
  items: TItem[];
  pagination: PagePagination;
}
