export interface LoginPayload {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginData {
  accessToken?: string;
}
