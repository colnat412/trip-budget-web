'use client';

import type { ApiResponse } from '@/base/api';
import { useMutationPost, type MutationCallbacks } from '@/base/hooks';
import { authMutationKeys } from '../constants/auth-keys';
import type { GoogleLoginPayload, LoginData } from '../types';

const useGoogleLogin = (
  options?: MutationCallbacks<ApiResponse<LoginData>, GoogleLoginPayload>,
) => {
  const googleLoginMutation = useMutationPost<ApiResponse<LoginData>, GoogleLoginPayload>({
    mutationKey: authMutationKeys.google,
    endPoint: '/auth/google',
    options,
  });

  return {
    googleLoginMutation,
  };
};

export default useGoogleLogin;
