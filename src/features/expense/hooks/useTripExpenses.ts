'use client';

import type { ApiResponse } from '@/base/api';
import { useQueryGet } from '@/base/hooks';
import { expenseQueryKeys } from '../constants/expense-keys';
import type { Expense, PageResponse } from '../types';

export interface UseTripExpensesParams {
  tripId?: number | string | null;
  page?: number;
  size?: number;
  search?: string;
  title?: string;
  category?: string;
  payer?: string;
  splitType?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  sort?: string;
  enabled?: boolean;
}

export default function useTripExpenses({
  tripId,
  page = 0,
  size = 10,
  search,
  title,
  category,
  payer,
  splitType,
  sortBy,
  sortDirection,
  sort,
  enabled = true,
}: UseTripExpensesParams) {
  const isEnabled = enabled && Boolean(tripId);
  const effectiveSort =
    sort || (sortBy ? `${sortBy},${sortDirection || 'asc'}` : undefined);

  const queryParams: Record<string, string | number> = {
    page,
    size,
  };
  if (search) queryParams.search = search;
  if (title) queryParams.title = title;
  if (category) queryParams.category = category;
  if (payer) queryParams.payer = payer;
  if (splitType) queryParams.splitType = splitType;
  if (sortBy) queryParams.sortBy = sortBy;
  if (sortDirection) queryParams.sortDirection = sortDirection;
  if (effectiveSort) queryParams.sort = effectiveSort;

  const query = useQueryGet<ApiResponse<PageResponse<Expense>>>({
    queryKey: [
      ...expenseQueryKeys.tripExpenses(tripId),
      page,
      size,
      search ?? '',
      title ?? '',
      category ?? '',
      payer ?? '',
      splitType ?? '',
      sortBy ?? '',
      sortDirection ?? '',
    ],
    endPoint: `/trip/${tripId}/expenses`,
    config: {
      params: queryParams,
    },
    enabled: isEnabled,
  });

  return {
    ...query,
    expenses: query.data?.data?.items ?? [],
    pagination: query.data?.data?.pagination ?? null,
  };
}
