'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import PaymentRoundedIcon from '@mui/icons-material/PaymentRounded';
import { useTranslations } from 'next-intl';

import { AppButton, AppCard } from '@/base/components/ui';
import { formatCurrency } from '@/base/utils';
import type { SuggestedSettlement } from '../types';

export interface SuggestedSettlementCardProps {
  settlement: SuggestedSettlement;
  onSettle: (settlement: SuggestedSettlement) => void;
}

const SuggestedSettlementCard = ({
  settlement,
  onSettle,
}: SuggestedSettlementCardProps) => {
  const t = useTranslations('settlement');

  return (
    <AppCard
      sx={{
        p: 2,
        borderRadius: '16px',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'space-between',
        gap: 2,
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          borderColor: 'primary.main',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          flexWrap: 'wrap',
        }}
      >
        <Box
          sx={{
            px: 1.5,
            py: 0.75,
            borderRadius: '10px',
            bgcolor: 'action.hover',
            fontWeight: 700,
            fontSize: '13px',
            color: 'text.primary',
          }}
        >
          {settlement.fromUserName}
        </Box>

        <Box
          sx={{ display: 'flex', alignItems: 'center', color: 'primary.main' }}
        >
          <ArrowForwardRoundedIcon sx={{ fontSize: '18px' }} />
        </Box>

        <Box
          sx={{
            px: 1.5,
            py: 0.75,
            borderRadius: '10px',
            bgcolor: 'action.hover',
            fontWeight: 700,
            fontSize: '13px',
            color: 'text.primary',
          }}
        >
          {settlement.toUserName}
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: { xs: 'space-between', sm: 'flex-end' },
          width: { xs: '100%', sm: 'auto' },
          gap: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 800,
            fontFamily: 'var(--font-mono)',
            color: 'primary.main',
          }}
        >
          {formatCurrency(settlement.amount, settlement.currency)}
        </Typography>

        <AppButton
          size="medium"
          intent="primary"
          startIcon={<PaymentRoundedIcon sx={{ fontSize: '16px' }} />}
          onClick={() => onSettle(settlement)}
        >
          {t('settleBtn')}
        </AppButton>
      </Box>
    </AppCard>
  );
};

export default SuggestedSettlementCard;
