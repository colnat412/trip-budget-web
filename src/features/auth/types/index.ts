export interface UserProfile {
  id: number | string;
  email: string;
  name: string;
  role?: string;
  avatarUrl?: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginData {
  accessToken?: string;
  user?: UserProfile | null;
}
