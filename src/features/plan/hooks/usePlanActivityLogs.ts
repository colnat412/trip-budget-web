'use client';

import type { ApiResponse } from '@/base/api';
import { useQueryGet } from '@/base/hooks';
import type { PlanActivityLog } from '../types';

export interface UsePlanActivityLogsParams {
  tripId?: number | string | null;
  enabled?: boolean;
}

const usePlanActivityLogs = ({
  tripId,
  enabled = true,
}: UsePlanActivityLogsParams) => {
  const query = useQueryGet<ApiResponse<PlanActivityLog[]>>({
    queryKey: ['trip', 'plan', 'activity-logs', tripId ?? 'none'],
    endPoint: `/trip/${tripId}/plan/activities/logs`,
    enabled: Boolean(tripId) && enabled,
  });

  return {
    ...query,
    logs: query.data?.data ?? [],
  };
};

export default usePlanActivityLogs;
