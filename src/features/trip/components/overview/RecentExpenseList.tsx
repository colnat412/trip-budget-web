'use client';

import { Box, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';

interface RecentExpense {
  messageKey: 'returnFlight' | 'hotel' | 'baNaHills' | 'dinner' | 'motorbike';
  meta: string;
  amount: string;
  color: string;
  background: string;
  icon: ReactNode;
}

const DEFAULT_RECENT_EXPENSES: RecentExpense[] = [
  {
    messageKey: 'returnFlight',
    meta: 'Anh · 04 Aug',
    amount: '4.20tr',
    color: '#6366F1',
    background: '#EEF2FF',
    icon: '✈️',
  },
  {
    messageKey: 'hotel',
    meta: 'Nguyên · 05 Aug',
    amount: '2.85tr',
    color: '#0EA5E9',
    background: '#E0F2FE',
    icon: '🏨',
  },
  {
    messageKey: 'baNaHills',
    meta: 'Anh · 05 Aug',
    amount: '0.78tr',
    color: '#10B981',
    background: '#ECFDF5',
    icon: '🎡',
  },
  {
    messageKey: 'dinner',
    meta: 'Phạm · 05 Aug',
    amount: '1.56tr',
    color: '#F97316',
    background: '#FFF7ED',
    icon: '🍜',
  },
  {
    messageKey: 'motorbike',
    meta: 'Hào · 06 Aug',
    amount: '0.48tr',
    color: '#F59E0B',
    background: '#FFFBEB',
    icon: '🛵',
  },
];

export default function RecentExpenseList() {
  const t = useTranslations('overview');

  return (
    <Stack>
      {DEFAULT_RECENT_EXPENSES.map((expense, index) => (
        <Stack
          key={expense.messageKey}
          direction="row"
          spacing={1.5}
          sx={{
            alignItems: 'center',
            py: 1.5,
            borderBottom: index < DEFAULT_RECENT_EXPENSES.length - 1 ? 1 : 0,
            borderColor: 'divider',
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              borderRadius: '10px',
              color: expense.color,
              bgcolor: expense.background,
              '& svg': { fontSize: '20px' },
            }}
          >
            {expense.icon}
          </Box>
          <Stack spacing={0.25} sx={{ minWidth: 0, flexGrow: 1 }}>
            <Typography
              noWrap
              sx={{ color: 'text.primary', fontSize: '14px', fontWeight: 700 }}
            >
              {t(`recent.${expense.messageKey}`)}
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: '11px' }}>
              {expense.meta}
            </Typography>
          </Stack>
          <Typography
            sx={{
              flexShrink: 0,
              color: 'text.primary',
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
              fontWeight: 700,
            }}
          >
            {expense.amount}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}
