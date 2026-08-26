export const HTTP_HOST = process.env.NEXT_PUBLIC_APP_BASE_URL || '';
export const API_URL = `${HTTP_HOST}/api`;

export * from './auth';
