import type { TripCategory } from '@/base/constants';

export type ExpenseCategory = TripCategory;

export interface AddExpenseInitialData {
  title?: string;
  amount?: number;
  category?: ExpenseCategory;
  expenseDate?: string;
}

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
  id: number | string;
  userId: number | string;
  userName?: string | null;
  userEmail?: string | null;
  userAvatarUrl?: string | null;
  allocatedAmount: number;
  splitValue?: number;
  settled: boolean;
}

export interface Expense {
  id: number | string;
  tripId: number | string;
  payerId: number | string;
  payerName?: string | null;
  payerEmail?: string | null;
  payerAvatarUrl?: string | null;
  title: string;
  category: ExpenseCategory;
  amount: number;
  currency: string;
  expenseDate: string;
  splitType: SplitType;
  status: ExpenseStatus;
  note?: string;
  receiptUrl?: string;
  activityId?: number | string;
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
  tripId: number | string;
  totalBudget: number;
  actualSpent: number;
  remainingBudget: number;
  percentageUsed: number;
  currency: string;
  categoryBreakdown: CategoryBreakdown[];
}

export interface SplitItemPayload {
  userId: number | string;
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
  payerId?: number | string;
  activityId?: number | string;
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
  payerId?: number | string;
  activityId?: number | string;
  splits?: SplitItemPayload[];
}

export interface SetBudgetPayload {
  totalBudget: number;
  currency?: string;
  categoryLimits?: Partial<Record<ExpenseCategory, number>>;
}

export interface ReceiptItem {
  name: string;
  quantity?: number;
  price?: number;
}

export interface ScannedReceipt {
  merchant_name: string;
  amount: number;
  currency: string;
  expense_date?: string | null;
  category: ExpenseCategory;
  confidence?: number;
  items?: ReceiptItem[];
  raw_text?: string | null;
}
