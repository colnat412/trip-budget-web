'use client';

import { axiosClient, type ApiResponse } from '@/base/api';
import { useApiRequest } from '@/base/hooks';
import type { LoginData, LoginPayload } from '../types';

async function login(payload: LoginPayload): Promise<LoginData> {
  const response = await axiosClient.post<ApiResponse<LoginData>>(
    '/auth/login',
    payload,
  );

  return response.data.data;
}

export default function useLogin() {
  return useApiRequest(login);
}
