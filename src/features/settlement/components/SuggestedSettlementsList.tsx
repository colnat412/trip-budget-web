'use client';

import React from 'react';
import { Stack, Typography } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { useTranslations } from 'next-intl';

import { AppCard } from '@/base/components/ui';
import SuggestedSettlementCard from './SuggestedSettlementCard';
import type { SuggestedSettlement } from '../types';

export interface SuggestedSettlementsListProps {
  suggestedSettlements: SuggestedSettlement[];
  onSettle: (settlement: SuggestedSettlement) => void;
}

const SuggestedSettlementsList = ({
  suggestedSettlements,
  onSettle,
}: SuggestedSettlementsListProps) => {
  const t = useTranslations('settlement');

  if (suggestedSettlements.length === 0) {
    return (
      <AppCard
        sx={{
          p: 3,
          borderRadius: '20px',
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          textAlign: 'center',
        }}
      >
        <Stack spacing={1} sx={{ alignItems: 'center', py: 2 }}>
          <CheckCircleRoundedIcon
            sx={{ fontSize: 40, color: 'success.main' }}
          />
          <Typography
            sx={{ fontSize: '14px', fontWeight: 600, color: 'text.secondary' }}
          >
            {t('suggestedEmpty')}
          </Typography>
        </Stack>
      </AppCard>
    );
  }

  return (
    <Stack spacing={1.5}>
      {suggestedSettlements.map((item, idx) => (
        <SuggestedSettlementCard
          key={`${item.fromUserId}-${item.toUserId}-${idx}`}
          settlement={item}
          onSettle={onSettle}
        />
      ))}
    </Stack>
  );
};

export default SuggestedSettlementsList;
