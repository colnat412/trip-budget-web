'use client';

import type { ApiResponse } from '@/base/api';
import {
  useMutationDelete,
  useMutationPost,
  useMutationPut,
  useQueryGet,
  type MutationCallbacks,
} from '@/base/hooks';
import type {
  InviteMemberPayload,
  TripMember,
  UpdateRolePayload,
} from '../types/member.types';

export interface UseTripMembersParams {
  tripId?: number | string | null;
  enabled?: boolean;
}

export function useTripMembers({
  tripId,
  enabled = true,
}: UseTripMembersParams) {
  const isEnabled = enabled && Boolean(tripId);

  const query = useQueryGet<ApiResponse<TripMember[]>>({
    queryKey: ['trip-members', tripId],
    endPoint: `/trip/${tripId}/members`,
    enabled: isEnabled,
  });

  return {
    ...query,
    members: query.data?.data ?? [],
    activeMembers: (query.data?.data ?? []).filter(
      (m) => m.status === 'ACTIVE',
    ),
  };
}

export interface UseInviteMemberParams {
  tripId: number | string;
  options?: MutationCallbacks<ApiResponse<TripMember>, InviteMemberPayload>;
}

export function useInviteMember({ tripId, options }: UseInviteMemberParams) {
  const mutation = useMutationPost<
    ApiResponse<TripMember>,
    InviteMemberPayload
  >({
    mutationKey: ['trip-members', 'invite', tripId],
    endPoint: `/trip/${tripId}/members`,
    options,
  });

  return {
    ...mutation,
    inviteMember: mutation.mutate,
    inviteMemberAsync: mutation.mutateAsync,
  };
}

export interface UseUpdateMemberRoleParams {
  tripId: number | string;
  memberId: number | string;
  options?: MutationCallbacks<ApiResponse<TripMember>, UpdateRolePayload>;
}

export function useUpdateMemberRole({
  tripId,
  memberId,
  options,
}: UseUpdateMemberRoleParams) {
  const mutation = useMutationPut<ApiResponse<TripMember>, UpdateRolePayload>({
    mutationKey: ['trip-members', 'update-role', tripId, memberId],
    endPoint: `/trip/${tripId}/members/${memberId}`,
    options,
  });

  return {
    ...mutation,
    updateRole: mutation.mutate,
    updateRoleAsync: mutation.mutateAsync,
  };
}

export interface UseRemoveMemberParams {
  tripId: number | string;
  memberId: number | string;
  options?: MutationCallbacks<ApiResponse<null>, Record<string, never>>;
}

export function useRemoveMember({
  tripId,
  memberId,
  options,
}: UseRemoveMemberParams) {
  const mutation = useMutationDelete<ApiResponse<null>, Record<string, never>>({
    mutationKey: ['trip-members', 'remove', tripId, memberId],
    endPoint: `/trip/${tripId}/members/${memberId}`,
    options,
  });

  return {
    ...mutation,
    removeMember: mutation.mutate,
    removeMemberAsync: mutation.mutateAsync,
  };
}

export interface UseLeaveTripParams {
  tripId: number | string;
  options?: MutationCallbacks<ApiResponse<null>, Record<string, never>>;
}

export function useLeaveTrip({ tripId, options }: UseLeaveTripParams) {
  const mutation = useMutationPost<ApiResponse<null>, Record<string, never>>({
    mutationKey: ['trip-members', 'leave', tripId],
    endPoint: `/trip/${tripId}/members/leave`,
    options,
  });

  return {
    ...mutation,
    leaveTrip: mutation.mutate,
    leaveTripAsync: mutation.mutateAsync,
  };
}
