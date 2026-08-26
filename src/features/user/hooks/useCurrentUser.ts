'use client';

import type { ApiResponse } from '@/base/api';
import { useQueryGet } from '@/base/hooks';
import type { UserProfile } from '@/features/auth/types';

export default function useCurrentUser(enabled = true) {
  const query = useQueryGet<ApiResponse<UserProfile>>({
    queryKey: ['auth', 'me'],
    endPoint: '/auth/me',
    enabled,
  });

  return {
    ...query,
    user: query.data?.data ?? null,
  };
}
