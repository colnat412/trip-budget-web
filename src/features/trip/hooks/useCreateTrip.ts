'use client';

import type { ApiResponse } from '@/base/api';
import { useMutationPost, type MutationCallbacks } from '@/base/hooks';
import { tripMutationKeys } from '../constants/trip-keys';
import type { CreateTripPayload, Trip } from '../types';

export default function useCreateTrip(
  options?: MutationCallbacks<ApiResponse<Trip>, CreateTripPayload>,
) {
  const createMutation = useMutationPost<ApiResponse<Trip>, CreateTripPayload>({
    mutationKey: tripMutationKeys.create,
    endPoint: '/trip/create',
    options,
  });

  return {
    ...createMutation,
    createMutation,
  };
}
