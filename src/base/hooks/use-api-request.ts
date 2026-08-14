'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { normalizeApiError, type ApiError } from '@/base/api';

type ApiRequest<TData, TArgs extends unknown[]> = (
  ...args: TArgs
) => Promise<TData>;

export interface UseApiRequestOptions {
  normalizeError?: (error: unknown) => ApiError;
}

export interface UseApiRequestResult<TData, TArgs extends unknown[]> {
  data: TData | null;
  error: ApiError | null;
  loading: boolean;
  execute: (...args: TArgs) => Promise<TData | undefined>;
  clearError: () => void;
  reset: () => void;
}

export default function useApiRequest<TData, TArgs extends unknown[]>(
  request: ApiRequest<TData, TArgs>,
  options: UseApiRequestOptions = {},
): UseApiRequestResult<TData, TArgs> {
  const [data, setData] = useState<TData | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(false);

  const mountedRef = useRef(false);
  const inFlightRef = useRef(false); // prevent multiple request at the same time
  const requestVersionRef = useRef(0);
  const requestRef = useRef(request); // keep newest request
  const errorNormalizerRef = useRef(
    options.normalizeError ?? normalizeApiError,
  ); // keep newest error

  useEffect(() => {
    requestRef.current = request;
  }, [request]);

  useEffect(() => {
    errorNormalizerRef.current = options.normalizeError ?? normalizeApiError;
  }, [options.normalizeError]);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      requestVersionRef.current += 1;
      inFlightRef.current = false;
    };
  }, []);

  const execute = useCallback(async (...args: TArgs) => {
    if (inFlightRef.current) {
      return undefined;
    }

    const requestVersion = requestVersionRef.current + 1;

    requestVersionRef.current = requestVersion;
    inFlightRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const responseData = await requestRef.current(...args);

      if (!mountedRef.current || requestVersionRef.current !== requestVersion) {
        return undefined;
      }

      setData(responseData);
      return responseData;
    } catch (requestError: unknown) {
      const normalizedError = errorNormalizerRef.current(requestError);

      if (mountedRef.current && requestVersionRef.current === requestVersion) {
        setError(normalizedError);
      }

      return undefined;
    } finally {
      if (requestVersionRef.current === requestVersion) {
        inFlightRef.current = false;

        if (mountedRef.current) {
          setLoading(false);
        }
      }
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    requestVersionRef.current += 1;
    inFlightRef.current = false;
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    error,
    loading,
    execute,
    clearError,
    reset,
  };
}
