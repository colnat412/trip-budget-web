'use client';

import type { ApiResponse } from '@/base/api';
import {
  useMutationPost,
  useMutationPut,
  useQueryGet,
  type MutationCallbacks,
} from '@/base/hooks';
import type { TripShareSettings, UpdateShareSettingsPayload } from '../types';

export const tripShareKeys = {
  all: ['trip', 'share'] as const,
  detail: (tripId: string | number) =>
    ['trip', 'share', String(tripId)] as const,
};

interface UseTripShareSettingsParams {
  tripId: string | number | null | undefined;
  enabled?: boolean;
}

export const useTripShareSettings = ({
  tripId,
  enabled = true,
}: UseTripShareSettingsParams) => {
  const query = useQueryGet<ApiResponse<TripShareSettings>>({
    queryKey: tripShareKeys.detail(tripId ?? 'none'),
    endPoint: `/trip/${tripId}/share`,
    enabled: enabled && Boolean(tripId),
  });

  return {
    ...query,
    shareSettings: query.data?.data ?? null,
  };
};

export const useUpdateShareSettings = ({
  tripId,
  options,
}: {
  tripId: string | number;
  options?: MutationCallbacks<
    ApiResponse<TripShareSettings>,
    UpdateShareSettingsPayload
  >;
}) => {
  const mutation = useMutationPut<
    ApiResponse<TripShareSettings>,
    UpdateShareSettingsPayload
  >({
    mutationKey: [...tripShareKeys.detail(tripId), 'update'],
    endPoint: `/trip/${tripId}/share`,
    options,
  });

  return {
    ...mutation,
    updateShareSettings: mutation.mutate,
    updateShareSettingsAsync: mutation.mutateAsync,
  };
};

export const useRegenerateShareToken = ({
  tripId,
  options,
}: {
  tripId: string | number;
  options?: MutationCallbacks<
    ApiResponse<TripShareSettings>,
    Record<string, never>
  >;
}) => {
  const mutation = useMutationPost<
    ApiResponse<TripShareSettings>,
    Record<string, never>
  >({
    mutationKey: [...tripShareKeys.detail(tripId), 'regenerate'],
    endPoint: `/trip/${tripId}/share/regenerate`,
    options,
  });

  return {
    ...mutation,
    regenerateShareToken: mutation.mutate,
    regenerateShareTokenAsync: mutation.mutateAsync,
  };
};
