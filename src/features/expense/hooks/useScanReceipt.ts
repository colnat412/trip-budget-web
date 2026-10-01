'use client';

import type { ApiResponse } from '@/base/api';
import { useMutationPost, type MutationCallbacks } from '@/base/hooks';
import type { ScannedReceipt } from '../types';

export interface UseScanReceiptParams {
  options?: MutationCallbacks<ApiResponse<ScannedReceipt>, FormData>;
}

export function useScanReceipt({ options }: UseScanReceiptParams = {}) {
  const scanMutation = useMutationPost<ApiResponse<ScannedReceipt>, FormData>({
    mutationKey: ['receipt', 'scan'],
    endPoint: '/ai/scan-receipt',
    options,
    config: {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  });

  return {
    ...scanMutation,
    scanReceipt: scanMutation.mutate,
    scanReceiptAsync: scanMutation.mutateAsync,
  };
}
