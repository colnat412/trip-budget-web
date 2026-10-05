export const AUTH_COOKIE_NAMES = [
  'access_token',
  'refresh_token',
  'auth_token',
  'session_token',
] as const;

export const PUBLIC_AUTH_PATHS = [
  '/login',
  '/register',
  '/forgot-password',
] as const;

export const PUBLIC_PATHS = ['/share'] as const;

export const DEFAULT_AUTH_REDIRECT_PATH = '/overview';
export const DEFAULT_UNAUTH_REDIRECT_PATH = '/login';
