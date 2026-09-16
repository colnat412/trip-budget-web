export const settlementQueryKeys = {
  all: ['settlements'] as const,
  summary: (tripId?: number | string | null) =>
    [
      ...settlementQueryKeys.all,
      'summary',
      tripId ? String(tripId) : null,
    ] as const,
};
