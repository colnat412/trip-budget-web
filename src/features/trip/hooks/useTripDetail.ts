'use client';

import type { ApiResponse } from '@/base/api';
import { useQueryGet } from '@/base/hooks';
import { tripQueryKeys } from '../constants/trip-keys';
import type { Trip } from '../types';

interface UseTripDetailParams {
  tripId: number | string | null;
  enabled?: boolean;
}

const useTripDetail = ({
  tripId,
  enabled = true,
}: UseTripDetailParams) => {
  const query = useQueryGet<ApiResponse<Trip>>({
    queryKey: tripQueryKeys.detail(tripId ?? 'none'),
    endPoint: `/trip/${tripId}`,
    enabled: enabled && Boolean(tripId),
  });

  return {
    ...query,
    trip: query.data?.data ?? null,
  };
};

export default useTripDetail;
