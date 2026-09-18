'use client';

import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import SavingsRoundedIcon from '@mui/icons-material/SavingsRounded';
import { useTranslations } from 'next-intl';
import { AppCard, AppButton } from '@/base/components/ui';
import { formatCurrency, formatCompactCurrency } from '@/base/utils';
import type { TripBudgetSummary } from '../types';

export interface BudgetMetricsCardsProps {
  summary: TripBudgetSummary | null;
  currency?: string;
  onOpenSetBudget?: () => void;
}

const BudgetMetricsCards = ({
  summary,
  currency = 'VND',
  onOpenSetBudget,
}: BudgetMetricsCardsProps) => {
  const t = useTranslations('expense.metrics');
  const totalBudget = summary?.totalBudget ?? 0;
  const actualSpent = summary?.actualSpent ?? 0;
  const remainingBudget = summary?.remainingBudget ?? 0;
  const percentageUsed = summary?.percentageUsed ?? 0;
  const curr = summary?.currency || currency;

  const isOverBudget = remainingBudget < 0;
  const isWarning = percentageUsed > 85 && !isOverBudget;
  const overLimitCategoriesCount = (summary?.categoryBreakdown || []).filter(
    (item) => item.limitAmount > 0 && item.spentAmount > item.limitAmount,
  ).length;

  const cardBorderLeftStyle = (colorToken: string) => ({
    borderLeft: '4px solid',
    borderLeftColor: colorToken,
  });

  return (
    <>
      <Box sx={{ minWidth: 0, height: '100%' }}>
        <AppCard
          sx={{
            p: { xs: 1.75, sm: 2 },
            height: '100%',
            borderRadius: '16px',
            border: 1,
            borderColor: 'divider',
            ...cardBorderLeftStyle('primary.main'),
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
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Box
                sx={{
                  p: 0.6,
                  borderRadius: '8px',
                  bgcolor: 'action.hover',
                  color: 'primary.main',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AccountBalanceWalletRoundedIcon sx={{ fontSize: 18 }} />
              </Box>
              <Typography
                sx={{
                  fontSize: '13px',
                  color: 'text.secondary',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                {t('totalBudget')}
              </Typography>
            </Stack>

            <Typography
              sx={{
                fontFamily: 'var(--font-display)',
                fontSize: { xs: '18px', sm: '20px', xl: '22px' },
                fontWeight: 800,
                color: 'text.primary',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={formatCurrency(totalBudget, curr)}
            >
              {formatCurrency(totalBudget, curr)}
            </Typography>
          </Stack>

          {totalBudget === 0 && onOpenSetBudget ? (
            <Box sx={{ pt: 0.5 }}>
              <AppButton
                size="small"
                intent="secondary"
                onClick={onOpenSetBudget}
                sx={{
                  fontSize: '11px',
                  py: 0.25,
                  px: 1.25,
                  minHeight: 28,
                  whiteSpace: 'nowrap',
                  width: 'fit-content',
                }}
              >
                {t('setupBudget')}
              </AppButton>
            </Box>
          ) : (
            <Typography
              sx={{
                fontSize: '11px',
                color: 'text.secondary',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {t('entireTripLimit')}
            </Typography>
          )}
        </AppCard>
      </Box>

      <Box sx={{ minWidth: 0, height: '100%' }}>
        <AppCard
          sx={{
            p: { xs: 1.75, sm: 2 },
            height: '100%',
            borderRadius: '16px',
            border: 1,
            borderColor: 'divider',
            ...cardBorderLeftStyle(
              isOverBudget
                ? 'error.main'
                : isWarning
                  ? 'secondary.main'
                  : 'primary.main',
            ),
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
                    color: isOverBudget
                      ? 'error.main'
                      : isWarning
                        ? 'secondary.main'
                        : 'primary.main',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ShoppingCartRoundedIcon sx={{ fontSize: 18 }} />
                </Box>
                <Typography
                  sx={{
                    fontSize: '13px',
                    color: 'text.secondary',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {t('actualSpent')}
                </Typography>
              </Stack>

              {totalBudget > 0 && (
                <Box
                  component="span"
                  sx={{
                    px: 0.8,
                    py: 0.2,
                    borderRadius: '999px',
                    bgcolor: isOverBudget
                      ? 'error.light'
                      : isWarning
                        ? 'secondary.light'
                        : 'action.hover',
                    color: isOverBudget
                      ? 'error.dark'
                      : isWarning
                        ? 'secondary.dark'
                        : 'primary.main',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: 800,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {percentageUsed.toFixed(0)}%
                </Box>
              )}
            </Stack>

            <Typography
              sx={{
                fontFamily: 'var(--font-display)',
                fontSize: { xs: '18px', sm: '20px', xl: '22px' },
                fontWeight: 800,
                color: isOverBudget ? 'error.main' : 'text.primary',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={formatCurrency(actualSpent, curr)}
            >
              {formatCurrency(actualSpent, curr)}
            </Typography>
          </Stack>

          <Stack
            direction="row"
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 0.5,
            }}
          >
            <Typography
              sx={{
                fontSize: '11px',
                color: isOverBudget ? 'error.main' : 'text.secondary',
                fontFamily: 'var(--font-mono)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {totalBudget > 0
                ? `${t('percentOfBudget', { percent: percentageUsed.toFixed(1) })} · / ${formatCompactCurrency(totalBudget, curr)}`
                : t('noLimit')}
            </Typography>

            {overLimitCategoriesCount > 0 && (
              <Typography
                sx={{
                  fontSize: '11px',
                  color: 'error.main',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  whiteSpace: 'nowrap',
                }}
              >
                ⚠️{' '}
                {t('categoriesOverLimit', { count: overLimitCategoriesCount })}
              </Typography>
            )}
          </Stack>
        </AppCard>
      </Box>

      <Box sx={{ minWidth: 0, height: '100%' }}>
        <AppCard
          sx={{
            p: { xs: 1.75, sm: 2 },
            height: '100%',
            borderRadius: '16px',
            border: 1,
            borderColor: 'divider',
            ...cardBorderLeftStyle(
              isOverBudget ? 'error.main' : 'success.main',
            ),
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
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Box
                sx={{
                  p: 0.6,
                  borderRadius: '8px',
                  bgcolor: 'action.hover',
                  color: isOverBudget ? 'error.main' : 'success.main',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SavingsRoundedIcon sx={{ fontSize: 18 }} />
              </Box>
              <Typography
                sx={{
                  fontSize: '13px',
                  color: 'text.secondary',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                {isOverBudget ? t('overBudget') : t('remainingBudget')}
              </Typography>
            </Stack>

            <Typography
              sx={{
                fontFamily: 'var(--font-display)',
                fontSize: { xs: '18px', sm: '20px', xl: '22px' },
                fontWeight: 800,
                color: isOverBudget ? 'error.main' : 'success.main',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={formatCurrency(Math.abs(remainingBudget), curr)}
            >
              {formatCurrency(Math.abs(remainingBudget), curr)}
            </Typography>
          </Stack>

          <Typography
            sx={{
              fontSize: '11px',
              color: isOverBudget ? 'error.main' : 'success.main',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {isOverBudget ? t('warningNeedCompensation') : t('underControl')}
          </Typography>
        </AppCard>
      </Box>
    </>
  );
};

export default BudgetMetricsCards;
