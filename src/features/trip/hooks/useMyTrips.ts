'use client';

import type { ApiResponse } from '@/base/api';
import { useQueryGet } from '@/base/hooks';
import { tripQueryKeys } from '../constants/trip-keys';
import type { PageResponse, Trip } from '../types';

export interface UseMyTripsParams {
  page?: number;
  size?: number;
  search?: string;
  name?: string;
  destination?: string;
  currency?: string;
  status?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  sort?: string;
  enabled?: boolean;
}

const useMyTrips = (params?: UseMyTripsParams) => {
  const page = params?.page ?? 0;
  const size = params?.size ?? 10;
  const search = params?.search;
  const name = params?.name;
  const destination = params?.destination;
  const currency = params?.currency;
  const status = params?.status;
  const sortBy = params?.sortBy;
  const sortDirection = params?.sortDirection;
  const enabled = params?.enabled ?? true;

  const queryParams: Record<string, string | number> = {
    page,
    size,
  };
  if (search) queryParams.search = search;
  if (name) queryParams.name = name;
  if (destination) queryParams.destination = destination;
  if (currency) queryParams.currency = currency;
  if (status) queryParams.status = status;
  if (sortBy) queryParams.sortBy = sortBy;
  if (sortDirection) queryParams.sortDirection = sortDirection;

  const query = useQueryGet<ApiResponse<PageResponse<Trip>>>({
    queryKey: [
      ...tripQueryKeys.myTrips,
      page,
      size,
      search ?? '',
      name ?? '',
      destination ?? '',
      currency ?? '',
      status ?? '',
      sortBy ?? '',
      sortDirection ?? '',
    ],
    endPoint: '/trip/my-trips',
    config: {
      params: queryParams,
    },
    enabled,
  });

  return {
    ...query,
    trips: query.data?.data?.items ?? [],
    pagination: query.data?.data?.pagination ?? null,
  };
};

export default useMyTrips;
