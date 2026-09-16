'use client';

import type { ApiResponse } from '@/base/api';
import {
  useMutationPost,
  useMutationPut,
  type MutationCallbacks,
} from '@/base/hooks';
import { tripMutationKeys } from '../constants/trip-keys';
import type { CreateTripPayload, Trip, UpdateTripPayload } from '../types';

export interface UseUpdateTripParams {
  tripId: number | string;
  options?: MutationCallbacks<ApiResponse<Trip>, UpdateTripPayload>;
}

export interface UseDeleteTripParams {
  tripId: number | string;
  options?: MutationCallbacks<ApiResponse<null>, Record<string, never>>;
}

export function useCreateTrip(
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
    createTrip: createMutation.mutate,
    createTripAsync: createMutation.mutateAsync,
  };
}

export function useUpdateTrip({ tripId, options }: UseUpdateTripParams) {
  const updateMutation = useMutationPut<ApiResponse<Trip>, UpdateTripPayload>({
    mutationKey: tripMutationKeys.update(tripId),
    endPoint: `/trip/${tripId}`,
    options,
  });

  return {
    ...updateMutation,
    updateMutation,
    updateTrip: updateMutation.mutate,
    updateTripAsync: updateMutation.mutateAsync,
  };
}

export function useDeleteTrip({ tripId, options }: UseDeleteTripParams) {
  const deleteMutation = useMutationPut<
    ApiResponse<null>,
    Record<string, never>
  >({
    mutationKey: tripMutationKeys.delete(tripId),
    endPoint: `/trip/delete/${tripId}`,
    options,
  });

  return {
    ...deleteMutation,
    deleteMutation,
    deleteTrip: deleteMutation.mutate,
    deleteTripAsync: deleteMutation.mutateAsync,
  };
}

const useTripMutation = () => {
  return {
    useCreateTrip,
    useUpdateTrip,
    useDeleteTrip,
  };
};

export default useTripMutation;
