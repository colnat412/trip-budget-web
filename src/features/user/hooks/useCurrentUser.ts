'use client';

import type { ApiResponse } from '@/base/api';
import { useQueryGet } from '@/base/hooks';
import type { UserProfile } from '@/features/auth/types';

const useCurrentUser = (enabled = true) => {
  const query = useQueryGet<ApiResponse<UserProfile>>({
    queryKey: ['auth', 'me'],
    endPoint: '/auth/me',
    enabled,
  });

  const rawData = query.data?.data;
  const user: UserProfile | null =
    (rawData as { data?: UserProfile })?.data ??
    (rawData as UserProfile) ??
    null;

  return {
    ...query,
    user,
  };
};

export default useCurrentUser;
