const authRootKey = ['auth'] as const;

export const authQueryKeys = {
  all: authRootKey,
  session: [...authRootKey, 'session'] as const,
};

export const authMutationKeys = {
  login: [...authRootKey, 'login'] as const,
  register: [...authRootKey, 'register'] as const,
  verifyOtp: [...authRootKey, 'verify-otp'] as const,
  resendOtp: [...authRootKey, 'resend-otp'] as const,
  google: [...authRootKey, 'google'] as const,
};
