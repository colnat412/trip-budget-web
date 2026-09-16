'use client';

import type { AxiosRequestConfig } from 'axios';

import { axiosPost } from '@/base/api';

import useMutationRequest, {
  type MutationCallbacks,
  type MutationKey,
} from './use-mutation-request';

interface UseMutationPostParams<TResponse, TPayload> {
  mutationKey: MutationKey;
  endPoint: string;
  options?: MutationCallbacks<TResponse, TPayload>;
  getEndPoint?: (endPoint: string, payload: TPayload) => string;
  getPayload?: (endPoint: string, payload: TPayload) => unknown;
  config?: AxiosRequestConfig;
}

const useMutationPost = <TResponse, TPayload>({
  mutationKey,
  endPoint,
  options,
  getEndPoint,
  getPayload,
  config,
}: UseMutationPostParams<TResponse, TPayload>) => {
  return useMutationRequest<TResponse, TPayload>({
    mutationKey,
    options,
    mutationFn: (payload) =>
      axiosPost<TResponse>(
        getEndPoint?.(endPoint, payload) ?? endPoint,
        getPayload?.(endPoint, payload) ?? payload,
        config,
      ),
  });
};

export default useMutationPost;
