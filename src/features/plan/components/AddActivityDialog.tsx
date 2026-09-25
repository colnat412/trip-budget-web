'use client';

import React from 'react';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import { useTranslations } from 'next-intl';

import { AppDialog } from '@/base/components/ui';
import AddActivityForm from './AddActivityForm';
import type { CreateActivityPayload } from '../types';

export interface AddActivityDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateActivityPayload) => void;
  isLoading?: boolean;
  tripCurrency?: string;
}

const AddActivityDialog = ({
  open,
  onClose,
  onSubmit,
  isLoading = false,
  tripCurrency = 'VND',
}: AddActivityDialogProps) => {
  const t = useTranslations('plan.dialog');

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={t('addTitle')}
      icon={<AddCircleOutlineRoundedIcon />}
      maxWidth="sm"
    >
      <AddActivityForm
        tripCurrency={tripCurrency}
        isLoading={isLoading}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </AppDialog>
  );
};

export default AddActivityDialog;
