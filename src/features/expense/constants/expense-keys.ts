export const expenseQueryKeys = {
  all: ['expenses'] as const,
  tripExpenses: (tripId?: number | null) =>
    ['expenses', 'trip', tripId] as const,
  tripSummary: (tripId?: number | null) =>
    ['expenses', 'summary', tripId] as const,
  detail: (tripId?: number | null, expenseId?: number | null) =>
    ['expenses', 'detail', tripId, expenseId] as const,
};
