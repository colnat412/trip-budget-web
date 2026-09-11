'use client';

import React, { useState } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import LuggageRoundedIcon from '@mui/icons-material/LuggageRounded';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  AppButton,
  AppToast,
  type AppToastSeverity,
} from '@/base/components/ui';
import { useTripContext } from '@/features/trip/context/TripContext';
import useTripBudgetSummary from '../hooks/useTripBudgetSummary';
import useTripExpenses from '../hooks/useTripExpenses';
import {
  useCreateExpense,
  useUpdateExpense,
  useDeleteExpense,
  useSetBudget,
} from '../hooks/useExpenseMutation';
import BudgetMetricsCards from './BudgetMetricsCards';
import CategorySpendingList from './CategorySpendingList';
import ExpenseTable from './ExpenseTable';
import AddExpenseDialog from './AddExpenseDialog';
import EditExpenseDialog from './EditExpenseDialog';
import DeleteExpenseDialog from './DeleteExpenseDialog';
import SetBudgetDialog from './SetBudgetDialog';
import ExpenseDetailDialog from './ExpenseDetailDialog';
import type {
  CreateExpensePayload,
  Expense,
  SetBudgetPayload,
  UpdateExpensePayload,
} from '../types';

export default function ExpenseOverview() {
  const router = useRouter();
  const t = useTranslations('expense');
  const { activeTrip } = useTripContext();
  const tripId = activeTrip?.id;

  const [page, setPage] = useState(0);

  const [addOpen, setAddOpen] = useState(false);
  const [detailExpense, setDetailExpense] = useState<Expense | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);
  const [setBudgetOpen, setSetBudgetOpen] = useState(false);

  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: AppToastSeverity;
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showToast = (
    message: string,
    severity: AppToastSeverity = 'success',
  ) => {
    setToast({ open: true, message, severity });
  };

  const {
    summary,
    isLoading: isSummaryLoading,
    refetch: refetchSummary,
  } = useTripBudgetSummary({ tripId });

  const {
    expenses,
    pagination,
    isLoading: isExpensesLoading,
    refetch: refetchExpenses,
  } = useTripExpenses({ tripId, page, size: 10 });

  const refreshAll = () => {
    refetchSummary();
    refetchExpenses();
  };

  const { createExpenseAsync, isPending: isCreating } = useCreateExpense({
    tripId: tripId ?? '',
    options: {
      onSuccess: () => {
        showToast(t('toasts.createSuccess'));
        setAddOpen(false);
        refreshAll();
      },
      onError: () => {
        showToast(t('toasts.createError'), 'error');
      },
    },
  });

  const { updateExpenseAsync, isPending: isUpdating } = useUpdateExpense({
    tripId: tripId ?? '',
    expenseId: editingExpense?.id ?? '',
    options: {
      onSuccess: () => {
        showToast(t('toasts.updateSuccess'));
        setEditingExpense(null);
        refreshAll();
      },
      onError: () => {
        showToast(t('toasts.updateError'), 'error');
      },
    },
  });

  const { deleteExpenseAsync, isPending: isDeleting } = useDeleteExpense({
    tripId: tripId ?? '',
    expenseId: deletingExpense?.id ?? '',
    options: {
      onSuccess: () => {
        showToast(t('toasts.deleteSuccess'));
        setDeletingExpense(null);
        refreshAll();
      },
      onError: () => {
        showToast(t('toasts.deleteError'), 'error');
      },
    },
  });

  const { setBudgetAsync, isPending: isSettingBudget } = useSetBudget({
    tripId: tripId ?? '',
    options: {
      onSuccess: () => {
        showToast(t('toasts.setBudgetSuccess'));
        setSetBudgetOpen(false);
        refreshAll();
      },
      onError: () => {
        showToast(t('toasts.setBudgetError'), 'error');
      },
    },
  });

  const handleCreateSubmit = async (payload: CreateExpensePayload) => {
    if (!tripId) return;
    await createExpenseAsync(payload);
  };

  const handleUpdateSubmit = async (payload: UpdateExpensePayload) => {
    if (!tripId || !editingExpense) return;
    await updateExpenseAsync(payload);
  };

  const handleDeleteConfirm = async () => {
    if (!tripId || !deletingExpense) return;
    await deleteExpenseAsync({});
  };

  const handleSetBudgetSubmit = async (payload: SetBudgetPayload) => {
    if (!tripId) return;
    await setBudgetAsync(payload);
  };

  if (!activeTrip) {
    return (
      <Stack
        spacing={3}
        sx={{
          py: 10,
          px: 3,
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            p: 3,
            borderRadius: '50%',
            bgcolor: 'action.hover',
            color: 'primary.main',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <LuggageRoundedIcon sx={{ fontSize: '64px' }} />
        </Box>
        <Stack spacing={1} sx={{ alignItems: 'center', maxWidth: 480 }}>
          <Typography
            sx={{
              fontFamily: 'var(--font-display)',
              fontSize: '22px',
              fontWeight: 700,
              color: 'text.primary',
            }}
          >
            {t('noTripTitle')}
          </Typography>
          <Typography
            sx={{
              fontSize: '14px',
              color: 'text.secondary',
              lineHeight: 1.6,
            }}
          >
            {t('noTripDesc')}
          </Typography>
        </Stack>
        <AppButton intent="primary" onClick={() => router.push('/trips')}>
          {t('viewTrips')}
        </AppButton>
      </Stack>
    );
  }

  return (
    <Stack
      spacing={3}
      sx={{
        p: { xs: 2, md: 3 },
        bgcolor: 'action.hover',
        minHeight: '100%',
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        sx={{
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
        }}
      >
        <Stack spacing={0.5}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <AccountBalanceWalletRoundedIcon
              sx={{ color: 'primary.main', fontSize: '24px' }}
            />
            <Typography
              component="h1"
              sx={{
                fontFamily: 'var(--font-display)',
                fontSize: { xs: '24px', sm: '28px' },
                fontWeight: 800,
                color: 'text.primary',
              }}
            >
              {t('pageTitle')}
            </Typography>
            <Box
              sx={{
                px: 1,
                py: 0.25,
                borderRadius: '999px',
                bgcolor: 'background.paper',
                border: 1,
                borderColor: 'divider',
                fontSize: '12px',
                fontWeight: 700,
                color: 'primary.main',
              }}
            >
              {activeTrip.baseCurrency}
            </Box>
          </Stack>
          <Typography sx={{ color: 'text.secondary', fontSize: '14px' }}>
            {t('trip')}:{' '}
            <strong style={{ color: '#1E3A8A' }}>{activeTrip.name}</strong> •{' '}
            {t('destination')}:{' '}
            <strong>{activeTrip.destination || t('notUpdated')}</strong>
          </Typography>
        </Stack>

        <Stack
          direction="row"
          spacing={1.5}
          sx={{ alignItems: 'center', flexShrink: 0 }}
        >
          <AppButton
            intent="secondary"
            size="medium"
            startIcon={<TuneRoundedIcon fontSize="small" />}
            onClick={() => setSetBudgetOpen(true)}
          >
            {t('setBudget')}
          </AppButton>
          <AppButton
            intent="primary"
            size="medium"
            startIcon={<AddRoundedIcon fontSize="small" />}
            onClick={() => setAddOpen(true)}
          >
            {t('addExpense')}
          </AppButton>
        </Stack>
      </Stack>

      {(() => {
        const hasCategoryBreakdown = Boolean(
          summary?.categoryBreakdown &&
          summary.categoryBreakdown.some(
            (c) => c.spentAmount > 0 || (c.limitAmount && c.limitAmount > 0),
          ),
        );

        return (
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', lg: 'row' },
              gap: 2,
              alignItems: 'stretch',
            }}
          >
            <Box
              sx={{
                flex: {
                  xs: '1 1 100%',
                  lg: hasCategoryBreakdown ? '1 1 68%' : '1 1 100%',
                },
                minWidth: 0,
              }}
            >
              <BudgetMetricsCards
                summary={summary}
                currency={activeTrip.baseCurrency}
                onOpenSetBudget={() => setSetBudgetOpen(true)}
              />
            </Box>

            {hasCategoryBreakdown && summary?.categoryBreakdown && (
              <Box
                sx={{
                  flex: { xs: '1 1 100%', lg: '1 1 32%' },
                  minWidth: 0,
                }}
              >
                <CategorySpendingList
                  breakdown={summary.categoryBreakdown}
                  currency={activeTrip.baseCurrency}
                />
              </Box>
            )}
          </Box>
        );
      })()}

      <ExpenseTable
        expenses={expenses}
        isLoading={isExpensesLoading || isSummaryLoading}
        pagination={pagination}
        onPageChange={(newPage) => setPage(newPage)}
        onViewDetail={(expense) => setDetailExpense(expense)}
        onEdit={(expense) => setEditingExpense(expense)}
        onDelete={(expense) => setDeletingExpense(expense)}
        onAddNew={() => setAddOpen(true)}
      />

      <ExpenseDetailDialog
        open={Boolean(detailExpense)}
        expense={detailExpense}
        onClose={() => setDetailExpense(null)}
        onEdit={(expense) => setEditingExpense(expense)}
      />

      <AddExpenseDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleCreateSubmit}
        isLoading={isCreating}
        tripCurrency={activeTrip.baseCurrency}
        tripId={tripId}
      />

      <EditExpenseDialog
        open={Boolean(editingExpense)}
        expense={editingExpense}
        onClose={() => setEditingExpense(null)}
        onSubmit={handleUpdateSubmit}
        isLoading={isUpdating}
      />

      <DeleteExpenseDialog
        open={Boolean(deletingExpense)}
        expense={deletingExpense}
        onClose={() => setDeletingExpense(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />

      <SetBudgetDialog
        open={setBudgetOpen}
        summary={summary}
        tripCurrency={activeTrip.baseCurrency}
        onClose={() => setSetBudgetOpen(false)}
        onSubmit={handleSetBudgetSubmit}
        isLoading={isSettingBudget}
      />

      <AppToast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />
    </Stack>
  );
}
