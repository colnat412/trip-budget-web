import axios, { type InternalAxiosRequestConfig } from 'axios';
import { API_URL, PUBLIC_PATHS } from '../constants';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const axiosClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    const url = originalRequest.url || '';
    const isAuthEndpoint =
      url.includes('/auth/login') ||
      url.includes('/auth/refresh') ||
      url.includes('/auth/logout');

    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosClient(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          },
        );

        processQueue(null);
        isRefreshing = false;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        isRefreshing = false;

        if (typeof window !== 'undefined') {
          const currentPath = window.location.pathname;
          const isPublicPage = PUBLIC_PATHS.some(
            (path) =>
              currentPath === path || currentPath.startsWith(`${path}/`),
          );
          if (
            currentPath !== '/login' &&
            currentPath !== '/register' &&
            !isPublicPage
          ) {
            // eslint-disable-next-line @next/next/no-location-assign-relative-destination
            window.location.href = '/login';
          }
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
