'use client';

import React from 'react';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import { useTranslations } from 'next-intl';
import { AppDialog } from '@/base/components/ui';
import SetBudgetForm from './SetBudgetForm';
import type { SetBudgetPayload, TripBudgetSummary } from '../types';

export interface SetBudgetDialogProps {
  open: boolean;
  summary: TripBudgetSummary | null;
  tripCurrency?: string;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (payload: SetBudgetPayload) => void;
}

export default function SetBudgetDialog({
  open,
  summary,
  tripCurrency = 'VND',
  isLoading = false,
  onClose,
  onSubmit,
}: SetBudgetDialogProps) {
  const t = useTranslations('expense');

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={t('dialog.setBudgetTitle')}
      icon={<AccountBalanceWalletRoundedIcon color="primary" />}
      maxWidth="sm"
    >
      <SetBudgetForm
        key={open ? 'open' : 'closed'}
        summary={summary}
        tripCurrency={tripCurrency}
        isLoading={isLoading}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </AppDialog>
  );
}
