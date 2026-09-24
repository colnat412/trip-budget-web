'use client';

import React, { useMemo, useState } from 'react';
import { Box, Stack, Typography, Divider } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useTranslations } from 'next-intl';
import { AppButton, AppNumberInput } from '@/base/components/ui';
import { TRIP_CATEGORIES } from '@/base/constants';
import { formatCurrency } from '@/base/utils';
import type {
  ExpenseCategory,
  SetBudgetPayload,
  TripBudgetSummary,
} from '../types';

export interface SetBudgetFormProps {
  summary: TripBudgetSummary | null;
  tripCurrency?: string;
  isLoading?: boolean;
  onSubmit: (payload: SetBudgetPayload) => void;
  onCancel: () => void;
}

const CATEGORY_KEYS = TRIP_CATEGORIES;

const SetBudgetForm = ({
  summary,
  tripCurrency = 'VND',
  isLoading = false,
  onSubmit,
  onCancel,
}: SetBudgetFormProps) => {
  const tDialog = useTranslations('expense.dialog');
  const tForm = useTranslations('expense.form');
  const tCat = useTranslations('expense.categories');

  const categories = useMemo(
    () =>
      CATEGORY_KEYS.map((key) => ({
        key,
        label: tCat(key),
      })),
    [tCat],
  );

  const [totalBudget, setTotalBudget] = useState(
    summary?.totalBudget !== undefined && summary?.totalBudget !== null
      ? String(summary.totalBudget)
      : '',
  );

  const initialCategoryLimits: Partial<Record<ExpenseCategory, string>> = {};
  if (summary?.categoryBreakdown) {
    summary.categoryBreakdown.forEach((item) => {
      if (item.limitAmount > 0) {
        initialCategoryLimits[item.category] = String(item.limitAmount);
      }
    });
  }

  const [categoryLimits, setCategoryLimits] = useState<
    Partial<Record<ExpenseCategory, string>>
  >(initialCategoryLimits);

  const [error, setError] = useState<string | undefined>();

  const handleCategoryChange = (key: ExpenseCategory, val: string) => {
    const updatedLimits: Partial<Record<ExpenseCategory, string>> = {
      ...categoryLimits,
      [key]: val,
    };
    setCategoryLimits(updatedLimits);

    const calculatedTotal = Object.values(updatedLimits).reduce<number>(
      (sum, limitVal) => {
        if (!limitVal) return sum;
        const n = Number(limitVal);
        return !isNaN(n) && n > 0 ? sum + n : sum;
      },
      0,
    );

    setTotalBudget(calculatedTotal > 0 ? String(calculatedTotal) : '');
    if (error) setError(undefined);
  };

  const numericTotalBudget = useMemo(() => {
    if (!totalBudget || isNaN(Number(totalBudget))) return 0;
    return Math.max(0, Number(totalBudget));
  }, [totalBudget]);

  const allocatedTotal = useMemo(() => {
    return Object.values(categoryLimits).reduce<number>((sum, val) => {
      if (!val) return sum;
      const n = Number(val);
      return !isNaN(n) && n > 0 ? sum + n : sum;
    }, 0);
  }, [categoryLimits]);

  const isOverAllocated =
    numericTotalBudget > 0 && allocatedTotal > numericTotalBudget;
  const diffAmount = Math.abs(allocatedTotal - numericTotalBudget);
  const remainingToAllocate = numericTotalBudget - allocatedTotal;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      totalBudget.trim() === '' ||
      isNaN(Number(totalBudget)) ||
      Number(totalBudget) < 0
    ) {
      setError(tForm('errors.totalBudgetRequired'));
      return;
    }

    const parsedLimits: Partial<Record<ExpenseCategory, number>> = {};
    CATEGORY_KEYS.forEach((key) => {
      const val = categoryLimits[key];
      if (val !== undefined && val.trim() !== '') {
        const num = Number(val);
        if (!isNaN(num) && num >= 0) {
          parsedLimits[key] = num;
        }
      } else if (initialCategoryLimits[key]) {
        parsedLimits[key] = 0;
      }
    });

    onSubmit({
      totalBudget: Number(totalBudget),
      currency: tripCurrency,
      categoryLimits: parsedLimits,
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <Typography variant="body2" color="text.secondary">
        {tDialog('setBudgetDesc')}
      </Typography>

      <AppNumberInput
        label={tDialog('totalBudgetLabel')}
        placeholder={tDialog('totalBudgetPlaceholder')}
        currencySuffix={tripCurrency}
        value={totalBudget}
        onChange={(e) => {
          setTotalBudget(e.target.value);
          if (error) setError(undefined);
        }}
        error={Boolean(error)}
        helperText={error}
        autoFocus
      />

      {numericTotalBudget > 0 && (
        <Box
          sx={{
            p: 2,
            borderRadius: '12px',
            bgcolor: (theme) => {
              return isOverAllocated
                ? alpha(theme.palette.error.main, 0.08)
                : (theme.vars?.palette ?? theme.palette).action.hover;
            },
            border: 1,
            borderColor: isOverAllocated ? 'error.main' : 'divider',
            transition: 'all 0.2s ease',
          }}
        >
          <Stack spacing={1}>
            <Stack
              direction="row"
              sx={{ justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Typography
                sx={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'text.secondary',
                }}
              >
                {tDialog('allocationStatus')}
              </Typography>
              <Typography
                sx={{
                  fontSize: '13px',
                  fontWeight: 800,
                  color: isOverAllocated ? 'error.main' : 'success.main',
                }}
              >
                {formatCurrency(allocatedTotal, tripCurrency)} /{' '}
                {formatCurrency(numericTotalBudget, tripCurrency)}
              </Typography>
            </Stack>

            <Box
              sx={{
                width: '100%',
                height: 6,
                borderRadius: 3,
                bgcolor: 'divider',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  width: `${Math.min(100, (allocatedTotal / numericTotalBudget) * 100)}%`,
                  bgcolor: isOverAllocated ? 'error.main' : 'success.main',
                  transition: 'width 0.3s ease',
                }}
              />
            </Box>

            {isOverAllocated ? (
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1}
                sx={{
                  justifyContent: 'space-between',
                  alignItems: { sm: 'center' },
                  pt: 0.5,
                }}
              >
                <Typography
                  sx={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'error.main',
                  }}
                >
                  ⚠️{' '}
                  {tDialog('warningOverAllocated', {
                    amount: formatCurrency(diffAmount, tripCurrency),
                  })}
                </Typography>
                <AppButton
                  size="small"
                  intent="secondary"
                  onClick={() => setTotalBudget(String(allocatedTotal))}
                  sx={{
                    fontSize: '11px',
                    py: 0.25,
                    px: 1.25,
                    height: '26px',
                    whiteSpace: 'nowrap',
                    alignSelf: { xs: 'flex-start', sm: 'center' },
                  }}
                >
                  {tDialog('syncTotalBudget')}
                </AppButton>
              </Stack>
            ) : remainingToAllocate > 0 ? (
              <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                ✓{' '}
                {tDialog('remainingUnallocated', {
                  amount: formatCurrency(remainingToAllocate, tripCurrency),
                })}
              </Typography>
            ) : (
              <Typography
                sx={{
                  fontSize: '12px',
                  color: 'success.main',
                  fontWeight: 600,
                }}
              >
                ✓ {tDialog('exactAllocated')}
              </Typography>
            )}
          </Stack>
        </Box>
      )}

      <Divider />

      <Typography
        sx={{
          fontSize: '14px',
          fontWeight: 700,
          color: 'text.primary',
        }}
      >
        {tDialog('categoryLimitsTitle')}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        {categories.map((cat) => (
          <Box
            key={cat.key}
            sx={{
              flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)' },
              minWidth: 0,
            }}
          >
            <AppNumberInput
              label={cat.label}
              size="small"
              placeholder="0"
              currencySuffix={tripCurrency}
              value={categoryLimits[cat.key] ?? ''}
              onChange={(e) => handleCategoryChange(cat.key, e.target.value)}
            />
          </Box>
        ))}
      </Box>

      <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'flex-end' }}>
        <AppButton
          intent="secondary"
          size="medium"
          onClick={onCancel}
          disabled={isLoading}
        >
          {tForm('cancel')}
        </AppButton>
        <AppButton
          type="submit"
          intent="primary"
          size="medium"
          loading={isLoading}
        >
          {tDialog('saveBudget')}
        </AppButton>
      </Stack>
    </Box>
  );
};

export default SetBudgetForm;
