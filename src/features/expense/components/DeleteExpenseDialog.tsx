'use client';

import React from 'react';
import { Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { AppConfirmDialog } from '@/base/components/ui';
import { formatCurrency } from '@/base/utils';
import type { Expense } from '../types';

export interface DeleteExpenseDialogProps {
  open: boolean;
  expense: Expense | null;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteExpenseDialog = ({
  open,
  expense,
  isLoading = false,
  onClose,
  onConfirm,
}: DeleteExpenseDialogProps) => {
  const t = useTranslations('expense');

  if (!expense) return null;

  return (
    <AppConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={t('dialog.deleteTitle')}
      description={
        <Stack spacing={1}>
          <Typography sx={{ fontSize: '14px', color: 'text.primary' }}>
            {t('dialog.deleteConfirm', {
              title: expense.title,
              amount: formatCurrency(expense.amount, expense.currency),
            })}
          </Typography>
          <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
            {t('dialog.deleteDesc')}
          </Typography>
        </Stack>
      }
      confirmText={t('dialog.confirmDelete')}
      cancelText={t('form.cancel')}
      intent="danger"
      loading={isLoading}
    />
  );
};

export default DeleteExpenseDialog;
