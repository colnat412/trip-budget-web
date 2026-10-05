'use client';

import type { ApiResponse } from '@/base/api';
import { useMutationPost, type MutationCallbacks } from '@/base/hooks';
import { authMutationKeys } from '../constants/auth-keys';
import type { RegisterData, RegisterPayload } from '../types';

const useRegister = (
  options?: MutationCallbacks<ApiResponse<RegisterData>, RegisterPayload>,
) => {
  const registerMutation = useMutationPost<ApiResponse<RegisterData>, RegisterPayload>({
    mutationKey: authMutationKeys.register,
    endPoint: '/auth/register',
    options,
  });

  return {
    registerMutation,
  };
};

export default useRegister;
