'use client';

import type { ApiResponse } from '@/base/api';
import { useQueryGet } from '@/base/hooks';
import { tripQueryKeys } from '../constants/trip-keys';
import type { PageResponse, Trip } from '../types';

interface UseMyTripsParams {
  page?: number;
  size?: number;
  enabled?: boolean;
}

export default function useMyTrips(params?: UseMyTripsParams) {
  const page = params?.page ?? 0;
  const size = params?.size ?? 10;
  const enabled = params?.enabled ?? true;

  const query = useQueryGet<ApiResponse<PageResponse<Trip>>>({
    queryKey: [...tripQueryKeys.myTrips, page, size],
    endPoint: '/trip/my-trips',
    config: {
      params: { page, size },
    },
    enabled,
  });

  return {
    ...query,
    trips: query.data?.data?.items ?? [],
    pagination: query.data?.data?.pagination ?? null,
  };
}
