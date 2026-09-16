'use client';

import React from 'react';
import HandshakeRoundedIcon from '@mui/icons-material/HandshakeRounded';
import { useTranslations } from 'next-intl';

import { AppDialog } from '@/base/components/ui';
import RecordSettlementForm from './RecordSettlementForm';
import type { CreateSettlementRequest } from '../types';

export interface RecordSettlementDialogProps {
  open: boolean;
  onClose: () => void;
  members: { userId: string; name: string }[];
  initialData?: Partial<CreateSettlementRequest>;
  currency: string;
  isLoading: boolean;
  onSubmit: (data: CreateSettlementRequest) => void;
}

export default function RecordSettlementDialog({
  open,
  onClose,
  members,
  initialData,
  currency,
  isLoading,
  onSubmit,
}: RecordSettlementDialogProps) {
  const t = useTranslations('settlement');

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={t('dialog.title')}
      icon={<HandshakeRoundedIcon sx={{ fontSize: '22px' }} />}
      maxWidth="sm"
    >
      <RecordSettlementForm
        members={members}
        initialData={initialData}
        currency={currency}
        isLoading={isLoading}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </AppDialog>
  );
}
