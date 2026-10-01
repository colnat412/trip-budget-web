'use client';

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Box, Stack } from '@mui/material';
import { useTranslations } from 'next-intl';
import {
  AppButton,
  AppNumberInput,
  AppTextField,
  AppSelect,
  type AppSelectOption,
} from '@/base/components/ui';
import { getCategorySelectOptions } from '@/base/constants';
import type { TripMember } from '@/features/trip/types/member.types';
import ReceiptScanBanner from './ReceiptScanBanner';
import type {
  AddExpenseInitialData,
  CreateExpensePayload,
  ExpenseCategory,
  ReceiptItem,
  ScannedReceipt,
  SplitItemPayload,
  SplitType,
} from '../types';
import SplitAllocationSection from './SplitAllocationSection';

export interface AddExpenseFormProps {
  tripCurrency?: string;
  isLoading?: boolean;
  members?: TripMember[];
  onSubmit: (payload: CreateExpensePayload) => void;
  onCancel: () => void;
  initialData?: AddExpenseInitialData;
}

const AddExpenseForm = ({
  tripCurrency = 'VND',
  isLoading = false,
  members = [],
  onSubmit,
  onCancel,
  initialData,
}: AddExpenseFormProps) => {
  const tForm = useTranslations('expense.form');
  const tCat = useTranslations('expense.categories');
  const tSplits = useTranslations('expense.splits.options');

  const categoryOptions: AppSelectOption[] = useMemo(
    () => getCategorySelectOptions(tCat),
    [tCat],
  );

  const splitOptions: AppSelectOption[] = useMemo(
    () => [
      { value: 'EQUAL', label: tSplits('EQUAL') },
      { value: 'EXACT_AMOUNT', label: tSplits('EXACT_AMOUNT') },
      { value: 'PERCENTAGE', label: tSplits('PERCENTAGE') },
      { value: 'SHARE', label: tSplits('SHARE') },
    ],
    [tSplits],
  );

  const [title, setTitle] = useState(initialData?.title || '');
  const [amount, setAmount] = useState(
    initialData?.amount != null && initialData.amount > 0
      ? String(initialData.amount)
      : '',
  );
  const [category, setCategory] = useState<ExpenseCategory>(
    initialData?.category || 'FOOD_BEVERAGE',
  );
  const [expenseDate, setExpenseDate] = useState(
    initialData?.expenseDate || new Date().toISOString().split('T')[0],
  );

  const [splitType, setSplitType] = useState<SplitType>('EQUAL');
  const [payerId, setPayerId] = useState<string | number | ''>(() => {
    return members.length > 0 ? members[0].userId : '';
  });
  const [receiptUrl, setReceiptUrl] = useState('');
  const [note, setNote] = useState('');

  const splitsRef = useRef<SplitItemPayload[]>([]);
  const isSplitValidRef = useRef<boolean>(true);

  const handleSplitChange = useCallback(
    (newSplits: SplitItemPayload[], valid: boolean) => {
      splitsRef.current = newSplits;
      isSplitValidRef.current = valid;
    },
    [],
  );

  const handleScanSuccess = (scanned: ScannedReceipt) => {
    if (scanned.merchant_name) {
      setTitle(scanned.merchant_name);
      setErrors((prev) => ({ ...prev, title: undefined }));
    }
    if (scanned.amount != null && scanned.amount > 0) {
      setAmount(String(scanned.amount));
      setErrors((prev) => ({ ...prev, amount: undefined }));
    }
    if (scanned.category) {
      setCategory(scanned.category);
    }
    if (scanned.expense_date) {
      setExpenseDate(scanned.expense_date);
      setErrors((prev) => ({ ...prev, expenseDate: undefined }));
    }
    if (scanned.raw_text) {
      setNote(scanned.raw_text);
    } else if (scanned.items && scanned.items.length > 0) {
      setNote(
        scanned.items
          .map((i: ReceiptItem) => `${i.name} (x${i.quantity || 1})`)
          .join(', '),
      );
    }
  };

  const [errors, setErrors] = useState<{
    title?: string;
    amount?: string;
    expenseDate?: string;
    payerId?: string;
  }>({});

  const validate = () => {
    const newErrors: {
      title?: string;
      amount?: string;
      expenseDate?: string;
      payerId?: string;
    } = {};
    if (!title.trim()) {
      newErrors.title = tForm('errors.titleRequired');
    }
    if (!amount.trim() || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = tForm('errors.amountPositive');
    }
    if (!expenseDate || !expenseDate.trim()) {
      newErrors.expenseDate = tForm('errors.dateRequired');
    }
    if (members && members.length > 1 && !payerId) {
      newErrors.payerId = tForm('errors.payerRequired');
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
      currency: tripCurrency,
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
      <ReceiptScanBanner
        onScanSuccess={handleScanSuccess}
        disabled={isLoading}
      />

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
            onChange={(e) => {
              setExpenseDate(e.target.value);
              if (errors.expenseDate) {
                setErrors((prev) => ({ ...prev, expenseDate: undefined }));
              }
            }}
            error={Boolean(errors.expenseDate)}
            helperText={errors.expenseDate}
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
          label={tForm('payerLabel')}
          value={payerId}
          options={members.map((m) => ({
            value: m.userId,
            label: `${m.name} (${m.email})`,
          }))}
          onChange={(e) => {
            setPayerId(e.target.value as string | number);
            if (errors.payerId) {
              setErrors((prev) => ({ ...prev, payerId: undefined }));
            }
          }}
          error={Boolean(errors.payerId)}
          helperText={errors.payerId}
        />
      )}

      {members && members.length > 0 && (
        <SplitAllocationSection
          splitType={splitType}
          totalAmount={Number(amount) || 0}
          currency={tripCurrency}
          members={members}
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
          {tForm('submitAdd')}
        </AppButton>
      </Stack>
    </Box>
  );
};

export default AddExpenseForm;
