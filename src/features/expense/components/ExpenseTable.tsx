'use client';

import React from 'react';
import {
  Box,
  Typography,
  Stack,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from '@mui/material';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useTranslations } from 'next-intl';
import { AppButton } from '@/base/components/ui';
import ExpenseTableRow from './ExpenseTableRow';
import type { Expense, Pagination } from '../types';

export interface ExpenseTableProps {
  expenses: Expense[];
  isLoading: boolean;
  pagination: Pagination | null;
  onPageChange: (newPage: number) => void;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
  onAddNew: () => void;
}

export default function ExpenseTable({
  expenses,
  isLoading,
  pagination,
  onPageChange,
  onEdit,
  onDelete,
  onAddNew,
}: ExpenseTableProps) {
  const t = useTranslations('expense.table');
  const page = pagination?.page ?? 0;
  const size = pagination?.size ?? 10;
  const totalElements = pagination?.totalElements ?? expenses.length;

  return (
    <Stack
      spacing={0}
      sx={{
        bgcolor: 'background.paper',
        borderRadius: '16px',
        border: 1,
        borderColor: 'divider',
        overflow: 'hidden',
      }}
    >
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
          {t('title', { count: totalElements })}
        </Typography>
        <AppButton
          intent="primary"
          size="small"
          startIcon={<AddRoundedIcon fontSize="small" />}
          onClick={onAddNew}
        >
          {t('addExpense')}
        </AppButton>
      </Stack>

      {expenses.length === 0 && !isLoading ? (
        <Stack
          spacing={2}
          sx={{
            py: 8,
            px: 2,
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              p: 2,
              borderRadius: '999px',
              bgcolor: 'action.hover',
              color: 'text.disabled',
              display: 'inline-flex',
            }}
          >
            <ReceiptLongRoundedIcon sx={{ fontSize: '48px' }} />
          </Box>
          <Stack spacing={0.5} sx={{ alignItems: 'center' }}>
            <Typography
              sx={{
                fontSize: '18px',
                fontWeight: 700,
                color: 'text.primary',
              }}
            >
              {t('emptyTitle')}
            </Typography>
            <Typography
              sx={{
                fontSize: '14px',
                color: 'text.secondary',
                maxWidth: '420px',
              }}
            >
              {t('emptyDesc')}
            </Typography>
          </Stack>
          <AppButton
            intent="primary"
            startIcon={<AddRoundedIcon fontSize="small" />}
            onClick={onAddNew}
          >
            {t('addFirst')}
          </AppButton>
        </Stack>
      ) : (
        <>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 800,
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      color: 'text.secondary',
                      py: 1.5,
                    }}
                  >
                    {t('colDate')}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 800,
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      color: 'text.secondary',
                      py: 1.5,
                    }}
                  >
                    {t('colExpense')}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 800,
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      color: 'text.secondary',
                      py: 1.5,
                    }}
                  >
                    {t('colCategory')}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 800,
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      color: 'text.secondary',
                      py: 1.5,
                    }}
                  >
                    {t('colSplit')}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: 800,
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      color: 'text.secondary',
                      py: 1.5,
                    }}
                  >
                    {t('colAmount')}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: 800,
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      color: 'text.secondary',
                      py: 1.5,
                      width: 48,
                    }}
                  >
                    {t('colActions')}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading
                  ? Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ py: 2 }}>
                          <Skeleton variant="text" width="80px" height="24px" />
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Skeleton
                            variant="text"
                            width="160px"
                            height="24px"
                          />
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Skeleton
                            variant="rounded"
                            width="110px"
                            height="24px"
                            sx={{ borderRadius: '6px' }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Skeleton variant="text" width="90px" height="24px" />
                        </TableCell>
                        <TableCell align="right" sx={{ py: 2 }}>
                          <Stack
                            direction="row"
                            sx={{ justifyContent: 'flex-end' }}
                          >
                            <Skeleton
                              variant="text"
                              width="100px"
                              height="24px"
                            />
                          </Stack>
                        </TableCell>
                        <TableCell align="center" sx={{ py: 2 }}>
                          <Stack
                            direction="row"
                            sx={{ justifyContent: 'center' }}
                          >
                            <Skeleton
                              variant="circular"
                              width="28px"
                              height="28px"
                            />
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  : expenses.map((expense) => (
                      <ExpenseTableRow
                        key={expense.id}
                        expense={expense}
                        onEdit={onEdit}
                        onDelete={onDelete}
                      />
                    ))}
              </TableBody>
            </Table>
          </TableContainer>

          {totalElements > 0 && (
            <TablePagination
              component="div"
              count={totalElements}
              page={page}
              rowsPerPage={size}
              rowsPerPageOptions={[size]}
              onPageChange={(_, newPage) => onPageChange(newPage)}
              labelDisplayedRows={({ from, to, count }) =>
                t('displayedRows', {
                  from,
                  to,
                  count: count !== -1 ? count : `>${to}`,
                })
              }
            />
          )}
        </>
      )}
    </Stack>
  );
}
