'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { AxiosRequestConfig } from 'axios';

import {
  axiosGet,
  normalizeApiError,
  type ApiError,
  type QueryKey,
} from '@/base/api';

interface QueryCallbacks<TResponse> {
  onSuccess?: (data: TResponse) => void | Promise<void>;
  onError?: (error: ApiError) => void | Promise<void>;
}

interface UseQueryGetParams<TResponse> {
  queryKey: QueryKey;
  endPoint: string;
  enabled?: boolean;
  options?: QueryCallbacks<TResponse>;
  getEndPoint?: (endPoint: string) => string;
  config?: AxiosRequestConfig;
}

export default function useQueryGet<TResponse>({
  queryKey,
  endPoint,
  enabled = true,
  options,
  getEndPoint,
  config,
}: UseQueryGetParams<TResponse>) {
  const [data, setData] = useState<TResponse | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const mountedRef = useRef(false);
  const requestVersionRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const requestRef = useRef({ endPoint, options, getEndPoint, config });

  const queryKeyValue = JSON.stringify(queryKey);

  useEffect(() => {
    requestRef.current = { endPoint, options, getEndPoint, config };
  });

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      requestVersionRef.current += 1;
      abortControllerRef.current?.abort();
    };
  }, []);

  const refetch = useCallback(async (): Promise<TResponse> => {
    const requestVersion = requestVersionRef.current + 1;
    const currentRequest = requestRef.current;
    const abortController = new AbortController();

    abortControllerRef.current?.abort();
    abortControllerRef.current = abortController;
    requestVersionRef.current = requestVersion;
    setIsFetching(true);
    setError(null);

    try {
      let responseData: TResponse;

      try {
        responseData = await axiosGet<TResponse>(
          currentRequest.getEndPoint?.(currentRequest.endPoint) ??
            currentRequest.endPoint,
          {
            ...currentRequest.config,
            signal: abortController.signal,
          },
        );
      } catch (requestError: unknown) {
        const apiError = normalizeApiError(requestError);
        const isCurrentRequest =
          mountedRef.current &&
          requestVersionRef.current === requestVersion;

        if (isCurrentRequest) {
          setError(apiError);
          await Promise.allSettled([
            currentRequest.options?.onError?.(apiError),
          ]);
        }

        throw apiError;
      }

      const isCurrentRequest =
        mountedRef.current &&
        requestVersionRef.current === requestVersion;

      if (isCurrentRequest) {
        setData(responseData);
        await currentRequest.options?.onSuccess?.(responseData);
      }

      return responseData;
    } finally {
      if (
        mountedRef.current &&
        requestVersionRef.current === requestVersion
      ) {
        setIsFetching(false);
        abortControllerRef.current = null;
      }
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void refetch().catch(() => undefined);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [enabled, queryKeyValue, refetch]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    queryKey,
    data,
    error,
    isFetching,
    isLoading: isFetching && data === null,
    refetch,
    clearError,
  };
}
