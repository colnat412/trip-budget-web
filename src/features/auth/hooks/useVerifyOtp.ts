'use client';

import type { ApiResponse } from '@/base/api';
import { useMutationPost, type MutationCallbacks } from '@/base/hooks';
import { authMutationKeys } from '../constants/auth-keys';
import type { LoginData, VerifyOtpPayload } from '../types';

const useVerifyOtp = (
  options?: MutationCallbacks<ApiResponse<LoginData>, VerifyOtpPayload>,
) => {
  const verifyOtpMutation = useMutationPost<ApiResponse<LoginData>, VerifyOtpPayload>({
    mutationKey: authMutationKeys.verifyOtp,
    endPoint: '/auth/verify-otp',
    options,
  });

  return {
    verifyOtpMutation,
  };
};

export default useVerifyOtp;
