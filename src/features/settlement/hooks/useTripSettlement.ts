'use client';

import type { ApiResponse } from '@/base/api';
import {
  useMutationDelete,
  useMutationPost,
  useQueryGet,
  type MutationCallbacks,
} from '@/base/hooks';
import { settlementQueryKeys } from '../constants/settlement-keys';
import type {
  CreateSettlementRequest,
  Settlement,
  TripSettlementSummary,
} from '../types';

export interface UseTripSettlementSummaryParams {
  tripId?: number | string | null;
  enabled?: boolean;
}

export function useTripSettlementSummary({
  tripId,
  enabled = true,
}: UseTripSettlementSummaryParams) {
  const isEnabled = enabled && Boolean(tripId);

  const query = useQueryGet<ApiResponse<TripSettlementSummary>>({
    queryKey: settlementQueryKeys.summary(tripId),
    endPoint: `/trip/${tripId}/settlement`,
    enabled: isEnabled,
  });

  return {
    ...query,
    summary: query.data?.data ?? null,
  };
}

export interface UseCreateSettlementParams {
  tripId: number | string;
  options?: MutationCallbacks<ApiResponse<Settlement>, CreateSettlementRequest>;
}

export function useCreateSettlement({
  tripId,
  options,
}: UseCreateSettlementParams) {
  const mutation = useMutationPost<
    ApiResponse<Settlement>,
    CreateSettlementRequest
  >({
    mutationKey: ['settlement', 'create', tripId],
    endPoint: `/trip/${tripId}/settlement`,
    options,
  });

  return {
    ...mutation,
    createSettlement: mutation.mutate,
    createSettlementAsync: mutation.mutateAsync,
  };
}

export interface DeleteSettlementPayload {
  settlementId: string;
}

export interface UseDeleteSettlementParams {
  tripId: number | string;
  options?: MutationCallbacks<ApiResponse<null>, DeleteSettlementPayload>;
}

export function useDeleteSettlement({
  tripId,
  options,
}: UseDeleteSettlementParams) {
  const mutation = useMutationDelete<
    ApiResponse<null>,
    DeleteSettlementPayload
  >({
    mutationKey: ['settlement', 'delete', tripId],
    endPoint: `/trip/${tripId}/settlement`,
    getEndPoint: (endPoint, payload) => `${endPoint}/${payload.settlementId}`,
    options,
  });

  return {
    ...mutation,
    deleteSettlement: mutation.mutate,
    deleteSettlementAsync: mutation.mutateAsync,
  };
}
