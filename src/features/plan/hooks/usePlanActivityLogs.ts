'use client';

import { useInfiniteQueryGet } from '@/base/hooks';
import type { PlanActivityLog } from '../types';

export const ACTIVITY_LOGS_PAGE_SIZE = 20;

export interface UsePlanActivityLogsParams {
  tripId?: number | string | null;
  enabled?: boolean;
}

const usePlanActivityLogs = ({
  tripId,
  enabled = true,
}: UsePlanActivityLogsParams) => {
  const query = useInfiniteQueryGet<PlanActivityLog>({
    queryKey: ['trip', 'plan', 'activity-logs', tripId ?? 'none'],
    endPoint: `/trip/${tripId}/plan/activities/logs`,
    pageSize: ACTIVITY_LOGS_PAGE_SIZE,
    enabled: Boolean(tripId) && enabled,
    getItemKey: (log) => log.id,
  });

  return {
    ...query,
    logs: query.items,
  };
};

export default usePlanActivityLogs;
