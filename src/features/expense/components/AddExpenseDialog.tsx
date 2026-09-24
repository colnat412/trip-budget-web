'use client';

import React from 'react';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import { useTranslations } from 'next-intl';
import { AppDialog } from '@/base/components/ui';
import { useTripMembers } from '@/features/trip/hooks/useTripMembers';
import AddExpenseForm from './AddExpenseForm';
import type { AddExpenseInitialData, CreateExpensePayload } from '../types';

export interface AddExpenseDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateExpensePayload) => void;
  isLoading?: boolean;
  tripCurrency?: string;
  tripId?: number | string | null;
  initialData?: AddExpenseInitialData;
}

const AddExpenseDialog = ({
  open,
  onClose,
  onSubmit,
  isLoading = false,
  tripCurrency = 'VND',
  tripId,
  initialData,
}: AddExpenseDialogProps) => {
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
        key={`${open ? '1' : '0'}-${initialData?.title || ''}-${initialData?.amount || ''}`}
        tripCurrency={tripCurrency}
        isLoading={isLoading}
        members={activeMembers}
        onSubmit={onSubmit}
        onCancel={onClose}
        initialData={initialData}
      />
    </AppDialog>
  );
};

export default AddExpenseDialog;
