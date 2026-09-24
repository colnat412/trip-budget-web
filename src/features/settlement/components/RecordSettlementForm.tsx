'use client';

import React, { useState } from 'react';
import { Box, Stack } from '@mui/material';
import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import { useTranslations } from 'next-intl';

import {
  AppButton,
  AppNumberInput,
  AppSelect,
  AppTextField,
} from '@/base/components/ui';
import type { CreateSettlementRequest, PaymentMethod } from '../types';

export interface RecordSettlementFormProps {
  members: { userId: string; name: string }[];
  initialData?: Partial<CreateSettlementRequest>;
  currency: string;
  isLoading: boolean;
  onSubmit: (data: CreateSettlementRequest) => void;
  onCancel: () => void;
}

const RecordSettlementForm = ({
  members,
  initialData,
  currency,
  isLoading,
  onSubmit,
  onCancel,
}: RecordSettlementFormProps) => {
  const t = useTranslations('settlement');
  const tDialog = useTranslations('settlement.dialog');

  const [payerId, setPayerId] = useState(
    initialData?.payerId || (members[0]?.userId ?? ''),
  );
  const [payeeId, setPayeeId] = useState(
    initialData?.payeeId || (members.length > 1 ? members[1]?.userId : ''),
  );
  const [amount, setAmount] = useState<number | undefined>(initialData?.amount);
  const [settledAt, setSettledAt] = useState(
    initialData?.settledAt || new Date().toISOString().split('T')[0],
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    initialData?.paymentMethod || 'BANK_TRANSFER',
  );
  const [note, setNote] = useState(initialData?.note || '');
  const [error, setError] = useState<string | null>(null);

  const memberOptions = members.map((m) => ({
    value: m.userId,
    label: m.name,
  }));

  const methodOptions = [
    {
      value: 'BANK_TRANSFER',
      label: t('methodBank'),
      icon: <AccountBalanceRoundedIcon sx={{ fontSize: '18px' }} />,
    },
    {
      value: 'CASH',
      label: t('methodCash'),
      icon: <AttachMoneyRoundedIcon sx={{ fontSize: '18px' }} />,
    },
    {
      value: 'OTHER',
      label: t('methodOther'),
      icon: <MoreHorizRoundedIcon sx={{ fontSize: '18px' }} />,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!payerId) {
      setError(tDialog('errors.payerRequired'));
      return;
    }

    if (!payeeId) {
      setError(tDialog('errors.payeeRequired'));
      return;
    }

    if (payerId === payeeId) {
      setError(tDialog('errors.samePerson'));
      return;
    }

    if (!amount || amount <= 0) {
      setError(tDialog('errors.invalidAmount'));
      return;
    }

    if (!settledAt || !settledAt.trim()) {
      setError(tDialog('errors.dateRequired'));
      return;
    }

    onSubmit({
      payerId,
      payeeId,
      amount,
      currency,
      settledAt,
      paymentMethod,
      note: note.trim() || undefined,
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={2.5}>
        {error && (
          <Box
            sx={{
              p: 1.5,
              borderRadius: '12px',
              bgcolor: 'error.light',
              color: 'error.dark',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            {error}
          </Box>
        )}

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <AppSelect
              label={tDialog('payerLabel')}
              value={payerId}
              onChange={(e) => setPayerId(String(e.target.value))}
              options={memberOptions}
              fullWidth
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <AppSelect
              label={tDialog('payeeLabel')}
              value={payeeId}
              onChange={(e) => setPayeeId(String(e.target.value))}
              options={memberOptions}
              fullWidth
            />
          </Box>
        </Box>

        <AppNumberInput
          label={tDialog('amountLabel')}
          value={amount}
          onValueChange={(num) => setAmount(num)}
          currencySuffix={currency}
          placeholder="0"
          fullWidth
          required
        />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <AppTextField
              type="date"
              label={tDialog('dateLabel')}
              value={settledAt}
              onChange={(e) => setSettledAt(e.target.value)}
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <AppSelect
              label={tDialog('methodLabel')}
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(e.target.value as PaymentMethod)
              }
              options={methodOptions}
              fullWidth
            />
          </Box>
        </Box>

        <AppTextField
          label={tDialog('noteLabel')}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          multiline
          rows={2}
          placeholder={tDialog('notePlaceholder')}
          fullWidth
        />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1.5,
            pt: 1,
          }}
        >
          <AppButton intent="secondary" onClick={onCancel} disabled={isLoading}>
            {tDialog('cancelBtn')}
          </AppButton>
          <AppButton type="submit" intent="primary" loading={isLoading}>
            {tDialog('submitBtn')}
          </AppButton>
        </Box>
      </Stack>
    </Box>
  );
};

export default RecordSettlementForm;
