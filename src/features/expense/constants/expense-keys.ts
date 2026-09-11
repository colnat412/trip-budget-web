export const expenseQueryKeys = {
  all: ['expenses'] as const,
  tripExpenses: (tripId?: number | string | null) =>
    ['expenses', 'trip', tripId] as const,
  tripSummary: (tripId?: number | string | null) =>
    ['expenses', 'summary', tripId] as const,
  detail: (
    tripId?: number | string | null,
    expenseId?: number | string | null,
  ) => ['expenses', 'detail', tripId, expenseId] as const,
};
