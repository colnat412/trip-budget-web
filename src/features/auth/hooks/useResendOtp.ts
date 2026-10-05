'use client';

import type { ApiResponse } from '@/base/api';
import { useMutationPost, type MutationCallbacks } from '@/base/hooks';
import { authMutationKeys } from '../constants/auth-keys';
import type { ResendOtpPayload } from '../types';

const useResendOtp = (
  options?: MutationCallbacks<ApiResponse<{ success: boolean; message: string }>, ResendOtpPayload>,
) => {
  const resendOtpMutation = useMutationPost<ApiResponse<{ success: boolean; message: string }>, ResendOtpPayload>({
    mutationKey: authMutationKeys.resendOtp,
    endPoint: '/auth/resend-otp',
    options,
  });

  return {
    resendOtpMutation,
  };
};

export default useResendOtp;
