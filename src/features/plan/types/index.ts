export type ActivityCategory =
  | 'FOOD_BEVERAGE'
  | 'TRANSPORTATION'
  | 'SIGHTSEEING'
  | 'ACCOMMODATION'
  | 'SHOPPING'
  | 'ENTERTAINMENT'
  | 'OTHER';

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
