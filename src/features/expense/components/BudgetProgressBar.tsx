'use client';

import React from 'react';
import { Typography, Stack } from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import { useTranslations } from 'next-intl';
import { AppCard, AppLinearProgress } from '@/base/components/ui';
import { formatCurrency } from '@/base/utils';
import type { TripBudgetSummary } from '../types';

export interface BudgetProgressBarProps {
  summary: TripBudgetSummary | null;
  currency?: string;
}

const BudgetProgressBar = ({
  summary,
  currency = 'VND',
}: BudgetProgressBarProps) => {
  const t = useTranslations('expense.progress');
  const totalBudget = summary?.totalBudget ?? 0;
  const actualSpent = summary?.actualSpent ?? 0;
  const percentage = summary?.percentageUsed ?? 0;
  const curr = summary?.currency || currency;

  if (totalBudget <= 0) {
    return null;
  }

  const cappedPercentage = Math.min(percentage, 100);

  return (
    <AppCard
      sx={{
        p: 2.5,
        borderRadius: '16px',
        border: 1,
        borderColor: 'divider',
      }}
    >
      <Stack spacing={1.5}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          sx={{
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
          }}
        >
          <Stack spacing={0.25}>
            <Typography
              sx={{ fontSize: '16px', fontWeight: 700, color: 'text.primary' }}
            >
              {t('title')}
            </Typography>
            <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
              {t('description', {
                spent: formatCurrency(actualSpent, curr),
                total: formatCurrency(totalBudget, curr),
              })}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
            {percentage >= 100 ? (
              <WarningAmberRoundedIcon color="error" fontSize="small" />
            ) : (
              <CheckCircleOutlineRoundedIcon color="success" fontSize="small" />
            )}
            <Typography
              sx={{
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                fontWeight: 800,
                color:
                  percentage >= 100
                    ? 'error.main'
                    : percentage >= 75
                      ? 'secondary.dark'
                      : 'success.main',
              }}
            >
              {percentage.toFixed(1)}%
            </Typography>
          </Stack>
        </Stack>

        <AppLinearProgress
          value={cappedPercentage}
          height={10}
          barColor={
            percentage >= 100
              ? '#DC2626'
              : percentage >= 75
                ? '#F59E0B'
                : '#16A34A'
          }
          trackColor="action.hover"
          sx={{ borderRadius: '5px' }}
        />

        {percentage >= 100 && (
          <Stack
            direction="row"
            spacing={1}
            sx={{
              p: 1.5,
              bgcolor: 'error.light',
              borderRadius: '8px',
              alignItems: 'center',
            }}
          >
            <WarningAmberRoundedIcon color="error" fontSize="small" />
            <Typography
              sx={{ fontSize: '13px', color: 'error.dark', fontWeight: 600 }}
            >
              {t('warningOverBudget')}
            </Typography>
          </Stack>
        )}
      </Stack>
    </AppCard>
  );
};

export default BudgetProgressBar;
