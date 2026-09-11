'use client';

import React from 'react';
import { Box, Stack, Typography, Skeleton } from '@mui/material';
import PieChartOutlineRoundedIcon from '@mui/icons-material/PieChartOutlineRounded';
import { useTranslations } from 'next-intl';
import { AppLinearProgress } from '@/base/components/ui';
import { CATEGORY_CONFIG } from '@/base/components/ui/AppCategoryChip';
import { formatCurrency } from '@/base/utils';
import useTripBudgetSummary from '@/features/expense/hooks/useTripBudgetSummary';

export interface CategoryListProps {
  tripId?: number | string;
  currency?: string;
}

export default function CategoryList({
  tripId,
  currency = 'VND',
}: CategoryListProps) {
  const tExpense = useTranslations('expense');

  const { summary, isLoading } = useTripBudgetSummary({ tripId });

  if (isLoading) {
    return (
      <Stack spacing={2}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Stack
            key={i}
            direction="row"
            spacing={1.5}
            sx={{ alignItems: 'center' }}
          >
            <Skeleton
              variant="rounded"
              width={38}
              height={38}
              sx={{ borderRadius: '10px' }}
            />
            <Stack spacing={0.75} sx={{ flexGrow: 1 }}>
              <Skeleton variant="text" width="50%" height={18} />
              <Skeleton variant="rounded" width="100%" height={6} />
            </Stack>
            <Skeleton variant="text" width={30} height={18} />
          </Stack>
        ))}
      </Stack>
    );
  }

  const activeCategories =
    summary?.categoryBreakdown?.filter(
      (c) => c.spentAmount > 0 || (c.limitAmount && c.limitAmount > 0),
    ) || [];

  if (activeCategories.length === 0) {
    return (
      <Stack
        spacing={1}
        sx={{
          py: 4,
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: 'text.secondary',
        }}
      >
        <Box
          sx={{
            p: 1.5,
            borderRadius: '50%',
            bgcolor: 'action.hover',
            color: 'text.disabled',
            display: 'inline-flex',
          }}
        >
          <PieChartOutlineRoundedIcon sx={{ fontSize: 32 }} />
        </Box>
        <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>
          {tExpense('table.emptyTitle')}
        </Typography>
        <Typography
          sx={{ fontSize: '12px', color: 'text.disabled', maxWidth: 260 }}
        >
          {tExpense('table.emptyDesc')}
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={2}>
      {activeCategories.map((categoryItem) => {
        const config =
          CATEGORY_CONFIG[categoryItem.category] || CATEGORY_CONFIG.OTHER;
        const categoryLabel =
          tExpense(`categories.${categoryItem.category as 'OTHER'}`) ||
          categoryItem.category;
        const percent = Math.min(
          100,
          Math.max(0, Math.round(categoryItem.percentageUsed)),
        );
        const isOverLimit =
          categoryItem.limitAmount > 0 &&
          categoryItem.spentAmount > categoryItem.limitAmount;

        return (
          <Stack
            key={categoryItem.category}
            direction="row"
            spacing={1.5}
            sx={{ alignItems: 'center' }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                borderRadius: '10px',
                color: config.color,
                bgcolor: config.bg,
                '& svg': { fontSize: '20px' },
              }}
            >
              {config.icon}
            </Box>
            <Stack spacing={0.75} sx={{ minWidth: 0, flexGrow: 1 }}>
              <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: 'center', justifyContent: 'space-between' }}
              >
                <Typography
                  sx={{
                    color: 'text.primary',
                    fontSize: '14px',
                    fontWeight: 700,
                  }}
                >
                  {categoryLabel}
                </Typography>
                <Typography
                  sx={{
                    color: 'text.secondary',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                  }}
                >
                  {formatCurrency(categoryItem.spentAmount, currency)}
                </Typography>
              </Stack>
              <AppLinearProgress
                value={percent}
                height={6}
                trackColor="action.hover"
                barColor={isOverLimit ? '#EF4444' : config.color}
              />
            </Stack>
            <Typography
              sx={{
                width: 34,
                flexShrink: 0,
                color: 'text.secondary',
                fontSize: '11px',
                textAlign: 'right',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {percent}%
            </Typography>
          </Stack>
        );
      })}
    </Stack>
  );
}
