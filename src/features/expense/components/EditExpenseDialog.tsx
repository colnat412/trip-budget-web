'use client';

import React from 'react';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { useTranslations } from 'next-intl';
import { AppDialog } from '@/base/components/ui';
import EditExpenseForm from './EditExpenseForm';
import type { Expense, UpdateExpensePayload } from '../types';

export interface EditExpenseDialogProps {
  open: boolean;
  expense: Expense | null;
  onClose: () => void;
  onSubmit: (payload: UpdateExpensePayload) => void;
  isLoading?: boolean;
}

export default function EditExpenseDialog({
  open,
  expense,
  onClose,
  onSubmit,
  isLoading = false,
}: EditExpenseDialogProps) {
  const t = useTranslations('expense');

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
        isLoading={isLoading}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </AppDialog>
  );
}
