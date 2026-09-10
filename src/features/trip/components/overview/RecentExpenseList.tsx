'use client';

import React, { useState } from 'react';
import { Box, Stack, Typography, Skeleton, ButtonBase } from '@mui/material';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import { useTranslations } from 'next-intl';
import { formatCurrency, formatDate } from '@/base/utils';
import { CATEGORY_CONFIG } from '@/base/components/ui/AppCategoryChip';
import useTripExpenses from '@/features/expense/hooks/useTripExpenses';
import ExpenseDetailDialog from '@/features/expense/components/ExpenseDetailDialog';
import type { Expense } from '@/features/expense/types';

export interface RecentExpenseListProps {
  tripId?: number;
  currency?: string;
}

export default function RecentExpenseList({
  tripId,
  currency = 'VND',
}: RecentExpenseListProps) {
  const tExpense = useTranslations('expense');
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  const { expenses, isLoading } = useTripExpenses({
    tripId,
    page: 0,
    size: 5,
  });

  if (isLoading) {
    return (
      <Stack spacing={1.5}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Stack
            key={i}
            direction="row"
            spacing={1.5}
            sx={{ alignItems: 'center', py: 1.5 }}
          >
            <Skeleton
              variant="rounded"
              width={40}
              height={40}
              sx={{ borderRadius: '10px' }}
            />
            <Stack spacing={0.5} sx={{ flexGrow: 1 }}>
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="text" width="40%" height={16} />
            </Stack>
            <Skeleton variant="text" width={70} height={22} />
          </Stack>
        ))}
      </Stack>
    );
  }

  if (!expenses || expenses.length === 0) {
    return (
      <Stack
        spacing={1}
        sx={{
          py: 4,
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: 'text.secondary',
        }}
      >
        <Box
          sx={{
            p: 1.5,
            borderRadius: '50%',
            bgcolor: 'action.hover',
            color: 'text.disabled',
            display: 'inline-flex',
          }}
        >
          <ReceiptLongRoundedIcon sx={{ fontSize: 32 }} />
        </Box>
        <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>
          {tExpense('table.emptyTitle')}
        </Typography>
        <Typography
          sx={{ fontSize: '12px', color: 'text.disabled', maxWidth: 280 }}
        >
          {tExpense('table.emptyDesc')}
        </Typography>
      </Stack>
    );
  }

  return (
    <>
      <Stack>
        {expenses.map((expense, index) => {
          const config =
            CATEGORY_CONFIG[expense.category] || CATEGORY_CONFIG.OTHER;
          const payerText = expense.payerName || 'Member';
          const dateText = formatDate(expense.expenseDate, 'DD/MM');

          return (
            <ButtonBase
              key={expense.id}
              onClick={() => setSelectedExpense(expense)}
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-start',
                textAlign: 'left',
                borderRadius: '12px',
                p: 1,
                mx: -1,
                borderBottom: index < expenses.length - 1 ? 1 : 0,
                borderColor: 'divider',
                transition: 'background-color 0.15s',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <Stack
                direction="row"
                spacing={1.5}
                sx={{
                  alignItems: 'center',
                  width: '100%',
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
                    color: config.color,
                    bgcolor: config.bg,
                    '& svg': { fontSize: '20px' },
                  }}
                >
                  {config.icon}
                </Box>
                <Stack spacing={0.25} sx={{ minWidth: 0, flexGrow: 1 }}>
                  <Typography
                    noWrap
                    sx={{
                      color: 'text.primary',
                      fontSize: '14px',
                      fontWeight: 700,
                    }}
                  >
                    {expense.title}
                  </Typography>
                  <Typography
                    noWrap
                    sx={{ color: 'text.secondary', fontSize: '11px' }}
                  >
                    {payerText} · {dateText}
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
                  {formatCurrency(expense.amount, expense.currency || currency)}
                </Typography>
              </Stack>
            </ButtonBase>
          );
        })}
      </Stack>

      <ExpenseDetailDialog
        open={Boolean(selectedExpense)}
        expense={selectedExpense}
        onClose={() => setSelectedExpense(null)}
      />
    </>
  );
}
