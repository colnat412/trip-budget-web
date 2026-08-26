const tripRootKey = ['trip'] as const;

export const tripQueryKeys = {
  all: tripRootKey,
  myTrips: [...tripRootKey, 'my-trips'] as const,
  detail: (id: number | string) => [...tripRootKey, 'detail', id] as const,
};

export const tripMutationKeys = {
  create: [...tripRootKey, 'create'] as const,
  update: (id: number | string) => [...tripRootKey, 'update', id] as const,
  delete: (id: number | string) => [...tripRootKey, 'delete', id] as const,
};
