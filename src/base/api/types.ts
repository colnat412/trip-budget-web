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
