'use client';

import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import { useTranslations } from 'next-intl';
import { AppCard, AppLinearProgress } from '@/base/components/ui';
import { CATEGORY_CONFIG } from '@/base/components/ui/AppCategoryChip';
import { formatCurrency, formatCompactCurrency } from '@/base/utils';
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
  const tCategories = useTranslations('expense.categories');

  const activeItems = breakdown.filter(
    (item) => item.spentAmount > 0 || item.limitAmount > 0,
  );

  if (activeItems.length === 0) {
    return null;
  }

  return (
    <AppCard
      sx={{
        p: { xs: 2, xl: 2.25 },
        height: '100%',
        borderRadius: '16px',
        border: 1,
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
      }}
      contentSx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        p: '0 !important',
      }}
    >
      <Stack
        direction="row"
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1.25,
          flexShrink: 0,
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Box
            sx={{
              p: 0.6,
              borderRadius: '8px',
              bgcolor: 'action.hover',
              color: 'text.secondary',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            <CategoryRoundedIcon sx={{ fontSize: 18 }} />
          </Box>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 700,
              color: 'text.primary',
            }}
          >
            {t('title')}
          </Typography>
        </Stack>

        <Box
          component="span"
          sx={{
            px: 1,
            py: 0.2,
            borderRadius: '999px',
            bgcolor: 'action.hover',
            color: 'text.secondary',
            fontSize: '11px',
            fontWeight: 700,
            fontFamily: 'var(--font-mono)',
          }}
        >
          {activeItems.length}
        </Box>
      </Stack>

      <Stack
        spacing={1.25}
        sx={{
          flexGrow: 1,
          minHeight: 0,
          maxHeight: { xs: 240, lg: 130 },
          overflowY: 'auto',
          pr: 0.5,
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'divider',
            borderRadius: '4px',
          },
        }}
      >
        {activeItems.map((item) => {
          const config =
            CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG.OTHER;
          const isOver =
            item.limitAmount > 0 && item.spentAmount > item.limitAmount;
          const categoryName =
            tCategories(item.category as 'OTHER') || item.category;
          const hasLimit = item.limitAmount > 0;

          return (
            <Stack key={item.category} spacing={0.5}>
              <Stack
                direction="row"
                sx={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Stack
                  direction="row"
                  spacing={0.75}
                  sx={{ alignItems: 'center', minWidth: 0 }}
                >
                  <Box
                    sx={{
                      color: config.color,
                      display: 'flex',
                      alignItems: 'center',
                      '& svg': { fontSize: 15 },
                      flexShrink: 0,
                    }}
                  >
                    {config.icon}
                  </Box>
                  <Typography
                    noWrap
                    sx={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'text.primary',
                    }}
                  >
                    {categoryName}
                  </Typography>
                </Stack>

                <Typography
                  sx={{
                    fontSize: '12px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    color: isOver ? 'error.main' : 'text.primary',
                    flexShrink: 0,
                  }}
                >
                  {formatCurrency(item.spentAmount, currency)}
                </Typography>
              </Stack>

              {hasLimit && (
                <Stack spacing={0.25}>
                  <AppLinearProgress
                    value={Math.min(item.percentageUsed, 100)}
                    barColor={isOver ? '#DC2626' : config.color}
                    height={4}
                    sx={{ borderRadius: '2px' }}
                  />
                  <Stack
                    direction="row"
                    sx={{
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '10px',
                        color: 'text.secondary',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {t('limit', {
                        amount: formatCompactCurrency(
                          item.limitAmount,
                          currency,
                        ),
                      })}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '10px',
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)',
                        color: isOver ? 'error.main' : 'text.secondary',
                      }}
                    >
                      {item.percentageUsed.toFixed(0)}%
                    </Typography>
                  </Stack>
                </Stack>
              )}
            </Stack>
          );
        })}
      </Stack>
    </AppCard>
  );
}
