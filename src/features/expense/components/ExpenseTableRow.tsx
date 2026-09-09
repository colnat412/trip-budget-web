'use client';

import React from 'react';
import { TableRow, TableCell, Typography, Stack } from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { useTranslations } from 'next-intl';
import { AppActionMenu, AppCategoryChip } from '@/base/components/ui';
import { formatCurrency, formatDate } from '@/base/utils';
import type { Expense } from '../types';

export interface ExpenseTableRowProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

export default function ExpenseTableRow({
  expense,
  onEdit,
  onDelete,
}: ExpenseTableRowProps) {
  const t = useTranslations('expense');

  const menuItems = [
    {
      id: 'edit',
      label: t('row.edit'),
      icon: <EditRoundedIcon fontSize="small" />,
      onClick: () => onEdit(expense),
    },
    {
      id: 'delete',
      label: t('row.delete'),
      icon: <DeleteOutlineRoundedIcon fontSize="small" />,
      danger: true,
      onClick: () => onDelete(expense),
    },
  ];

  const splitSummary =
    expense.splitType in { EQUAL: 1, EXACT_AMOUNT: 1, PERCENTAGE: 1, SHARE: 1 }
      ? t(
          `splits.${expense.splitType as 'EQUAL' | 'EXACT_AMOUNT' | 'PERCENTAGE' | 'SHARE'}`,
        )
      : t('splits.EQUAL');
  const participantCount = expense.splits?.length || 1;

  return (
    <TableRow hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell sx={{ whiteSpace: 'nowrap', py: 2 }}>
        <Typography
          sx={{
            fontSize: '13px',
            color: 'text.secondary',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {formatDate(expense.expenseDate, 'DD/MM/YYYY')}
        </Typography>
      </TableCell>

      <TableCell sx={{ py: 2 }}>
        <Stack spacing={0.25}>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            {expense.title}
          </Typography>
          {expense.note && (
            <Typography
              sx={{
                fontSize: '12px',
                color: 'text.secondary',
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {expense.note}
            </Typography>
          )}
        </Stack>
      </TableCell>

      <TableCell sx={{ py: 2 }}>
        <AppCategoryChip category={expense.category} />
      </TableCell>

      <TableCell sx={{ py: 2 }}>
        <Stack spacing={0.25}>
          <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
            {splitSummary}
          </Typography>
          <Typography sx={{ fontSize: '12px', color: 'text.disabled' }}>
            {t('row.membersCount', { count: participantCount })}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell align="right" sx={{ py: 2 }}>
        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: 700,
            color: 'text.primary',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {formatCurrency(expense.amount, expense.currency)}
        </Typography>
      </TableCell>

      <TableCell align="center" sx={{ width: '48px', py: 2 }}>
        <AppActionMenu items={menuItems} />
      </TableCell>
    </TableRow>
  );
}
