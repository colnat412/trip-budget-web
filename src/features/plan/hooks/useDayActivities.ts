'use client';

import { useInfiniteQueryGet } from '@/base/hooks';
import type { PlanActivity } from '../types';

export const DAY_ACTIVITIES_PAGE_SIZE = 10;

export interface UseDayActivitiesParams {
  tripId?: number | string | null;
  dayId?: number | string | null;
  enabled?: boolean;
}

const useDayActivities = ({
  tripId,
  dayId,
  enabled = true,
}: UseDayActivitiesParams) => {
  const query = useInfiniteQueryGet<PlanActivity>({
    queryKey: [
      'trip',
      'plan',
      'day-activities',
      tripId ?? 'none',
      dayId ?? 'none',
    ],
    endPoint: `/trip/${tripId}/plan/days/${dayId}/activities`,
    pageSize: DAY_ACTIVITIES_PAGE_SIZE,
    enabled: Boolean(tripId) && Boolean(dayId) && enabled,
    getItemKey: (activity) => activity.id,
  });

  return {
    ...query,
    activities: query.items,
  };
};

export default useDayActivities;
