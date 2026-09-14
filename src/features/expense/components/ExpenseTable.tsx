'use client';

import React, { useMemo } from 'react';
import { Avatar, Stack, Typography } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { useTranslations } from 'next-intl';

import {
  AppActionMenu,
  AppButton,
  AppCategoryChip,
  AppTable,
  type AppTableColumn,
  type ColumnFilterValue,
  type TableSortState,
} from '@/base/components/ui';
import { formatCurrency, formatDate } from '@/base/utils';
import type { Expense, Pagination } from '../types';

export interface ExpenseTableProps {
  expenses: Expense[];
  isLoading: boolean;
  pagination: Pagination | null;
  onPageChange: (newPage: number) => void;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
  onAddNew: () => void;
  onViewDetail?: (expense: Expense) => void;
  sort?: TableSortState | null;
  onSortChange?: (sort: TableSortState | null) => void;
  filters?: Record<string, ColumnFilterValue>;
  onFilterChange?: (filters: Record<string, ColumnFilterValue>) => void;
}

export default function ExpenseTable({
  expenses,
  isLoading,
  pagination,
  onPageChange,
  onEdit,
  onDelete,
  onAddNew,
  onViewDetail,
  sort,
  onSortChange,
  filters,
  onFilterChange,
}: ExpenseTableProps) {
  const t = useTranslations('expense');
  const tTable = useTranslations('expense.table');

  const page = pagination?.page ?? 0;
  const size = pagination?.size ?? 10;
  const totalElements = pagination?.totalElements ?? expenses.length;

  const columns: AppTableColumn<Expense>[] = useMemo(
    () => [
      {
        id: 'expenseDate',
        label: tTable('colDate'),
        sortable: true,
        getValue: (e) => e.expenseDate,
        renderCell: (expense) => (
          <Typography
            sx={{
              fontSize: '13px',
              color: 'text.secondary',
              fontFamily: 'var(--font-mono)',
              whiteSpace: 'nowrap',
            }}
          >
            {formatDate(expense.expenseDate, 'DD/MM/YYYY')}
          </Typography>
        ),
      },
      {
        id: 'title',
        label: tTable('colExpense'),
        // sortable: true,
        filterable: true,
        filterType: 'text',
        filterPlaceholder: tTable('filterExpensePlaceholder'),
        getValue: (e) => e.title,
        renderCell: (expense) => (
          <Stack spacing={0.25}>
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'text.primary',
                '&:hover': onViewDetail
                  ? { color: 'primary.main', textDecoration: 'underline' }
                  : undefined,
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
        ),
      },
      {
        id: 'category',
        label: tTable('colCategory'),
        // sortable: true,
        filterable: true,
        filterType: 'select',
        filterOptions: [
          { label: t('categories.FOOD_BEVERAGE'), value: 'FOOD_BEVERAGE' },
          { label: t('categories.TRANSPORTATION'), value: 'TRANSPORTATION' },
          { label: t('categories.ACCOMMODATION'), value: 'ACCOMMODATION' },
          { label: t('categories.SIGHTSEEING'), value: 'SIGHTSEEING' },
          { label: t('categories.ENTERTAINMENT'), value: 'ENTERTAINMENT' },
          { label: t('categories.SHOPPING'), value: 'SHOPPING' },
          { label: t('categories.OTHER'), value: 'OTHER' },
        ],
        getValue: (e) => e.category,
        renderCell: (expense) => (
          <AppCategoryChip category={expense.category} />
        ),
      },
      {
        id: 'payer',
        label: tTable('colPayer'),
        // sortable: true,
        filterable: true,
        filterType: 'text',
        filterPlaceholder: tTable('filterPayerPlaceholder'),
        getValue: (e) => e.payerName || '',
        renderCell: (expense) => (
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Avatar
              src={expense.payerAvatarUrl || undefined}
              alt={expense.payerName || 'Payer'}
              sx={{
                width: 28,
                height: 28,
                fontSize: '12px',
                fontWeight: 700,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
              }}
            >
              {expense.payerName
                ? expense.payerName.charAt(0).toUpperCase()
                : 'U'}
            </Avatar>
            <Stack spacing={0}>
              <Typography
                sx={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'text.primary',
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                }}
              >
                {expense.payerName || '—'}
              </Typography>
              {expense.payerEmail && (
                <Typography
                  sx={{
                    fontSize: '11px',
                    color: 'text.secondary',
                    lineHeight: 1.2,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {expense.payerEmail}
                </Typography>
              )}
            </Stack>
          </Stack>
        ),
      },
      {
        id: 'splitType',
        label: tTable('colSplit'),
        filterable: true,
        filterType: 'select',
        filterOptions: [
          { label: t('splits.EQUAL'), value: 'EQUAL' },
          { label: t('splits.EXACT_AMOUNT'), value: 'EXACT_AMOUNT' },
          { label: t('splits.PERCENTAGE'), value: 'PERCENTAGE' },
          { label: t('splits.SHARE'), value: 'SHARE' },
        ],
        getValue: (e) => e.splitType,
        renderCell: (expense) => {
          const splitSummary =
            expense.splitType in
            { EQUAL: 1, EXACT_AMOUNT: 1, PERCENTAGE: 1, SHARE: 1 }
              ? t(
                  `splits.${expense.splitType as 'EQUAL' | 'EXACT_AMOUNT' | 'PERCENTAGE' | 'SHARE'}`,
                )
              : t('splits.EQUAL');
          const participantCount = expense.splits?.length || 1;

          return (
            <Stack spacing={0.25}>
              <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
                {splitSummary}
              </Typography>
              <Typography sx={{ fontSize: '12px', color: 'text.disabled' }}>
                {t('row.membersCount', { count: participantCount })}
              </Typography>
            </Stack>
          );
        },
      },
      {
        id: 'amount',
        label: tTable('colAmount'),
        align: 'right',
        sortable: true,
        getValue: (e) => e.amount,
        renderCell: (expense) => (
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
        ),
      },
      {
        id: 'actions',
        label: tTable('colActions'),
        align: 'center',
        width: 48,
        renderCell: (expense) => {
          const menuItems = [
            ...(onViewDetail
              ? [
                  {
                    id: 'view',
                    label: t('dialog.detailTitle'),
                    icon: <VisibilityRoundedIcon fontSize="small" />,
                    onClick: () => onViewDetail(expense),
                  },
                ]
              : []),
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

          return <AppActionMenu items={menuItems} />;
        },
      },
    ],
    [t, tTable, onViewDetail, onEdit, onDelete],
  );

  return (
    <AppTable<Expense>
      columns={columns}
      data={expenses}
      isLoading={isLoading}
      onRowClick={onViewDetail}
      sort={sort}
      onSortChange={onSortChange}
      filters={filters}
      onFilterChange={onFilterChange}
      header={
        <Stack
          direction="row"
          sx={{
            p: { xs: 2, sm: 2.5 },
            borderBottom: 1,
            borderColor: 'divider',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            sx={{
              fontFamily: 'var(--font-display)',
              fontSize: { xs: '16px', sm: '18px' },
              fontWeight: 700,
              color: 'text.primary',
            }}
          >
            {tTable('title', { count: totalElements })}
          </Typography>
          <AppButton
            intent="primary"
            size="small"
            startIcon={<AddRoundedIcon fontSize="small" />}
            onClick={onAddNew}
          >
            {tTable('addExpense')}
          </AppButton>
        </Stack>
      }
      pagination={
        totalElements > 0
          ? {
              page,
              pageSize: size,
              totalCount: totalElements,
              onPageChange,
              pageSizeOptions: [size],
            }
          : null
      }
      emptyState={{
        icon: <ReceiptLongRoundedIcon sx={{ fontSize: 44 }} />,
        title: tTable('emptyTitle'),
        description: tTable('emptyDesc'),
        actionLabel: tTable('addFirst'),
        onAction: onAddNew,
      }}
    />
  );
}
