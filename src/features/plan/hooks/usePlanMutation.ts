'use client';

import type { ApiResponse } from '@/base/api';
import {
  useMutationPost,
  useMutationPut,
  useMutationDelete,
  type MutationCallbacks,
} from '@/base/hooks';
import type {
  ActivityStatus,
  CreateActivityPayload,
  CreateChecklistPayload,
  CreatePlanDayPayload,
  PlanActivity,
  PlanChecklist,
  PlanDay,
  TripPlanOverview,
  GenerateAiPlanPayload,
  UpdateActivityPayload,
  UpdateChecklistPayload,
  UpdatePlanDayPayload,
} from '../types';

export interface UseCreateActivityParams {
  tripId: string | number;
  dayId: string | number;
  options?: MutationCallbacks<ApiResponse<PlanActivity>, CreateActivityPayload>;
}

export function useCreateActivity({
  tripId,
  dayId,
  options,
}: UseCreateActivityParams) {
  const mutation = useMutationPost<
    ApiResponse<PlanActivity>,
    CreateActivityPayload
  >({
    mutationKey: ['plan', 'activity', 'create', tripId, dayId],
    endPoint: `/trip/${tripId}/plan/days/${dayId}/activities`,
    options,
  });

  return {
    ...mutation,
    createActivity: mutation.mutate,
    createActivityAsync: mutation.mutateAsync,
  };
}

export interface UseUpdateActivityParams {
  tripId: string | number;
  activityId: string | number;
  options?: MutationCallbacks<ApiResponse<PlanActivity>, UpdateActivityPayload>;
}

export function useUpdateActivity({
  tripId,
  activityId,
  options,
}: UseUpdateActivityParams) {
  const mutation = useMutationPut<
    ApiResponse<PlanActivity>,
    UpdateActivityPayload
  >({
    mutationKey: ['plan', 'activity', 'update', tripId, activityId],
    endPoint: `/trip/${tripId}/plan/activities/${activityId}`,
    options,
  });

  return {
    ...mutation,
    updateActivity: mutation.mutate,
    updateActivityAsync: mutation.mutateAsync,
  };
}

export interface UseDeleteActivityParams {
  tripId: string | number;
  activityId: string | number;
  options?: MutationCallbacks<ApiResponse<null>, Record<string, never>>;
}

export function useDeleteActivity({
  tripId,
  activityId,
  options,
}: UseDeleteActivityParams) {
  const mutation = useMutationDelete<ApiResponse<null>, Record<string, never>>({
    mutationKey: ['plan', 'activity', 'delete', tripId, activityId],
    endPoint: `/trip/${tripId}/plan/activities/${activityId}`,
    options,
  });

  return {
    ...mutation,
    deleteActivity: mutation.mutate,
    deleteActivityAsync: mutation.mutateAsync,
  };
}

export interface UseUpdateActivityStatusParams {
  tripId: string | number;
  activityId: string | number;
  options?: MutationCallbacks<
    ApiResponse<PlanActivity>,
    { status: ActivityStatus }
  >;
}

export function useUpdateActivityStatus({
  tripId,
  activityId,
  options,
}: UseUpdateActivityStatusParams) {
  const mutation = useMutationPut<
    ApiResponse<PlanActivity>,
    { status: ActivityStatus }
  >({
    mutationKey: ['plan', 'activity', 'status', tripId, activityId],
    endPoint: `/trip/${tripId}/plan/activities/${activityId}/status`,
    options,
  });

  return {
    ...mutation,
    updateStatus: mutation.mutate,
    updateStatusAsync: mutation.mutateAsync,
  };
}

export interface UseCreatePlanDayParams {
  tripId: string | number;
  options?: MutationCallbacks<ApiResponse<PlanDay>, CreatePlanDayPayload>;
}

export function useCreatePlanDay({ tripId, options }: UseCreatePlanDayParams) {
  const mutation = useMutationPost<ApiResponse<PlanDay>, CreatePlanDayPayload>({
    mutationKey: ['plan', 'day', 'create', tripId],
    endPoint: `/trip/${tripId}/plan`,
    options,
  });

  return {
    ...mutation,
    createDay: mutation.mutate,
    createDayAsync: mutation.mutateAsync,
  };
}

export interface UseUpdatePlanDayParams {
  tripId: string | number;
  dayId: string | number;
  options?: MutationCallbacks<ApiResponse<PlanDay>, UpdatePlanDayPayload>;
}

export function useUpdatePlanDay({
  tripId,
  dayId,
  options,
}: UseUpdatePlanDayParams) {
  const mutation = useMutationPut<ApiResponse<PlanDay>, UpdatePlanDayPayload>({
    mutationKey: ['plan', 'day', 'update', tripId, dayId],
    endPoint: `/trip/${tripId}/plan/days/${dayId}`,
    options,
  });

  return {
    ...mutation,
    updateDay: mutation.mutate,
    updateDayAsync: mutation.mutateAsync,
  };
}

export interface UseDeletePlanDayParams {
  tripId: string | number;
  dayId: string | number;
  options?: MutationCallbacks<ApiResponse<null>, Record<string, never>>;
}

export function useDeletePlanDay({
  tripId,
  dayId,
  options,
}: UseDeletePlanDayParams) {
  const mutation = useMutationDelete<ApiResponse<null>, Record<string, never>>({
    mutationKey: ['plan', 'day', 'delete', tripId, dayId],
    endPoint: `/trip/${tripId}/plan/days/${dayId}`,
    options,
  });

  return {
    ...mutation,
    deleteDay: mutation.mutate,
    deleteDayAsync: mutation.mutateAsync,
  };
}

export interface UseCreateChecklistParams {
  tripId: string | number;
  options?: MutationCallbacks<
    ApiResponse<PlanChecklist>,
    CreateChecklistPayload
  >;
}

export function useCreateChecklist({
  tripId,
  options,
}: UseCreateChecklistParams) {
  const mutation = useMutationPost<
    ApiResponse<PlanChecklist>,
    CreateChecklistPayload
  >({
    mutationKey: ['plan', 'checklist', 'create', tripId],
    endPoint: `/trip/${tripId}/plan/checklists`,
    options,
  });

  return {
    ...mutation,
    createChecklist: mutation.mutate,
    createChecklistAsync: mutation.mutateAsync,
  };
}

export interface UseUpdateChecklistParams {
  tripId: string | number;
  checklistId: string | number;
  options?: MutationCallbacks<
    ApiResponse<PlanChecklist>,
    UpdateChecklistPayload
  >;
}

export function useUpdateChecklist({
  tripId,
  checklistId,
  options,
}: UseUpdateChecklistParams) {
  const mutation = useMutationPut<
    ApiResponse<PlanChecklist>,
    UpdateChecklistPayload
  >({
    mutationKey: ['plan', 'checklist', 'update', tripId, checklistId],
    endPoint: `/trip/${tripId}/plan/checklists/${checklistId}`,
    options,
  });

  return {
    ...mutation,
    updateChecklist: mutation.mutate,
    updateChecklistAsync: mutation.mutateAsync,
  };
}

export interface UseToggleChecklistParams {
  tripId: string | number;
  checklistId: string | number;
  options?: MutationCallbacks<
    ApiResponse<PlanChecklist>,
    Record<string, never>
  >;
}

export function useToggleChecklist({
  tripId,
  checklistId,
  options,
}: UseToggleChecklistParams) {
  const mutation = useMutationPut<
    ApiResponse<PlanChecklist>,
    Record<string, never>
  >({
    mutationKey: ['plan', 'checklist', 'toggle', tripId, checklistId],
    endPoint: `/trip/${tripId}/plan/checklists/${checklistId}/toggle`,
    options,
  });

  return {
    ...mutation,
    toggleChecklist: mutation.mutate,
    toggleChecklistAsync: mutation.mutateAsync,
  };
}

export interface UseDeleteChecklistParams {
  tripId: string | number;
  checklistId: string | number;
  options?: MutationCallbacks<ApiResponse<null>, Record<string, never>>;
}

export function useDeleteChecklist({
  tripId,
  checklistId,
  options,
}: UseDeleteChecklistParams) {
  const mutation = useMutationDelete<ApiResponse<null>, Record<string, never>>({
    mutationKey: ['plan', 'checklist', 'delete', tripId, checklistId],
    endPoint: `/trip/${tripId}/plan/checklists/${checklistId}`,
    options,
  });

  return {
    ...mutation,
    deleteChecklist: mutation.mutate,
    deleteChecklistAsync: mutation.mutateAsync,
  };
}

export interface UseGenerateAiPlanParams {
  tripId: string | number;
  options?: MutationCallbacks<
    ApiResponse<TripPlanOverview>,
    GenerateAiPlanPayload
  >;
}

export function useGenerateAiPlan({
  tripId,
  options,
}: UseGenerateAiPlanParams) {
  const mutation = useMutationPost<
    ApiResponse<TripPlanOverview>,
    GenerateAiPlanPayload
  >({
    mutationKey: ['plan', 'ai', 'generate', tripId],
    endPoint: `/trip/${tripId}/plan/ai/generate`,
    options,
  });

  return {
    ...mutation,
    generateAiPlan: mutation.mutate,
    generateAiPlanAsync: mutation.mutateAsync,
  };
}

export interface UseResetDayActivitiesParams {
  tripId: string | number;
  dayId: string | number;
  options?: MutationCallbacks<ApiResponse<null>, Record<string, never>>;
}

export function useResetDayActivities({
  tripId,
  dayId,
  options,
}: UseResetDayActivitiesParams) {
  const mutation = useMutationDelete<ApiResponse<null>, Record<string, never>>({
    mutationKey: ['plan', 'day', 'reset-activities', tripId, dayId],
    endPoint: `/trip/${tripId}/plan/days/${dayId}/activities`,
    options,
  });

  return {
    ...mutation,
    resetDayActivities: mutation.mutate,
    resetDayActivitiesAsync: mutation.mutateAsync,
  };
}

const usePlanMutation = () => {
  return {
    useCreateActivity,
    useUpdateActivity,
    useDeleteActivity,
    useUpdateActivityStatus,
    useCreatePlanDay,
    useUpdatePlanDay,
    useDeletePlanDay,
    useCreateChecklist,
    useUpdateChecklist,
    useToggleChecklist,
    useDeleteChecklist,
    useGenerateAiPlan,
    useResetDayActivities,
  };
};

export default usePlanMutation;
