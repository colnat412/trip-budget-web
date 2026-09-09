'use client';

import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { useTranslations } from 'next-intl';
import {
  AppCard,
  AppCategoryChip,
  AppLinearProgress,
} from '@/base/components/ui';
import { formatCurrency } from '@/base/utils';
import type { CategoryBreakdown } from '../types';

export interface CategorySpendingListProps {
  breakdown: CategoryBreakdown[];
  currency?: string;
}

export default function CategorySpendingList({
  breakdown,
  currency = 'VND',
}: CategorySpendingListProps) {
  const t = useTranslations('expense.categoriesList');

  const activeItems = breakdown.filter(
    (item) => item.spentAmount > 0 || item.limitAmount > 0,
  );

  if (activeItems.length === 0) {
    return null;
  }

  return (
    <AppCard
      sx={{
        p: 2.5,
        borderRadius: '16px',
        border: 1,
        borderColor: 'divider',
      }}
    >
      <Stack spacing={2}>
        <Typography
          sx={{ fontSize: '16px', fontWeight: 700, color: 'text.primary' }}
        >
          {t('title')}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          {activeItems.map((item) => {
            const hasLimit = item.limitAmount > 0;
            const isOver = hasLimit && item.spentAmount > item.limitAmount;

            return (
              <Box
                key={item.category}
                sx={{
                  flex: {
                    xs: '1 1 100%',
                    sm: '1 1 calc(50% - 8px)',
                    md: '1 1 calc(33.333% - 11px)',
                  },
                  minWidth: 0,
                }}
              >
                <Stack
                  spacing={1}
                  sx={{
                    p: 2,
                    borderRadius: '12px',
                    bgcolor: 'action.hover',
                    border: 1,
                    borderColor: 'divider',
                  }}
                >
                  <Stack
                    direction="row"
                    sx={{
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <AppCategoryChip category={item.category} />
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: 'text.primary',
                      }}
                    >
                      {formatCurrency(item.spentAmount, currency)}
                    </Typography>
                  </Stack>

                  {hasLimit && (
                    <Stack spacing={0.5}>
                      <Stack
                        direction="row"
                        sx={{
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Typography
                          sx={{ fontSize: '12px', color: 'text.secondary' }}
                        >
                          {t('limit', {
                            amount: formatCurrency(item.limitAmount, currency),
                          })}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '12px',
                            fontWeight: 700,
                            color: isOver ? 'error.main' : 'text.secondary',
                          }}
                        >
                          {item.percentageUsed.toFixed(0)}%
                        </Typography>
                      </Stack>
                      <AppLinearProgress
                        value={Math.min(item.percentageUsed, 100)}
                        barColor={isOver ? '#DC2626' : '#1E3A8A'}
                        height={6}
                        sx={{ borderRadius: '3px' }}
                      />
                    </Stack>
                  )}
                </Stack>
              </Box>
            );
          })}
        </Box>
      </Stack>
    </AppCard>
  );
}
