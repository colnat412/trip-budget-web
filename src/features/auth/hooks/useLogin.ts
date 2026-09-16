'use client';

import type { ApiResponse } from '@/base/api';
import { useMutationPost, type MutationCallbacks } from '@/base/hooks';
import { authMutationKeys } from '../constants/auth-keys';
import type { LoginData, LoginPayload } from '../types';

const useLogin = (
  options?: MutationCallbacks<ApiResponse<LoginData>, LoginPayload>,
) => {
  const loginMutation = useMutationPost<ApiResponse<LoginData>, LoginPayload>({
    mutationKey: authMutationKeys.login,
    endPoint: '/auth/login',
    options,
  });

  return {
    loginMutation,
  };
};

export default useLogin;
