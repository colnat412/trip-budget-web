'use client';

import React, { useMemo, useState } from 'react';
import { Box, Stack } from '@mui/material';
import HotelRoundedIcon from '@mui/icons-material/HotelRounded';
import DirectionsSubwayRoundedIcon from '@mui/icons-material/DirectionsSubwayRounded';
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded';
import ConfirmationNumberRoundedIcon from '@mui/icons-material/ConfirmationNumberRounded';
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded';
import SportsEsportsRoundedIcon from '@mui/icons-material/SportsEsportsRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import { useTranslations } from 'next-intl';
import {
  AppButton,
  AppNumberInput,
  AppTextField,
  AppSelect,
  type AppSelectOption,
} from '@/base/components/ui';
import type { TripMember } from '@/features/trip/types/member.types';
import type {
  CreateExpensePayload,
  ExpenseCategory,
  SplitType,
} from '../types';

export interface AddExpenseFormProps {
  tripCurrency?: string;
  isLoading?: boolean;
  members?: TripMember[];
  onSubmit: (payload: CreateExpensePayload) => void;
  onCancel: () => void;
}

export default function AddExpenseForm({
  tripCurrency = 'VND',
  isLoading = false,
  members = [],
  onSubmit,
  onCancel,
}: AddExpenseFormProps) {
  const tForm = useTranslations('expense.form');
  const tCat = useTranslations('expense.categories');
  const tSplits = useTranslations('expense.splits.options');

  const categoryOptions: AppSelectOption[] = useMemo(
    () => [
      {
        value: 'FOOD_BEVERAGE',
        label: tCat('FOOD_BEVERAGE'),
        icon: (
          <RestaurantRoundedIcon fontSize="small" sx={{ color: '#e65100' }} />
        ),
      },
      {
        value: 'ACCOMMODATION',
        label: tCat('ACCOMMODATION'),
        icon: <HotelRoundedIcon fontSize="small" sx={{ color: '#512da8' }} />,
      },
      {
        value: 'TRANSPORTATION',
        label: tCat('TRANSPORTATION'),
        icon: (
          <DirectionsSubwayRoundedIcon
            fontSize="small"
            sx={{ color: '#1565c0' }}
          />
        ),
      },
      {
        value: 'SIGHTSEEING',
        label: tCat('SIGHTSEEING'),
        icon: (
          <ConfirmationNumberRoundedIcon
            fontSize="small"
            sx={{ color: '#00695c' }}
          />
        ),
      },
      {
        value: 'SHOPPING',
        label: tCat('SHOPPING'),
        icon: (
          <ShoppingBagRoundedIcon fontSize="small" sx={{ color: '#c2185b' }} />
        ),
      },
      {
        value: 'ENTERTAINMENT',
        label: tCat('ENTERTAINMENT'),
        icon: (
          <SportsEsportsRoundedIcon
            fontSize="small"
            sx={{ color: '#7b1fa2' }}
          />
        ),
      },
      {
        value: 'OTHER',
        label: tCat('OTHER'),
        icon: (
          <MoreHorizRoundedIcon fontSize="small" sx={{ color: '#546e7a' }} />
        ),
      },
    ],
    [tCat],
  );

  const splitOptions: AppSelectOption[] = useMemo(
    () => [
      { value: 'EQUAL', label: tSplits('EQUAL') },
      { value: 'EXACT_AMOUNT', label: tSplits('EXACT_AMOUNT') },
    ],
    [tSplits],
  );

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('FOOD_BEVERAGE');
  const [expenseDate, setExpenseDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [splitType, setSplitType] = useState<SplitType>('EQUAL');
  const [payerId, setPayerId] = useState<string | number | ''>(() => {
    return members.length > 0 ? members[0].userId : '';
  });
  const [note, setNote] = useState('');

  const [errors, setErrors] = useState<{ title?: string; amount?: string }>({});

  const validate = () => {
    const newErrors: { title?: string; amount?: string } = {};
    if (!title.trim()) {
      newErrors.title = tForm('errors.titleRequired');
    }
    if (!amount.trim() || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = tForm('errors.amountPositive');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      title: title.trim(),
      amount: Number(amount),
      category,
      currency: tripCurrency,
      expenseDate,
      splitType,
      payerId: payerId ? payerId : undefined,
      note: note.trim() || undefined,
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <AppTextField
        label={tForm('titleLabel')}
        placeholder={tForm('titlePlaceholder')}
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          if (errors.title)
            setErrors((prev) => ({ ...prev, title: undefined }));
        }}
        error={Boolean(errors.title)}
        helperText={errors.title}
        autoFocus
      />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <AppNumberInput
            label={tForm('amountLabel')}
            placeholder="0"
            currencySuffix={tripCurrency}
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              if (errors.amount)
                setErrors((prev) => ({ ...prev, amount: undefined }));
            }}
            error={Boolean(errors.amount)}
            helperText={errors.amount}
          />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <AppSelect
            label={tForm('categoryLabel')}
            value={category}
            options={categoryOptions}
            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
          />
        </Box>
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <AppTextField
            label={tForm('dateLabel')}
            type="date"
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <AppSelect
            label={tForm('splitTypeLabel')}
            value={splitType}
            options={splitOptions}
            onChange={(e) => setSplitType(e.target.value as SplitType)}
          />
        </Box>
      </Stack>

      {members && members.length > 1 && (
        <AppSelect
          label="Người thanh toán (Payer)"
          value={payerId}
          options={members.map((m) => ({
            value: m.userId,
            label: `${m.name} (${m.email})`,
          }))}
          onChange={(e) => setPayerId(e.target.value as string | number)}
        />
      )}

      <AppTextField
        label={tForm('noteLabel')}
        placeholder={tForm('notePlaceholder')}
        multiline
        rows={2}
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

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
          {tForm('submitAdd')}
        </AppButton>
      </Stack>
    </Box>
  );
}
