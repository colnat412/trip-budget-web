'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import {
  ApiError,
  normalizeApiError,
  type QueryKey,
} from '@/base/api';

export type MutationKey = QueryKey;

export interface MutationCallbacks<TResponse, TPayload> {
  onSuccess?: (data: TResponse, payload: TPayload) => void | Promise<void>;
  onError?: (error: ApiError, payload: TPayload) => void | Promise<void>;
}

interface UseMutationRequestParams<TResponse, TPayload> {
  mutationKey: MutationKey;
  mutationFn: (payload: TPayload) => Promise<TResponse>;
  options?: MutationCallbacks<TResponse, TPayload>;
}

const useMutationRequest = <TResponse, TPayload>({
  mutationKey,
  mutationFn,
  options,
}: UseMutationRequestParams<TResponse, TPayload>) => {
  const [data, setData] = useState<TResponse | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isPending, setIsPending] = useState(false);
  const mountedRef = useRef(false);
  const inFlightRef = useRef(false);
  const mutationFnRef = useRef(mutationFn);
  const optionsRef = useRef(options);

  useEffect(() => {
    mutationFnRef.current = mutationFn;
    optionsRef.current = options;
  });

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const mutateAsync = async (
    payload: TPayload,
    callbacks?: MutationCallbacks<TResponse, TPayload>,
  ): Promise<TResponse> => {
    if (inFlightRef.current) {
      throw new ApiError('A request is already in progress.', null);
    }

    inFlightRef.current = true;
    setIsPending(true);
    setError(null);

    try {
      let responseData: TResponse;

      try {
        responseData = await mutationFnRef.current(payload);
      } catch (requestError: unknown) {
        const apiError = normalizeApiError(requestError);

        if (mountedRef.current) {
          setError(apiError);
        }

        await Promise.allSettled([
          optionsRef.current?.onError?.(apiError, payload),
          callbacks?.onError?.(apiError, payload),
        ]);
        throw apiError;
      }

      if (mountedRef.current) {
        setData(responseData);
      }

      await optionsRef.current?.onSuccess?.(responseData, payload);
      await callbacks?.onSuccess?.(responseData, payload);
      return responseData;
    } finally {
      inFlightRef.current = false;

      if (mountedRef.current) {
        setIsPending(false);
      }
    }
  };

  const mutate = (
    payload: TPayload,
    callbacks?: MutationCallbacks<TResponse, TPayload>,
  ) => {
    void mutateAsync(payload, callbacks).catch(() => undefined);
  };

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return {
    mutationKey,
    data,
    error,
    isPending,
    mutate,
    mutateAsync,
    reset,
    clearError,
  };
};

export default useMutationRequest;
