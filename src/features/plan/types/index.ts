import type { TripCategory } from '@/base/constants';

export type ActivityCategory = TripCategory;

export type ActivityStatus =
  | 'PLANNED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'SKIPPED';

export type ChecklistCategory =
  | 'DOCUMENTS'
  | 'CLOTHING'
  | 'ELECTRONICS'
  | 'MEDICAL'
  | 'TASKS'
  | 'OTHER';

export interface PlanActivity {
  id: string;
  dayId: string;
  tripId: string;
  title: string;
  startTime?: string | null;
  endTime?: string | null;
  location?: string | null;
  category: ActivityCategory;
  estimatedCost: number;
  status: ActivityStatus;
  orderIndex: number;
  note?: string | null;
  expenseId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PlanDay {
  id: string;
  tripId: string;
  dayNumber: number;
  planDate?: string | null;
  title?: string | null;
  note?: string | null;
  totalEstimatedCost: number;
  totalActivities: number;
  activities: PlanActivity[];
}

export interface PlanChecklist {
  id: string;
  tripId: string;
  title: string;
  category: ChecklistCategory;
  isCompleted: boolean;
  assigneeId?: string | null;
  assigneeName?: string | null;
  assigneeEmail?: string | null;
  assigneeAvatarUrl?: string | null;
  createdAt: string;
}

export interface TripPlanOverview {
  tripId: string;
  tripName: string;
  destination: string;
  startDate?: string | null;
  endDate?: string | null;
  baseCurrency: string;
  totalDays: number;
  totalEstimatedCost: number;
  totalActivities: number;
  completedActivities: number;
  days: PlanDay[];
  checklists: PlanChecklist[];
}

export interface CreatePlanDayPayload {
  dayNumber: number;
  planDate?: string;
  title?: string;
  note?: string;
}

export interface UpdatePlanDayPayload {
  planDate?: string;
  title?: string;
  note?: string;
}

export interface CreateActivityPayload {
  title: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  category?: ActivityCategory;
  estimatedCost?: number;
  orderIndex?: number;
  note?: string;
}

export interface UpdateActivityPayload {
  title?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  category?: ActivityCategory;
  estimatedCost?: number;
  status?: ActivityStatus;
  orderIndex?: number;
  note?: string;
  expenseId?: string;
  targetDayId?: string;
}

export interface CreateChecklistPayload {
  title: string;
  category?: ChecklistCategory;
  assigneeId?: string;
}

export interface UpdateChecklistPayload {
  title?: string;
  category?: ChecklistCategory;
  isCompleted?: boolean;
  assigneeId?: string;
}

export interface DistanceInfo {
  text: string;
  value: number; // meters
}

export interface DurationInfo {
  text: string;
  value: number; // seconds
}

export interface DistanceResult {
  distance: DistanceInfo;
  duration: DurationInfo;
  isEstimated?: boolean;
  source?: 'google' | 'osm' | 'heuristic';
}

export interface RouteSegment {
  fromActivityId: string;
  toActivityId: string;
  origin: string;
  destination: string;
  distance: DistanceInfo;
  duration: DurationInfo;
  isEstimated?: boolean;
  source?: 'google' | 'osm' | 'heuristic';
}

export interface OptimizationResult {
  originalActivities: PlanActivity[];
  optimizedActivities: PlanActivity[];
  originalDistanceMeters: number;
  optimizedDistanceMeters: number;
  originalDurationSeconds: number;
  optimizedDurationSeconds: number;
  savedDistanceMeters: number;
  savedPercentage: number;
  savedDurationSeconds: number;
  formattedOriginalDistance: string;
  formattedOptimizedDistance: string;
  formattedSavedDistance: string;
  formattedOriginalDuration: string;
  formattedOptimizedDuration: string;
  formattedSavedDuration: string;
  isImprovement: boolean;
  segments: RouteSegment[];
}
