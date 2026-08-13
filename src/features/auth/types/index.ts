export interface LoginPayload {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginData {
  accessToken?: string;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  status: number;
  message: string;
  data: null;
}
