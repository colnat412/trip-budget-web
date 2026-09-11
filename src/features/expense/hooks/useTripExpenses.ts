'use client';

import type { ApiResponse } from '@/base/api';
import { useQueryGet } from '@/base/hooks';
import { expenseQueryKeys } from '../constants/expense-keys';
import type { Expense, PageResponse } from '../types';

interface UseTripExpensesParams {
  tripId?: number | string | null;
  page?: number;
  size?: number;
  enabled?: boolean;
}

export default function useTripExpenses({
  tripId,
  page = 0,
  size = 10,
  enabled = true,
}: UseTripExpensesParams) {
  const isEnabled = enabled && Boolean(tripId);

  const query = useQueryGet<ApiResponse<PageResponse<Expense>>>({
    queryKey: [...expenseQueryKeys.tripExpenses(tripId), page, size],
    endPoint: `/trip/${tripId}/expenses`,
    config: {
      params: { page, size },
    },
    enabled: isEnabled,
  });

  return {
    ...query,
    expenses: query.data?.data?.items ?? [],
    pagination: query.data?.data?.pagination ?? null,
  };
}
