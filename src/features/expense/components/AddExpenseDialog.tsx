'use client';

import React from 'react';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import { useTranslations } from 'next-intl';
import { AppDialog } from '@/base/components/ui';
import { useTripMembers } from '@/features/trip/hooks/useTripMembers';
import AddExpenseForm from './AddExpenseForm';
import type { CreateExpensePayload } from '../types';

export interface AddExpenseDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateExpensePayload) => void;
  isLoading?: boolean;
  tripCurrency?: string;
  tripId?: number | string | null;
}

export default function AddExpenseDialog({
  open,
  onClose,
  onSubmit,
  isLoading = false,
  tripCurrency = 'VND',
  tripId,
}: AddExpenseDialogProps) {
  const t = useTranslations('expense');
  const { activeMembers } = useTripMembers({ tripId, enabled: open });

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={t('dialog.addTitle')}
      icon={<ReceiptLongRoundedIcon color="primary" />}
      maxWidth="sm"
    >
      <AddExpenseForm
        tripCurrency={tripCurrency}
        isLoading={isLoading}
        members={activeMembers}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </AppDialog>
  );
}
