'use client';

import type { AxiosRequestConfig } from 'axios';

import { axiosDelete } from '@/base/api';

import useMutationRequest, {
  type MutationCallbacks,
  type MutationKey,
} from './use-mutation-request';

interface UseMutationDeleteParams<TResponse, TPayload> {
  mutationKey: MutationKey;
  endPoint: string;
  options?: MutationCallbacks<TResponse, TPayload>;
  getEndPoint?: (endPoint: string, payload: TPayload) => string;
  getPayload?: (endPoint: string, payload: TPayload) => unknown;
  config?: AxiosRequestConfig;
}

export default function useMutationDelete<TResponse, TPayload>({
  mutationKey,
  endPoint,
  options,
  getEndPoint,
  getPayload,
  config,
}: UseMutationDeleteParams<TResponse, TPayload>) {
  return useMutationRequest<TResponse, TPayload>({
    mutationKey,
    options,
    mutationFn: (payload) =>
      axiosDelete<TResponse>(
        getEndPoint?.(endPoint, payload) ?? endPoint,
        getPayload?.(endPoint, payload) ?? payload,
        config,
      ),
  });
}
