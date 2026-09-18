'use client';

import React, { useCallback, useMemo, useRef, useState } from 'react';
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
import type {
  Expense,
  ExpenseCategory,
  SplitItemPayload,
  SplitType,
  UpdateExpensePayload,
} from '../types';
import SplitAllocationSection, {
  type SplitMember,
} from './SplitAllocationSection';

export interface EditExpenseFormProps {
  expense: Expense;
  members?: SplitMember[];
  isLoading?: boolean;
  onSubmit: (payload: UpdateExpensePayload) => void;
  onCancel: () => void;
}

const EditExpenseForm = ({
  expense,
  members = [],
  isLoading = false,
  onSubmit,
  onCancel,
}: EditExpenseFormProps) => {
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
          <MoreHorizRoundedIcon fontSize="small" sx={{ color: '#616161' }} />
        ),
      },
    ],
    [tCat],
  );

  const splitOptions: AppSelectOption[] = useMemo(
    () => [
      { value: 'EQUAL', label: tSplits('EQUAL') },
      { value: 'PERCENTAGE', label: tSplits('PERCENTAGE') },
      { value: 'SHARE', label: tSplits('SHARE') },
      { value: 'EXACT_AMOUNT', label: tSplits('EXACT_AMOUNT') },
    ],
    [tSplits],
  );

  const allMembers: SplitMember[] = useMemo(() => {
    if (members && members.length > 0) return members;
    return (expense.splits || []).map((s) => ({
      userId: s.userId,
      name: s.userName,
      email: s.userEmail,
      avatarUrl: s.userAvatarUrl,
    }));
  }, [members, expense.splits]);

  const initialSplits: SplitItemPayload[] = useMemo(() => {
    return (expense.splits || []).map((s) => ({
      userId: s.userId,
      allocatedAmount: s.allocatedAmount,
      splitValue: s.splitValue,
    }));
  }, [expense.splits]);

  const [title, setTitle] = useState(expense.title);
  const [amount, setAmount] = useState(String(expense.amount));
  const [category, setCategory] = useState<ExpenseCategory>(expense.category);
  const [expenseDate, setExpenseDate] = useState(expense.expenseDate);
  const [splitType, setSplitType] = useState<SplitType>(expense.splitType);
  const [payerId, setPayerId] = useState<string | number | ''>(
    expense.payerId || '',
  );
  const [receiptUrl, setReceiptUrl] = useState(expense.receiptUrl || '');
  const [note, setNote] = useState(expense.note || '');

  const splitsRef = useRef<SplitItemPayload[]>(initialSplits);
  const isSplitValidRef = useRef<boolean>(true);

  const handleSplitChange = useCallback(
    (newSplits: SplitItemPayload[], valid: boolean) => {
      splitsRef.current = newSplits;
      isSplitValidRef.current = valid;
    },
    [],
  );

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
    return Object.keys(newErrors).length === 0 && isSplitValidRef.current;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      title: title.trim(),
      amount: Number(amount),
      category,
      currency: expense.currency,
      expenseDate,
      splitType,
      payerId: payerId ? payerId : undefined,
      receiptUrl: receiptUrl.trim() || undefined,
      note: note.trim() || undefined,
      splits: splitsRef.current.length > 0 ? splitsRef.current : undefined,
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
            currencySuffix={expense.currency}
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

      {allMembers && allMembers.length > 1 && (
        <AppSelect
          label={tForm('payerLabel')}
          value={payerId}
          options={allMembers.map((m) => ({
            value: m.userId,
            label: `${m.name || m.email || m.userId} (${m.email || ''})`,
          }))}
          onChange={(e) => setPayerId(e.target.value as string | number)}
        />
      )}

      {allMembers && allMembers.length > 0 && (
        <SplitAllocationSection
          splitType={splitType}
          totalAmount={Number(amount) || 0}
          currency={expense.currency}
          members={allMembers}
          initialSplits={initialSplits}
          onChange={handleSplitChange}
        />
      )}

      <AppTextField
        label={tForm('receiptUrlLabel')}
        placeholder={tForm('receiptUrlPlaceholder')}
        value={receiptUrl}
        onChange={(e) => setReceiptUrl(e.target.value)}
      />

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
          {tForm('submitEdit')}
        </AppButton>
      </Stack>
    </Box>
  );
};

export default EditExpenseForm;
