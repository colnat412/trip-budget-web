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

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface RegisterData {
  success: boolean;
  email: string;
  message: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface ResendOtpPayload {
  email: string;
}

export interface GoogleLoginPayload {
  credential: string;
}
