'use client';

import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import SavingsRoundedIcon from '@mui/icons-material/SavingsRounded';
import { useTranslations } from 'next-intl';
import { AppCard, AppButton, AppLinearProgress } from '@/base/components/ui';
import { formatCurrency, formatCompactCurrency } from '@/base/utils';
import type { TripBudgetSummary } from '../types';

export interface BudgetMetricsCardsProps {
  summary: TripBudgetSummary | null;
  currency?: string;
  onOpenSetBudget?: () => void;
}

export default function BudgetMetricsCards({
  summary,
  currency = 'VND',
  onOpenSetBudget,
}: BudgetMetricsCardsProps) {
  const t = useTranslations('expense.metrics');
  const totalBudget = summary?.totalBudget ?? 0;
  const actualSpent = summary?.actualSpent ?? 0;
  const remainingBudget = summary?.remainingBudget ?? 0;
  const curr = summary?.currency || currency;

  const isOverBudget = remainingBudget < 0;

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      sx={{ height: '100%' }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <AppCard
          sx={{
            p: { xs: 2, xl: 2.5 },
            height: '100%',
            borderRadius: '16px',
            border: 1,
            borderColor: 'divider',
            borderLeft: '4px solid #1E3A8A',
          }}
          contentSx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Box
                sx={{
                  p: 0.8,
                  borderRadius: '8px',
                  bgcolor: '#E0E7FF',
                  color: 'primary.main',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AccountBalanceWalletRoundedIcon fontSize="small" />
              </Box>
              <Typography
                sx={{
                  fontSize: '14px',
                  color: 'text.secondary',
                  fontWeight: 600,
                }}
              >
                {t('totalBudget')}
              </Typography>
            </Stack>
            <Typography
              sx={{
                fontFamily: 'var(--font-display)',
                fontSize: { xs: '20px', md: '22px', xl: '24px' },
                fontWeight: 800,
                color: 'text.primary',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {formatCurrency(totalBudget, curr)}
            </Typography>
          </Stack>
          {totalBudget === 0 && onOpenSetBudget ? (
            <Box sx={{ pt: 2 }}>
              <AppButton
                size="small"
                intent="secondary"
                onClick={onOpenSetBudget}
                sx={{
                  fontSize: '12px',
                  py: 0.5,
                  px: 1.5,
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
                fontSize: '12px',
                color: 'text.secondary',
                pt: 2,
                display: 'block',
              }}
            >
              {t('entireTripLimit')}
            </Typography>
          )}
        </AppCard>
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <AppCard
          sx={{
            p: { xs: 2, xl: 2.5 },
            height: '100%',
            borderRadius: '16px',
            border: 1,
            borderColor: 'divider',
            borderLeft: `4px solid ${isOverBudget ? '#DC2626' : (summary?.percentageUsed ?? 0) > 85 ? '#F59E0B' : '#1E3A8A'}`,
          }}
          contentSx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Stack spacing={1}>
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
                    p: 0.8,
                    borderRadius: '8px',
                    bgcolor: '#FEF3C7',
                    color: 'secondary.dark',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ShoppingCartRoundedIcon fontSize="small" />
                </Box>
                <Typography
                  sx={{
                    fontSize: '14px',
                    color: 'text.secondary',
                    fontWeight: 600,
                  }}
                >
                  {t('actualSpent')}
                </Typography>
              </Stack>
              {totalBudget > 0 && (
                <Typography
                  sx={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    fontWeight: 800,
                    color: isOverBudget
                      ? 'error.main'
                      : (summary?.percentageUsed ?? 0) > 85
                        ? 'warning.main'
                        : 'primary.main',
                  }}
                >
                  {summary?.percentageUsed.toFixed(1)}%
                </Typography>
              )}
            </Stack>
            <Typography
              sx={{
                fontFamily: 'var(--font-display)',
                fontSize: { xs: '20px', md: '22px', xl: '24px' },
                fontWeight: 800,
                color: isOverBudget ? 'error.main' : 'secondary.dark',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {formatCurrency(actualSpent, curr)}
            </Typography>
          </Stack>

          {totalBudget > 0 ? (
            <Stack spacing={0.5} sx={{ pt: 1.5 }}>
              <AppLinearProgress
                value={Math.min(summary?.percentageUsed ?? 0, 100)}
                height={6}
                barColor={
                  isOverBudget
                    ? '#DC2626'
                    : (summary?.percentageUsed ?? 0) > 85
                      ? '#F59E0B'
                      : '#1E3A8A'
                }
                trackColor="action.hover"
                sx={{ borderRadius: '3px' }}
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
                    fontSize: '11px',
                    color: isOverBudget ? 'error.main' : 'text.secondary',
                    fontFamily: 'var(--font-mono)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {t('percentOfBudget', {
                    percent: summary?.percentageUsed.toFixed(1) ?? '0',
                  })}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '11px',
                    color: 'text.disabled',
                    fontFamily: 'var(--font-mono)',
                    whiteSpace: 'nowrap',
                  }}
                  title={formatCurrency(totalBudget, curr)}
                >
                  / {formatCompactCurrency(totalBudget, curr)}
                </Typography>
              </Stack>
            </Stack>
          ) : (
            <Typography
              sx={{
                fontSize: '12px',
                color: 'text.secondary',
                pt: 1.5,
                display: 'block',
              }}
            >
              {t('noLimit')}
            </Typography>
          )}
        </AppCard>
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <AppCard
          sx={{
            p: { xs: 2, xl: 2.5 },
            height: '100%',
            borderRadius: '16px',
            border: 1,
            borderColor: 'divider',
            borderLeft: `4px solid ${isOverBudget ? '#DC2626' : '#16A34A'}`,
          }}
          contentSx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Box
                sx={{
                  p: 0.8,
                  borderRadius: '8px',
                  bgcolor: isOverBudget ? 'error.light' : 'success.light',
                  color: isOverBudget ? 'error.main' : 'success.main',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SavingsRoundedIcon fontSize="small" />
              </Box>
              <Typography
                sx={{
                  fontSize: '14px',
                  color: 'text.secondary',
                  fontWeight: 600,
                }}
              >
                {isOverBudget ? t('overBudget') : t('remainingBudget')}
              </Typography>
            </Stack>
            <Typography
              sx={{
                fontFamily: 'var(--font-display)',
                fontSize: { xs: '20px', md: '22px', xl: '24px' },
                fontWeight: 800,
                color: isOverBudget ? 'error.main' : 'success.main',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {formatCurrency(Math.abs(remainingBudget), curr)}
            </Typography>
          </Stack>
          <Typography
            sx={{
              fontSize: '12px',
              color: isOverBudget ? 'error.main' : 'success.main',
              fontWeight: 600,
              pt: 2,
              display: 'block',
            }}
          >
            {isOverBudget ? t('warningNeedCompensation') : t('underControl')}
          </Typography>
        </AppCard>
      </Box>
    </Stack>
  );
}
