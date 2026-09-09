'use client';

import type { ApiResponse } from '@/base/api';
import {
  useMutationPost,
  useMutationPut,
  useMutationDelete,
  type MutationCallbacks,
} from '@/base/hooks';
import type {
  CreateExpensePayload,
  Expense,
  SetBudgetPayload,
  TripBudgetSummary,
  UpdateExpensePayload,
} from '../types';

export interface UseCreateExpenseParams {
  tripId: number | string;
  options?: MutationCallbacks<ApiResponse<Expense>, CreateExpensePayload>;
}

export interface UseUpdateExpenseParams {
  tripId: number | string;
  expenseId: number | string;
  options?: MutationCallbacks<ApiResponse<Expense>, UpdateExpensePayload>;
}

export interface UseDeleteExpenseParams {
  tripId: number | string;
  expenseId: number | string;
  options?: MutationCallbacks<ApiResponse<null>, Record<string, never>>;
}

export interface UseSetBudgetParams {
  tripId: number | string;
  options?: MutationCallbacks<ApiResponse<TripBudgetSummary>, SetBudgetPayload>;
}

export function useCreateExpense({ tripId, options }: UseCreateExpenseParams) {
  const createMutation = useMutationPost<
    ApiResponse<Expense>,
    CreateExpensePayload
  >({
    mutationKey: ['expenses', 'create', tripId],
    endPoint: `/trip/${tripId}/expenses`,
    options,
  });

  return {
    ...createMutation,
    createMutation,
    createExpense: createMutation.mutate,
    createExpenseAsync: createMutation.mutateAsync,
  };
}

export function useUpdateExpense({
  tripId,
  expenseId,
  options,
}: UseUpdateExpenseParams) {
  const updateMutation = useMutationPut<
    ApiResponse<Expense>,
    UpdateExpensePayload
  >({
    mutationKey: ['expenses', 'update', tripId, expenseId],
    endPoint: `/trip/${tripId}/expenses/${expenseId}`,
    options,
  });

  return {
    ...updateMutation,
    updateMutation,
    updateExpense: updateMutation.mutate,
    updateExpenseAsync: updateMutation.mutateAsync,
  };
}

export function useDeleteExpense({
  tripId,
  expenseId,
  options,
}: UseDeleteExpenseParams) {
  const deleteMutation = useMutationDelete<
    ApiResponse<null>,
    Record<string, never>
  >({
    mutationKey: ['expenses', 'delete', tripId, expenseId],
    endPoint: `/trip/${tripId}/expenses/${expenseId}`,
    options,
  });

  return {
    ...deleteMutation,
    deleteMutation,
    deleteExpense: deleteMutation.mutate,
    deleteExpenseAsync: deleteMutation.mutateAsync,
  };
}

export function useSetBudget({ tripId, options }: UseSetBudgetParams) {
  const setBudgetMutation = useMutationPost<
    ApiResponse<TripBudgetSummary>,
    SetBudgetPayload
  >({
    mutationKey: ['expenses', 'setBudget', tripId],
    endPoint: `/trip/${tripId}/budget`,
    options,
  });

  return {
    ...setBudgetMutation,
    setBudgetMutation,
    setBudget: setBudgetMutation.mutate,
    setBudgetAsync: setBudgetMutation.mutateAsync,
  };
}

export default function useExpenseMutation() {
  return {
    useCreateExpense,
    useUpdateExpense,
    useDeleteExpense,
    useSetBudget,
  };
}
