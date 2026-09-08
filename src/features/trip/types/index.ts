export type TripStatus =
  | 'DRAFT'
  | 'PLANNING'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'ARCHIVED'
  | 'CANCELLED'
  | 'DELETED';

export interface Trip {
  id: number;
  ownerId: number;
  name: string;
  destination: string;
  description: string | null;
  startDate: string;
  endDate: string;
  baseCurrency: string;
  status: TripStatus;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

export interface PageResponse<T> {
  items: T[];
  pagination: Pagination;
}

export interface CreateTripPayload {
  name: string;
  destination: string;
  description?: string;
  startDate: string;
  endDate: string;
  baseCurrency?: string;
  initialMembers?: Array<{
    userId: number;
    role: string;
  }>;
}

export interface UpdateTripPayload {
  name?: string;
  destination?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  baseCurrency?: string;
}
