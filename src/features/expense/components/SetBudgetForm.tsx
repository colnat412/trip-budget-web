'use client';

import React, { useMemo, useState } from 'react';
import { Box, Stack, Typography, Divider } from '@mui/material';
import { useTranslations } from 'next-intl';
import { AppButton, AppNumberInput } from '@/base/components/ui';
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

const CATEGORY_KEYS: ExpenseCategory[] = [
  'FOOD_BEVERAGE',
  'ACCOMMODATION',
  'TRANSPORTATION',
  'SIGHTSEEING',
  'SHOPPING',
  'ENTERTAINMENT',
  'OTHER',
];

export default function SetBudgetForm({
  summary,
  tripCurrency = 'VND',
  isLoading = false,
  onSubmit,
  onCancel,
}: SetBudgetFormProps) {
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
    summary?.totalBudget ? String(summary.totalBudget) : '',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!totalBudget || isNaN(Number(totalBudget)) || Number(totalBudget) < 0) {
      setError(tForm('errors.totalBudgetRequired'));
      return;
    }

    const parsedLimits: Partial<Record<ExpenseCategory, number>> = {};
    Object.entries(categoryLimits).forEach(([key, val]) => {
      if (val && !isNaN(Number(val)) && Number(val) > 0) {
        parsedLimits[key as ExpenseCategory] = Number(val);
      }
    });

    onSubmit({
      totalBudget: Number(totalBudget),
      currency: tripCurrency,
      categoryLimits:
        Object.keys(parsedLimits).length > 0 ? parsedLimits : undefined,
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
              value={categoryLimits[cat.key] || ''}
              onChange={(e) =>
                setCategoryLimits((prev) => ({
                  ...prev,
                  [cat.key]: e.target.value,
                }))
              }
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
}
