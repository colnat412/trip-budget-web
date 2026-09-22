'use client';

import React from 'react';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { useTranslations } from 'next-intl';

import { AppDialog } from '@/base/components/ui';
import EditActivityForm from './EditActivityForm';
import type { PlanActivity, UpdateActivityPayload } from '../types';

export interface EditActivityDialogProps {
  open: boolean;
  onClose: () => void;
  activity: PlanActivity | null;
  onSubmit: (payload: UpdateActivityPayload) => void;
  isLoading?: boolean;
  tripCurrency?: string;
}

const EditActivityDialog = ({
  open,
  onClose,
  activity,
  onSubmit,
  isLoading = false,
  tripCurrency = 'VND',
}: EditActivityDialogProps) => {
  const t = useTranslations('plan.dialog');

  if (!activity) return null;

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={t('editTitle')}
      icon={<EditRoundedIcon color="primary" />}
      maxWidth="sm"
    >
      <EditActivityForm
        activity={activity}
        tripCurrency={tripCurrency}
        isLoading={isLoading}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </AppDialog>
  );
};

export default EditActivityDialog;
