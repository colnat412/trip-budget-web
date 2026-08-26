'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { ApiError } from '@/base/api';
import type { UserProfile } from '@/features/auth/types';
import useCurrentUser from '../hooks/useCurrentUser';

interface UserContextValue {
  user: UserProfile | null;
  isLoading: boolean;
  isFetching: boolean;
  error: ApiError | null;
  refetchUser: () => Promise<unknown>;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const { user, isLoading, isFetching, error, refetch } = useCurrentUser();

  const value = useMemo<UserContextValue>(
    () => ({
      user,
      isLoading,
      isFetching,
      error,
      refetchUser: refetch,
    }),
    [user, isLoading, isFetching, error, refetch],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUserContext(): UserContextValue {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
}
