'use client';

import type { ApiResponse } from '@/base/api';
import { useMutationPost, type MutationCallbacks } from '@/base/hooks';

export default function useLogout(
  options?: MutationCallbacks<ApiResponse<null>, Record<string, never>>,
) {
  const logoutMutation = useMutationPost<
    ApiResponse<null>,
    Record<string, never>
  >({
    mutationKey: ['auth', 'logout'],
    endPoint: '/auth/logout',
    options,
  });

  return {
    ...logoutMutation,
    logoutMutation,
  };
}
