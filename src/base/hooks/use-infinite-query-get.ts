'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import {
  axiosGet,
  normalizeApiError,
  type ApiError,
  type ApiResponse,
  type PageResponse,
  type QueryKey,
} from '@/base/api';

interface UseInfiniteQueryGetParams<TItem> {
  queryKey: QueryKey;
  endPoint: string;
  pageSize?: number;
  enabled?: boolean;
  params?: Record<string, unknown>;
  getItemKey?: (item: TItem) => string | number; // remove same item when the new data was inserted
}

const useInfiniteQueryGet = <TItem>({
  queryKey,
  endPoint,
  pageSize = 10,
  enabled = true,
  params,
  getItemKey,
}: UseInfiniteQueryGetParams<TItem>) => {
  const queryKeyValue = JSON.stringify(queryKey);

  const [items, setItems] = useState<TItem[]>([]);
  const [dataKey, setDataKey] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [error, setError] = useState<ApiError | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  const mountedRef = useRef(false);
  const requestRef = useRef({ endPoint, pageSize, params, getItemKey });
  const itemsRef = useRef<TItem[]>([]); // newest list to read
  const lastPageRef = useRef(-1);
  const hasNextPageRef = useRef(false);
  const versionRef = useRef(0);
  const controllersRef = useRef(new Set<AbortController>());
  const nextPagePromiseRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    requestRef.current = { endPoint, pageSize, params, getItemKey };
  });

  useEffect(() => {
    mountedRef.current = true;
    const controllers = controllersRef.current;

    return () => {
      mountedRef.current = false;
      versionRef.current += 1;
      controllers.forEach((controller) => controller.abort());
      controllers.clear();
    };
  }, []);

  const abortAll = useCallback(() => {
    controllersRef.current.forEach((controller) => controller.abort());
    controllersRef.current.clear();
  }, []);

  const loadPages = useCallback(
    async (pages: number[], mode: 'replace' | 'append') => {
      const version = versionRef.current;
      const controller = new AbortController();
      controllersRef.current.add(controller);
      const { endPoint, pageSize, params, getItemKey } = requestRef.current;

      setError(null);

      try {
        const responses = await Promise.all(
          pages.map((page) =>
            axiosGet<ApiResponse<PageResponse<TItem>>>(endPoint, {
              params: { ...params, page, size: pageSize },
              signal: controller.signal,
            }),
          ),
        );

        if (!mountedRef.current || version !== versionRef.current) return;

        const fetchedItems = responses.flatMap((res) => res.data?.items ?? []);
        const merged =
          mode === 'replace'
            ? fetchedItems
            : [...itemsRef.current, ...fetchedItems];

        let nextItems = merged;
        if (getItemKey) {
          const seen = new Set<string | number>();
          nextItems = merged.filter((item) => {
            const key = getItemKey(item);
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
        }

        const lastPagination =
          responses[responses.length - 1]?.data?.pagination;

        itemsRef.current = nextItems;
        lastPageRef.current = pages[pages.length - 1];
        hasNextPageRef.current = Boolean(lastPagination?.hasNext);

        setItems(nextItems);
        setHasNextPage(hasNextPageRef.current);
        setTotalElements(lastPagination?.totalElements ?? nextItems.length);
      } catch (requestError: unknown) {
        if (
          !mountedRef.current ||
          version !== versionRef.current ||
          controller.signal.aborted
        ) {
          return;
        }
        setError(normalizeApiError(requestError));
      } finally {
        controllersRef.current.delete(controller);
      }
    },
    [],
  );

  const resetAndLoad = useCallback(
    async (nextDataKey: string) => {
      versionRef.current += 1;
      abortAll();
      nextPagePromiseRef.current = null;
      itemsRef.current = [];
      lastPageRef.current = -1;
      hasNextPageRef.current = false;

      setItems([]);
      setDataKey(nextDataKey);
      setHasNextPage(false);
      setTotalElements(0);
      setIsFetchingNextPage(false);
      setIsFetching(true);

      const version = versionRef.current;
      await loadPages([0], 'replace');
      if (mountedRef.current && version === versionRef.current) {
        setIsFetching(false);
      }
    },
    [abortAll, loadPages],
  );

  const fetchNextPage = useCallback(async (): Promise<void> => {
    if (nextPagePromiseRef.current) return nextPagePromiseRef.current;
    if (!hasNextPageRef.current) return;

    const version = versionRef.current;
    setIsFetchingNextPage(true);

    const promise = loadPages([lastPageRef.current + 1], 'append').finally(
      () => {
        if (mountedRef.current && version === versionRef.current) {
          nextPagePromiseRef.current = null;
          setIsFetchingNextPage(false);
        }
      },
    );

    nextPagePromiseRef.current = promise;
    return promise;
  }, [loadPages]);

  const fetchAllPages = useCallback(async (): Promise<TItem[]> => {
    const version = versionRef.current;

    while (hasNextPageRef.current && version === versionRef.current) {
      const pageBefore = lastPageRef.current;
      await fetchNextPage();
      // Stop when error request, not loop infinitive
      if (lastPageRef.current === pageBefore) break;
    }

    return itemsRef.current;
  }, [fetchNextPage]);

  const refetch = useCallback(async (): Promise<void> => {
    versionRef.current += 1;
    abortAll();
    nextPagePromiseRef.current = null;
    setIsFetchingNextPage(false);
    setIsFetching(true);

    const lastPage = Math.max(lastPageRef.current, 0);
    const pages = Array.from({ length: lastPage + 1 }, (_, index) => index);

    const version = versionRef.current;
    await loadPages(pages, 'replace');
    if (mountedRef.current && version === versionRef.current) {
      setIsFetching(false);
    }
  }, [abortAll, loadPages]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void resetAndLoad(queryKeyValue);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [enabled, queryKeyValue, resetAndLoad]);

  const isStale = dataKey !== queryKeyValue;

  return {
    queryKey,
    items: isStale ? [] : items,
    totalElements: isStale ? 0 : totalElements,
    hasNextPage: !isStale && hasNextPage,
    error,
    isFetching,
    isFetchingNextPage,
    isLoading: enabled && (isStale || (isFetching && items.length === 0)),
    fetchNextPage,
    fetchAllPages,
    refetch,
  };
};

export default useInfiniteQueryGet;
