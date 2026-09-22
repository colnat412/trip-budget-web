'use client';

import type { ApiResponse } from '@/base/api';
import { useQueryGet } from '@/base/hooks';
import type { TripPlanOverview } from '../types';

export interface UseTripPlanParams {
  tripId?: number | string | null;
  enabled?: boolean;
}

const useTripPlan = ({ tripId, enabled = true }: UseTripPlanParams) => {
  const query = useQueryGet<ApiResponse<TripPlanOverview>>({
    queryKey: ['trip', 'plan', tripId ?? 'none'],
    endPoint: `/trip/${tripId}/plan`,
    enabled: Boolean(tripId) && enabled,
  });

  return {
    ...query,
    plan: query.data?.data ?? null,
  };
};

export default useTripPlan;
