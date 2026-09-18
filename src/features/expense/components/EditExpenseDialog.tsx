'use client';

import React from 'react';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { useTranslations } from 'next-intl';
import { AppDialog } from '@/base/components/ui';
import { useTripMembers } from '@/features/trip/hooks/useTripMembers';
import EditExpenseForm from './EditExpenseForm';
import type { Expense, UpdateExpensePayload } from '../types';

export interface EditExpenseDialogProps {
  open: boolean;
  expense: Expense | null;
  onClose: () => void;
  onSubmit: (payload: UpdateExpensePayload) => void;
  isLoading?: boolean;
}

const EditExpenseDialog = ({
  open,
  expense,
  onClose,
  onSubmit,
  isLoading = false,
}: EditExpenseDialogProps) => {
  const t = useTranslations('expense');
  const { activeMembers } = useTripMembers({
    tripId: expense?.tripId,
    enabled: open && Boolean(expense?.tripId),
  });

  if (!expense) return null;

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={t('dialog.editTitle')}
      icon={<EditRoundedIcon color="primary" />}
      maxWidth="sm"
    >
      <EditExpenseForm
        key={expense.id}
        expense={expense}
        members={activeMembers}
        isLoading={isLoading}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </AppDialog>
  );
};

export default EditExpenseDialog;
