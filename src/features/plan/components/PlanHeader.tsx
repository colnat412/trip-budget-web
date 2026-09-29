'use client';

import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import ChecklistRoundedIcon from '@mui/icons-material/ChecklistRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import { useTranslations } from 'next-intl';

import { AppButton } from '@/base/components/ui';
import { formatCurrency } from '@/base/utils';
import { Share } from '@mui/icons-material';

export interface PlanHeaderProps {
  tripName: string;
  destination: string;
  totalDays: number;
  totalActivities: number;
  completedActivities: number;
  totalEstimatedCost: number;
  currency: string;
  onAddActivity?: () => void;
  onOpenChecklist: () => void;
  onOpenAiPlanner?: () => void;
  onOpenShare?: () => void;
  onOpenActivityLogs?: () => void;
  readOnly?: boolean;
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
  onOpenAiPlanner,
  onOpenShare,
  onOpenActivityLogs,
  readOnly = false,
}: PlanHeaderProps) => {
  const t = useTranslations('plan');

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'center' },
        gap: 2,
      }}
    >
      <Box
        sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, minWidth: 0 }}
      >
        <Typography
          component="h1"
          sx={{
            fontFamily: 'var(--font-display)',
            fontSize: { xs: '22px', sm: '28px' },
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
              fontSize: { xs: '13px', sm: '14px' },
              fontWeight: 600,
              color: 'primary.main',
            }}
          >
            {tripName}
          </Typography>
          {destination && (
            <Typography
              sx={{
                fontSize: { xs: '12px', sm: '13px' },
                color: 'text.secondary',
              }}
            >
              · {destination}
            </Typography>
          )}
          <Typography
            sx={{
              fontSize: { xs: '12px', sm: '13px' },
              color: 'text.secondary',
            }}
          >
            · {totalDays} {t('totalDays').toLowerCase()} · {totalActivities}{' '}
            {t('totalActivities').toLowerCase()} ({completedActivities}{' '}
            {t('completedActivities').toLowerCase()})
          </Typography>
          {totalEstimatedCost > 0 && (
            <Typography
              sx={{
                fontSize: { xs: '12px', sm: '13px' },
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

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignSelf: { xs: 'stretch', sm: 'auto' },
          flexWrap: 'wrap',
          gap: 1.5,
        }}
      >
        {onOpenActivityLogs && (
          <AppButton
            intent="secondary"
            size="medium"
            startIcon={<HistoryRoundedIcon />}
            onClick={onOpenActivityLogs}
            sx={{ flex: { xs: '1 1 auto', sm: 'none' } }}
          >
            {t('activityLogBtn')}
          </AppButton>
        )}

        {!readOnly && onOpenShare && (
          <AppButton
            intent="secondary"
            size="medium"
            startIcon={<Share />}
            onClick={onOpenShare}
            sx={{ flex: { xs: '1 1 auto', sm: 'none' } }}
          >
            {t('shareBtn')}
          </AppButton>
        )}

        <AppButton
          intent="secondary"
          size="medium"
          startIcon={<ChecklistRoundedIcon />}
          onClick={onOpenChecklist}
          sx={{ flex: { xs: '1 1 auto', sm: 'none' } }}
        >
          {t('checklistBtn')}
        </AppButton>

        {!readOnly && onOpenAiPlanner && (
          <AppButton
            intent="secondary"
            size="medium"
            startIcon={<AutoAwesomeRoundedIcon sx={{ color: 'primary.main' }} />}
            onClick={onOpenAiPlanner}
            sx={{
              flex: { xs: '1 1 auto', sm: 'none' },
              borderColor: 'primary.light',
              color: 'primary.main',
              fontWeight: 700,
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'primary.50',
              },
            }}
          >
            {t('aiPlannerBtn')}
          </AppButton>
        )}

        {!readOnly && onAddActivity && (
          <AppButton
            intent="primary"
            size="medium"
            startIcon={<AddRoundedIcon />}
            onClick={onAddActivity}
            sx={{ flex: { xs: '1 1 100%', sm: 'none' } }}
          >
            {t('addActivity')}
          </AppButton>
        )}
      </Box>
    </Box>
  );
};

export default PlanHeader;
