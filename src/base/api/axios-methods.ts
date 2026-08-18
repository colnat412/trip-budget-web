import type { AxiosRequestConfig } from 'axios';

import { axiosClient } from './axios-client';

export async function axiosGet<TResponse>(
  endPoint: string,
  config?: AxiosRequestConfig,
): Promise<TResponse> {
  const response = await axiosClient.get<TResponse>(endPoint, config);

  return response.data;
}

export async function axiosPost<TResponse, TPayload = unknown>(
  endPoint: string,
  payload: TPayload,
  config?: AxiosRequestConfig,
): Promise<TResponse> {
  const response = await axiosClient.post<TResponse>(
    endPoint,
    payload,
    config,
  );

  return response.data;
}

export async function axiosPut<TResponse, TPayload = unknown>(
  endPoint: string,
  payload: TPayload,
  config?: AxiosRequestConfig,
): Promise<TResponse> {
  const response = await axiosClient.put<TResponse>(endPoint, payload, config);

  return response.data;
}

export async function axiosDelete<TResponse, TPayload = unknown>(
  endPoint: string,
  payload: TPayload,
  config?: AxiosRequestConfig,
): Promise<TResponse> {
  const response = await axiosClient.delete<TResponse>(endPoint, {
    ...config,
    data: payload,
  });

  return response.data;
}
