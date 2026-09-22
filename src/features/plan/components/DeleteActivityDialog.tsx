'use client';

import React from 'react';
import { Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import { AppConfirmDialog } from '@/base/components/ui';

export interface DeleteActivityDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  activityTitle?: string;
  loading?: boolean;
}

const DeleteActivityDialog = ({
  open,
  onClose,
  onConfirm,
  activityTitle,
  loading = false,
}: DeleteActivityDialogProps) => {
  const t = useTranslations('plan.dialog');

  return (
    <AppConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={t('deleteTitle')}
      intent="danger"
      loading={loading}
      confirmText={t('confirmDelete')}
      cancelText={t('cancelBtn')}
      description={
        <Typography
          sx={{
            fontSize: '14px',
            color: 'text.secondary',
            lineHeight: 1.6,
          }}
        >
          {activityTitle ? (
            <>
              {t('deleteDesc')}{' '}
              <Typography
                component="span"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                }}
              >
                &ldquo;{activityTitle}&rdquo;
              </Typography>
            </>
          ) : (
            t('deleteDesc')
          )}
        </Typography>
      }
    />
  );
};

export default DeleteActivityDialog;
