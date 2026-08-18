'use client';

import type { AxiosRequestConfig } from 'axios';

import { axiosPut } from '@/base/api';

import useMutationRequest, {
  type MutationCallbacks,
  type MutationKey,
} from './use-mutation-request';

interface UseMutationPutParams<TResponse, TPayload> {
  mutationKey: MutationKey;
  endPoint: string;
  options?: MutationCallbacks<TResponse, TPayload>;
  getEndPoint?: (endPoint: string, payload: TPayload) => string;
  getPayload?: (endPoint: string, payload: TPayload) => unknown;
  config?: AxiosRequestConfig;
}

export default function useMutationPut<TResponse, TPayload>({
  mutationKey,
  endPoint,
  options,
  getEndPoint,
  getPayload,
  config,
}: UseMutationPutParams<TResponse, TPayload>) {
  return useMutationRequest<TResponse, TPayload>({
    mutationKey,
    options,
    mutationFn: (payload) =>
      axiosPut<TResponse>(
        getEndPoint?.(endPoint, payload) ?? endPoint,
        getPayload?.(endPoint, payload) ?? payload,
        config,
      ),
  });
}
