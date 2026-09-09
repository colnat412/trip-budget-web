export type ExpenseCategory =
  | 'ACCOMMODATION'
  | 'TRANSPORTATION'
  | 'FOOD_BEVERAGE'
  | 'SIGHTSEEING'
  | 'SHOPPING'
  | 'ENTERTAINMENT'
  | 'OTHER';

export type SplitType = 'EQUAL' | 'EXACT_AMOUNT' | 'PERCENTAGE' | 'SHARE';

export type ExpenseStatus = 'CONFIRMED' | 'DRAFT' | 'DELETED';

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

export interface ExpenseSplit {
  id: number;
  userId: number;
  allocatedAmount: number;
  splitValue?: number;
  settled: boolean;
}

export interface Expense {
  id: number;
  tripId: number;
  payerId: number;
  title: string;
  category: ExpenseCategory;
  amount: number;
  currency: string;
  expenseDate: string;
  splitType: SplitType;
  status: ExpenseStatus;
  note?: string;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
  splits: ExpenseSplit[];
}

export interface CategoryBreakdown {
  category: ExpenseCategory;
  spentAmount: number;
  limitAmount: number;
  percentageUsed: number;
}

export interface TripBudgetSummary {
  tripId: number;
  totalBudget: number;
  actualSpent: number;
  remainingBudget: number;
  percentageUsed: number;
  currency: string;
  categoryBreakdown: CategoryBreakdown[];
}

export interface SplitItemPayload {
  userId: number;
  splitValue?: number;
  allocatedAmount?: number;
}

export interface CreateExpensePayload {
  title: string;
  category: ExpenseCategory;
  amount: number;
  currency?: string;
  expenseDate?: string;
  splitType?: SplitType;
  note?: string;
  receiptUrl?: string;
  payerId?: number;
  splits?: SplitItemPayload[];
}

export interface UpdateExpensePayload {
  title?: string;
  category?: ExpenseCategory;
  amount?: number;
  currency?: string;
  expenseDate?: string;
  splitType?: SplitType;
  note?: string;
  receiptUrl?: string;
  payerId?: number;
  splits?: SplitItemPayload[];
}

export interface SetBudgetPayload {
  totalBudget: number;
  currency?: string;
  categoryLimits?: Partial<Record<ExpenseCategory, number>>;
}
