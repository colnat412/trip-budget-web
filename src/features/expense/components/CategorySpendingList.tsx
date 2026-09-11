'use client';

import React from 'react';
import { Box, Typography, Stack, Tooltip } from '@mui/material';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import { useTranslations } from 'next-intl';
import { AppCard } from '@/base/components/ui';
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

  const totalSpentInCategories = activeItems.reduce(
    (sum, item) => sum + item.spentAmount,
    0,
  );

  const sortedItems = [...activeItems].sort(
    (a, b) => b.spentAmount - a.spentAmount,
  );

  const topCategories = sortedItems.slice(0, 2);

  return (
    <Box sx={{ minWidth: 0, height: '100%' }}>
      <AppCard
        sx={{
          p: { xs: 1.75, sm: 2 },
          height: '100%',
          borderRadius: '16px',
          border: 1,
          borderColor: 'divider',
          borderLeft: '4px solid',
          borderLeftColor: 'secondary.main',
        }}
        contentSx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: 1,
        }}
      >
        <Stack spacing={0.75}>
          <Stack
            direction="row"
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Box
                sx={{
                  p: 0.6,
                  borderRadius: '8px',
                  bgcolor: 'action.hover',
                  color: 'secondary.main',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CategoryRoundedIcon sx={{ fontSize: 18 }} />
              </Box>
              <Typography
                sx={{
                  fontSize: '13px',
                  color: 'text.secondary',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                {t('title')}
              </Typography>
            </Stack>

            <Box
              component="span"
              sx={{
                px: 0.8,
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

          <Box
            sx={{
              display: 'flex',
              width: '100%',
              height: 7,
              borderRadius: '4px',
              overflow: 'hidden',
              bgcolor: 'action.hover',
              my: 0.5,
            }}
          >
            {totalSpentInCategories > 0 ? (
              sortedItems.map((item) => {
                const config =
                  CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG.OTHER;
                const percent =
                  (item.spentAmount / totalSpentInCategories) * 100;
                const categoryName =
                  tCategories(item.category as 'OTHER') || item.category;

                return (
                  <Tooltip
                    key={item.category}
                    title={`${categoryName}: ${formatCurrency(item.spentAmount, currency)} (${percent.toFixed(0)}%)`}
                    arrow
                  >
                    <Box
                      sx={{
                        width: `${percent}%`,
                        bgcolor: config.color,
                        minWidth: item.spentAmount > 0 ? '4px' : 0,
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </Tooltip>
                );
              })
            ) : (
              <Box sx={{ width: '100%', bgcolor: 'divider' }} />
            )}
          </Box>
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: 'center',
            overflow: 'hidden',
            flexWrap: 'nowrap',
          }}
        >
          {topCategories.map((item) => {
            const config =
              CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG.OTHER;
            const categoryName =
              tCategories(item.category as 'OTHER') || item.category;

            return (
              <Tooltip
                key={item.category}
                title={`${categoryName}: ${formatCurrency(item.spentAmount, currency)}`}
                arrow
              >
                <Stack
                  direction="row"
                  spacing={0.5}
                  sx={{
                    alignItems: 'center',
                    px: 0.75,
                    py: 0.2,
                    borderRadius: '6px',
                    bgcolor: 'action.hover',
                    minWidth: 0,
                    flexShrink: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: config.color,
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    noWrap
                    sx={{
                      fontSize: '11px',
                      color: 'text.secondary',
                      fontWeight: 600,
                    }}
                  >
                    {categoryName}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '11px',
                      color: 'text.primary',
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {formatCompactCurrency(item.spentAmount, currency)}
                  </Typography>
                </Stack>
              </Tooltip>
            );
          })}
          {sortedItems.length > 2 && (
            <Typography
              sx={{
                fontSize: '10px',
                color: 'text.disabled',
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              +{sortedItems.length - 2}
            </Typography>
          )}
        </Stack>
      </AppCard>
    </Box>
  );
}
