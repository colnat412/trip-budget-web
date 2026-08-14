import axios from 'axios';

import type { ApiErrorResponse } from './types';

const DEFAULT_ERROR_MESSAGE = 'Something went wrong.';
const NETWORK_ERROR_MESSAGE = 'Cannot access to server. Please try again';
const TIMEOUT_ERROR_MESSAGE = 'Request timeout.';

export class ApiError extends Error {
  readonly status: number | null;
  readonly data: unknown;

  constructor(message: string, status: number | null, data: unknown = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const response = error.response;

    if (!response) {
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        return new ApiError(TIMEOUT_ERROR_MESSAGE, null);
      }

      return new ApiError(NETWORK_ERROR_MESSAGE, null);
    }

    return new ApiError(
      response.data?.message || DEFAULT_ERROR_MESSAGE,
      response.data?.status ?? response.status,
      response.data?.data,
    );
  }

  if (error instanceof Error) {
    return new ApiError(error.message || DEFAULT_ERROR_MESSAGE, null);
  }

  return new ApiError(DEFAULT_ERROR_MESSAGE, null);
}
