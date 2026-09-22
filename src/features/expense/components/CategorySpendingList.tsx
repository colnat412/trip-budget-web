'use client';

import React from 'react';
import { Box, Typography, Stack, Tooltip, Chip } from '@mui/material';
import { alpha } from '@mui/material/styles';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import { useTranslations } from 'next-intl';
import { AppCard, AppButton } from '@/base/components/ui';
import { CATEGORY_CONFIG } from '@/base/components/ui/AppCategoryChip';
import { formatCurrency, formatCompactCurrency } from '@/base/utils';
import type { CategoryBreakdown } from '../types';

export interface CategorySpendingListProps {
  breakdown: CategoryBreakdown[];
  currency?: string;
  onOpenSetBudget?: () => void;
}

const CategorySpendingList = ({
  breakdown,
  currency = 'VND',
  onOpenSetBudget,
}: CategorySpendingListProps) => {
  const t = useTranslations('expense.categoriesList');
  const tCategories = useTranslations('expense.categories');

  const activeItems = breakdown.filter(
    (item) =>
      item.spentAmount > 0 || (item.limitAmount && item.limitAmount > 0),
  );

  if (activeItems.length === 0) {
    return null;
  }

  const totalSpentInCategories = activeItems.reduce(
    (sum, item) => sum + item.spentAmount,
    0,
  );

  const overLimitItems = activeItems.filter(
    (item) => item.limitAmount > 0 && item.spentAmount > item.limitAmount,
  );

  const hasAnyLimit = activeItems.some(
    (item) => item.limitAmount && item.limitAmount > 0,
  );

  // Backend (/api/trip/{id}/expenses/summary) returns categoryBreakdown already pre-sorted (over-limit first, then highest spent)
  const sortedItems = activeItems;

  return (
    <Box sx={{ width: '100%', minWidth: 0 }}>
      <AppCard
        sx={{
          p: { xs: 2, sm: 2.5 },
          borderRadius: '16px',
          border: 1,
          borderColor: overLimitItems.length > 0 ? 'error.light' : 'divider',
          borderLeft: '4px solid',
          borderLeftColor:
            overLimitItems.length > 0 ? 'error.main' : 'secondary.main',
        }}
        contentSx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          sx={{
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
          }}
        >
          <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
            <Box
              sx={{
                p: 0.75,
                borderRadius: '10px',
                bgcolor:
                  overLimitItems.length > 0 ? 'error.light' : 'action.hover',
                color:
                  overLimitItems.length > 0 ? 'error.main' : 'secondary.main',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CategoryRoundedIcon sx={{ fontSize: 20 }} />
            </Box>
            <Stack spacing={0.25}>
              <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 0.75 }}
              >
                <Typography
                  sx={{
                    fontSize: '15px',
                    color: 'text.primary',
                    fontWeight: 700,
                  }}
                >
                  {t('title')}
                </Typography>
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
                {overLimitItems.length > 0 ? (
                  <Chip
                    size="small"
                    icon={
                      <WarningAmberRoundedIcon
                        sx={{ fontSize: '14px !important' }}
                      />
                    }
                    label={t('overBudgetCount', {
                      count: overLimitItems.length,
                    })}
                    color="error"
                    sx={{
                      height: 22,
                      fontSize: '11px',
                      fontWeight: 800,
                      fontFamily: 'var(--font-mono)',
                    }}
                  />
                ) : hasAnyLimit ? (
                  <Chip
                    size="small"
                    label={t('allUnderControl')}
                    color="success"
                    variant="outlined"
                    sx={{
                      height: 22,
                      fontSize: '11px',
                      fontWeight: 600,
                    }}
                  />
                ) : null}
              </Stack>
            </Stack>
          </Stack>

          <Stack
            direction="row"
            spacing={1.5}
            sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1 }}
          >
            {totalSpentInCategories > 0 && (
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                }}
              >
                Tổng chi danh mục:{' '}
                <strong>
                  {formatCurrency(totalSpentInCategories, currency)}
                </strong>
              </Typography>
            )}

            {onOpenSetBudget && (
              <AppButton
                size="small"
                intent="secondary"
                startIcon={<TuneRoundedIcon sx={{ fontSize: 16 }} />}
                onClick={onOpenSetBudget}
                sx={{
                  fontSize: '12px',
                  py: 0.25,
                  px: 1.25,
                  minHeight: 28,
                  whiteSpace: 'nowrap',
                }}
              >
                {t('adjustBudget')}
              </AppButton>
            )}
          </Stack>
        </Stack>

        {overLimitItems.length > 0 && (
          <Box
            sx={{
              p: 1.5,
              borderRadius: '12px',
              bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
              border: 1,
              borderColor: (theme) => alpha(theme.palette.error.main, 0.25),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 1.5,
            }}
          >
            <Stack
              direction="row"
              spacing={1.25}
              sx={{ alignItems: 'center', minWidth: 0, flex: 1 }}
            >
              <Box
                sx={{
                  p: 0.6,
                  borderRadius: '8px',
                  bgcolor: 'error.main',
                  color: '#ffffff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <WarningAmberRoundedIcon sx={{ fontSize: 18 }} />
              </Box>
              <Stack spacing={0.25} sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'error.main',
                  }}
                >
                  {t('overBudgetAlert', { count: overLimitItems.length })}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '12px',
                    color: 'text.secondary',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {overLimitItems
                    .map((item) => {
                      const name =
                        tCategories(item.category as 'OTHER') || item.category;
                      const diff = item.spentAmount - item.limitAmount;
                      return `${name} (vượt +${formatCurrency(diff, currency)})`;
                    })
                    .join(' · ')}
                </Typography>
              </Stack>
            </Stack>

            {onOpenSetBudget && (
              <AppButton
                size="small"
                intent="secondary"
                onClick={onOpenSetBudget}
                sx={{
                  fontSize: '11px',
                  py: 0.25,
                  px: 1.25,
                  minHeight: 28,
                  color: 'error.main',
                  borderColor: 'error.main',
                  '&:hover': {
                    bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
                    borderColor: 'error.dark',
                  },
                }}
              >
                {t('adjustBudget')}
              </AppButton>
            )}
          </Box>
        )}

        <Box
          sx={{
            display: 'flex',
            width: '100%',
            height: 10,
            borderRadius: '6px',
            overflow: 'hidden',
            bgcolor: 'action.hover',
          }}
        >
          {totalSpentInCategories > 0 ? (
            sortedItems.map((item) => {
              const config =
                CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG.OTHER;
              const percent = (item.spentAmount / totalSpentInCategories) * 100;
              const categoryName =
                tCategories(item.category as 'OTHER') || item.category;
              const hasLimit = item.limitAmount > 0;
              const isOver = hasLimit && item.spentAmount > item.limitAmount;
              const overAmount = isOver
                ? item.spentAmount - item.limitAmount
                : 0;
              const percentOfLimit = hasLimit
                ? (item.spentAmount / item.limitAmount) * 100
                : 0;

              let tooltipTitle = `${categoryName}: ${formatCurrency(item.spentAmount, currency)} (${percent.toFixed(1)}% tổng chi)`;
              if (hasLimit) {
                if (isOver) {
                  tooltipTitle += ` · [CẢNH BÁO: Vượt ${formatCurrency(overAmount, currency)} (${percentOfLimit.toFixed(0)}% hạn mức)]`;
                } else {
                  tooltipTitle += ` · [Hạn mức: ${formatCurrency(item.limitAmount, currency)} - Đã dùng ${percentOfLimit.toFixed(0)}%]`;
                }
              }

              return (
                <Tooltip key={item.category} title={tooltipTitle} arrow>
                  <Box
                    sx={{
                      width: `${percent}%`,
                      bgcolor: isOver ? 'error.main' : config.color,
                      minWidth: item.spentAmount > 0 ? '6px' : 0,
                      transition: 'width 0.3s ease',
                      borderRight: '1px solid',
                      borderRightColor: 'background.paper',
                      '&:hover': { opacity: 0.85 },
                    }}
                  />
                </Tooltip>
              );
            })
          ) : (
            <Box sx={{ width: '100%', bgcolor: 'divider' }} />
          )}
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: 1.5,
          }}
        >
          {sortedItems.map((item) => {
            const config =
              CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG.OTHER;
            const categoryName =
              tCategories(item.category as 'OTHER') || item.category;
            const percentOfTotal =
              totalSpentInCategories > 0
                ? ((item.spentAmount / totalSpentInCategories) * 100).toFixed(0)
                : '0';

            const hasLimit = item.limitAmount > 0;
            const isOver = hasLimit && item.spentAmount > item.limitAmount;
            const percentOfLimit = hasLimit
              ? (item.spentAmount / item.limitAmount) * 100
              : 0;
            const isWarning = hasLimit && !isOver && percentOfLimit >= 80;
            const overAmount = isOver ? item.spentAmount - item.limitAmount : 0;
            const remainingAmount =
              hasLimit && !isOver ? item.limitAmount - item.spentAmount : 0;

            return (
              <Box
                key={item.category}
                sx={{
                  p: 1.5,
                  borderRadius: '12px',
                  bgcolor: isOver
                    ? (theme) => alpha(theme.palette.error.main, 0.05)
                    : isWarning
                      ? (theme) => alpha(theme.palette.warning.main, 0.04)
                      : 'action.hover',
                  border: 1,
                  borderColor: isOver
                    ? 'error.main'
                    : isWarning
                      ? 'warning.main'
                      : 'divider',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  minWidth: 0,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: (theme) => {
                      return isOver
                        ? `0 2px 10px ${alpha(theme.palette.error.main, 0.15)}`
                        : `0 2px 8px ${alpha(theme.palette.text.primary, 0.05)}`;
                    },
                  },
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    minWidth: 0,
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      alignItems: 'center',
                      minWidth: 0,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        bgcolor: isOver ? 'error.main' : config.color,
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      noWrap
                      sx={{
                        fontSize: '13px',
                        color: isOver ? 'error.main' : 'text.primary',
                        fontWeight: 700,
                      }}
                      title={categoryName}
                    >
                      {categoryName}
                    </Typography>
                  </Stack>

                  {isOver ? (
                    <Chip
                      size="small"
                      icon={
                        <TrendingUpRoundedIcon
                          sx={{ fontSize: '13px !important' }}
                        />
                      }
                      label={t('overBudgetBadge', {
                        amount: formatCompactCurrency(overAmount, currency),
                      })}
                      color="error"
                      sx={{
                        height: 22,
                        fontSize: '10.5px',
                        fontWeight: 800,
                        fontFamily: 'var(--font-mono)',
                        flexShrink: 0,
                      }}
                    />
                  ) : isWarning ? (
                    <Chip
                      size="small"
                      label={`${percentOfLimit.toFixed(0)}%`}
                      sx={{
                        height: 20,
                        fontSize: '10.5px',
                        fontWeight: 700,
                        bgcolor: 'warning.light',
                        color: 'warning.dark',
                        fontFamily: 'var(--font-mono)',
                        flexShrink: 0,
                      }}
                    />
                  ) : hasLimit ? (
                    <Chip
                      size="small"
                      label={`${percentOfLimit.toFixed(0)}%`}
                      sx={{
                        height: 20,
                        fontSize: '10.5px',
                        fontWeight: 600,
                        bgcolor: 'action.selected',
                        color: 'text.secondary',
                        fontFamily: 'var(--font-mono)',
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <Typography
                      sx={{
                        fontSize: '11px',
                        color: 'text.secondary',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 500,
                        flexShrink: 0,
                      }}
                    >
                      {percentOfTotal}% tổng
                    </Typography>
                  )}
                </Stack>

                <Stack
                  direction="row"
                  spacing={0.5}
                  sx={{
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    flexWrap: 'wrap',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '14px',
                      color: isOver ? 'error.main' : 'text.primary',
                      fontWeight: 800,
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {formatCurrency(item.spentAmount, currency)}
                  </Typography>

                  {hasLimit ? (
                    <Typography
                      sx={{
                        fontSize: '11.5px',
                        color: 'text.secondary',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 600,
                      }}
                    >
                      / {formatCompactCurrency(item.limitAmount, currency)}
                    </Typography>
                  ) : (
                    <Typography
                      sx={{
                        fontSize: '11px',
                        color: 'text.disabled',
                        fontStyle: 'italic',
                      }}
                    >
                      {t('noLimit')}
                    </Typography>
                  )}
                </Stack>

                {hasLimit ? (
                  <Box sx={{ width: '100%', mt: 0.25 }}>
                    <Box
                      sx={{
                        width: '100%',
                        height: 5,
                        borderRadius: '3px',
                        bgcolor: 'action.selected',
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          height: '100%',
                          width: `${Math.min(100, percentOfLimit)}%`,
                          bgcolor: isOver
                            ? 'error.main'
                            : isWarning
                              ? 'warning.main'
                              : config.color,
                          borderRadius: '3px',
                          transition: 'width 0.4s ease',
                        }}
                      />
                    </Box>
                    <Stack
                      direction="row"
                      sx={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 0.5,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '10.5px',
                          color: isOver
                            ? 'error.main'
                            : isWarning
                              ? 'warning.dark'
                              : 'text.secondary',
                          fontWeight: isOver || isWarning ? 700 : 500,
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {isOver
                          ? t('exceededPercent', {
                              percent: percentOfLimit.toFixed(0),
                            })
                          : t('usedPercent', {
                              percent: percentOfLimit.toFixed(0),
                            })}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '10.5px',
                          color: isOver ? 'error.main' : 'text.secondary',
                          fontWeight: isOver ? 700 : 500,
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {isOver
                          ? `+${formatCompactCurrency(overAmount, currency)}`
                          : t('remaining', {
                              amount: formatCompactCurrency(
                                remainingAmount,
                                currency,
                              ),
                            })}
                      </Typography>
                    </Stack>
                  </Box>
                ) : (
                  <Typography
                    sx={{
                      fontSize: '10.5px',
                      color: 'text.secondary',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    Chiếm {percentOfTotal}% tổng chi tiêu
                  </Typography>
                )}
              </Box>
            );
          })}
        </Box>
      </AppCard>
    </Box>
  );
};

export default CategorySpendingList;
