export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'OTHER';

export type BalanceStatus = 'OWED' | 'OWES' | 'SETTLED';

export interface MemberBalance {
  userId: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  totalPaid: number;
  totalOwed: number;
  netBalance: number;
  status: BalanceStatus;
}

export interface SuggestedSettlement {
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  amount: number;
  currency: string;
}

export interface Settlement {
  id: string;
  tripId: string;
  payerId: string;
  payerName: string | null;
  payerAvatarUrl: string | null;
  payeeId: string;
  payeeName: string | null;
  payeeAvatarUrl: string | null;
  amount: number;
  currency: string;
  settledAt: string;
  paymentMethod: PaymentMethod;
  note: string | null;
  createdAt: string;
}

export interface TripSettlementSummary {
  tripId: string;
  currency: string;
  totalExpenses: number;
  totalSettled: number;
  myBalance: number;
  myStatus: BalanceStatus;
  suggestedSettlements: SuggestedSettlement[];
  memberBalances: MemberBalance[];
  settlementHistory: Settlement[];
}

export interface CreateSettlementRequest {
  payerId: string;
  payeeId: string;
  amount: number;
  currency: string;
  settledAt: string;
  paymentMethod: PaymentMethod;
  note?: string;
}
