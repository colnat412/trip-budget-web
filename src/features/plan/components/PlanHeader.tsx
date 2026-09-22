'use client';

import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ChecklistRoundedIcon from '@mui/icons-material/ChecklistRounded';
import { useTranslations } from 'next-intl';

import { AppButton } from '@/base/components/ui';
import { formatCurrency } from '@/base/utils';

export interface PlanHeaderProps {
  tripName: string;
  destination: string;
  totalDays: number;
  totalActivities: number;
  completedActivities: number;
  totalEstimatedCost: number;
  currency: string;
  onAddActivity: () => void;
  onOpenChecklist: () => void;
}

const PlanHeader = ({
  tripName,
  destination,
  totalDays,
  totalActivities,
  completedActivities,
  totalEstimatedCost,
  currency,
  onAddActivity,
  onOpenChecklist,
}: PlanHeaderProps) => {
  const t = useTranslations('plan');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'center' },
        gap: 2,
        pb: 1,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography
          component="h1"
          sx={{
            fontFamily: 'var(--font-display)',
            fontSize: '28px',
            fontWeight: 800,
            color: 'text.primary',
            letterSpacing: '-0.5px',
          }}
        >
          {t('pageTitle')}
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: 'center', flexWrap: 'wrap' }}
        >
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'primary.main',
            }}
          >
            {tripName}
          </Typography>
          {destination && (
            <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
              · {destination}
            </Typography>
          )}
          <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
            · {totalDays} {t('totalDays').toLowerCase()} · {totalActivities}{' '}
            {t('totalActivities').toLowerCase()} ({completedActivities}{' '}
            {t('completedActivities').toLowerCase()})
          </Typography>
          {totalEstimatedCost > 0 && (
            <Typography
              sx={{
                fontSize: '13px',
                fontWeight: 700,
                color: 'success.main',
              }}
            >
              · {t('totalEstimatedCost')}:{' '}
              {formatCurrency(totalEstimatedCost, currency)}
            </Typography>
          )}
        </Stack>
      </Box>

      <Stack
        direction="row"
        spacing={1.5}
        sx={{ alignSelf: { xs: 'stretch', sm: 'auto' } }}
      >
        <AppButton
          intent="secondary"
          size="medium"
          startIcon={<ChecklistRoundedIcon />}
          onClick={onOpenChecklist}
        >
          {t('checklistBtn')}
        </AppButton>

        <AppButton
          intent="primary"
          size="medium"
          startIcon={<AddRoundedIcon />}
          onClick={onAddActivity}
        >
          {t('addActivity')}
        </AppButton>
      </Stack>
    </Box>
  );
};

export default PlanHeader;
