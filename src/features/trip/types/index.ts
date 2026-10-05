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
  id: number | string;
  ownerId: number | string;
  name: string;
  destination: string;
  description: string | null;
  startDate: string;
  endDate: string;
  baseCurrency: string;
  status: TripStatus;
  visibility?: TripVisibility;
  publicRole?: TripPublicRole;
  shareToken?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export type TripVisibility = 'PRIVATE' | 'PUBLIC';
export type TripPublicRole = 'VIEWER' | 'EDITOR';

export interface TripShareSettings {
  tripId: string;
  visibility: TripVisibility;
  publicRole: TripPublicRole;
  shareToken: string;
}

export interface UpdateShareSettingsPayload {
  visibility: TripVisibility;
  publicRole: TripPublicRole;
}

import type { TripPlanOverview } from '@/features/plan/types';

export interface PublicTripData {
  shareToken: string;
  name: string;
  destination: string;
  description: string | null;
  startDate: string;
  endDate: string;
  baseCurrency: string;
  status: TripStatus;
  visibility: TripVisibility;
  publicRole: TripPublicRole;
}

export interface PublicTripSnapshot {
  trip: PublicTripData;
  plan: TripPlanOverview;
  generatedAt: string;
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
    userId: number | string;
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
  status?: TripStatus;
}
