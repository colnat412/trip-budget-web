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

interface InFlightRequestEntry {
  promise: Promise<unknown>;
  sharedAbortController: AbortController;
  subscribers: Set<AbortController>;
}

const inFlightRequests = new Map<string, InFlightRequestEntry>();

const useQueryGet = <TResponse>({
  queryKey,
  endPoint,
  enabled = true,
  options,
  getEndPoint,
  config,
}: UseQueryGetParams<TResponse>) => {
  const [data, setData] = useState<TResponse | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const mountedRef = useRef(false);
  const requestVersionRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const requestRef = useRef({ queryKey, endPoint, options, getEndPoint, config });

  const queryKeyValue = JSON.stringify(queryKey);

  useEffect(() => {
    requestRef.current = { queryKey, endPoint, options, getEndPoint, config };
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
    const resolvedEndPoint =
      currentRequest.getEndPoint?.(currentRequest.endPoint) ??
      currentRequest.endPoint;
    const serializedQueryKey = JSON.stringify(currentRequest.queryKey);
    const cacheKey = `${serializedQueryKey}::${resolvedEndPoint}::${JSON.stringify(currentRequest.config?.params ?? {})}`;

    const localAbortController = new AbortController();
    abortControllerRef.current?.abort();
    abortControllerRef.current = localAbortController;
    requestVersionRef.current = requestVersion;
    setIsFetching(true);
    setError(null);

    let entry = inFlightRequests.get(cacheKey);

    if (!entry) {
      const sharedAbortController = new AbortController();
      const subscribers = new Set<AbortController>([localAbortController]);

      // merge many requests to the same endpoint into a single request
      const fetchPromise = axiosGet<TResponse>(resolvedEndPoint, {
        ...currentRequest.config,
        signal: sharedAbortController.signal,
      }).finally(() => {
        inFlightRequests.delete(cacheKey);
      });

      entry = {
        promise: fetchPromise,
        sharedAbortController,
        subscribers,
      };
      inFlightRequests.set(cacheKey, entry);
    } else {
      entry.subscribers.add(localAbortController);
    }

    const currentEntry = entry;
    const onLocalAbort = () => {
      currentEntry.subscribers.delete(localAbortController);
      if (currentEntry.subscribers.size === 0) {
        currentEntry.sharedAbortController.abort();
        inFlightRequests.delete(cacheKey);
      }
    };

    localAbortController.signal.addEventListener('abort', onLocalAbort, {
      once: true,
    });

    try {
      let responseData: TResponse;

      try {
        responseData = (await currentEntry.promise) as TResponse;
        if (localAbortController.signal.aborted) {
          throw new DOMException('Aborted', 'AbortError');
        }
      } catch (requestError: unknown) {
        const apiError = normalizeApiError(requestError);
        const isCurrentRequest =
          mountedRef.current &&
          requestVersionRef.current === requestVersion;

        if (isCurrentRequest && !localAbortController.signal.aborted) {
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

      if (isCurrentRequest && !localAbortController.signal.aborted) {
        setData(responseData);
        await currentRequest.options?.onSuccess?.(responseData);
      }

      return responseData;
    } finally {
      localAbortController.signal.removeEventListener('abort', onLocalAbort);
      currentEntry.subscribers.delete(localAbortController);

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
};

export default useQueryGet;
