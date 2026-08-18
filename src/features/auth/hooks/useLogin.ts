'use client';

import type { ApiResponse } from '@/base/api';
import { useMutationPost } from '@/base/hooks';
import { authMutationKeys } from '../constants/auth-keys';
import type { LoginData, LoginPayload } from '../types';

export default function useLogin() {
  const loginMutation = useMutationPost<
    ApiResponse<LoginData>,
    LoginPayload
  >({
    mutationKey: authMutationKeys.login,
    endPoint: '/auth/login',
  });

  return {
    loginMutation,
  };
}
