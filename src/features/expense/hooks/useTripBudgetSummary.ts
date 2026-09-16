'use client';

import type { ApiResponse } from '@/base/api';
import { useQueryGet } from '@/base/hooks';
import { expenseQueryKeys } from '../constants/expense-keys';
import type { TripBudgetSummary } from '../types';

interface UseTripBudgetSummaryParams {
  tripId?: number | string | null;
  enabled?: boolean;
}

const useTripBudgetSummary = ({
  tripId,
  enabled = true,
}: UseTripBudgetSummaryParams) => {
  const isEnabled = enabled && Boolean(tripId);

  const query = useQueryGet<ApiResponse<TripBudgetSummary>>({
    queryKey: expenseQueryKeys.tripSummary(tripId),
    endPoint: `/trip/${tripId}/expenses/summary`,
    enabled: isEnabled,
  });

  return {
    ...query,
    summary: query.data?.data ?? null,
  };
};

export default useTripBudgetSummary;
