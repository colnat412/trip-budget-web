const authRootKey = ['auth'] as const;

export const authQueryKeys = {
  all: authRootKey,
  session: [...authRootKey, 'session'] as const,
};

export const authMutationKeys = {
  login: [...authRootKey, 'login'] as const,
};
