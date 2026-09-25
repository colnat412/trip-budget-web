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
  AppPageContainer,
  AppPageHeader,
  AppToast,
  type AppToastSeverity,
  type ColumnFilterValue,
  type TableSortState,
} from '@/base/components/ui';
import { useTripContext } from '@/features/trip/context/TripContext';
import { useUserContext } from '@/features/user/context/UserContext';
import { useTripMembers } from '@/features/trip/hooks/useTripMembers';
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

const ExpenseOverview = () => {
  const router = useRouter();
  const t = useTranslations('expense');
  const { activeTrip } = useTripContext();
  const tripId = activeTrip?.id;

  const { user } = useUserContext();
  const { members } = useTripMembers({ tripId });

  const currentUserId = user?.id !== undefined ? String(user.id) : undefined;
  const currentUserEmail = user?.email?.toLowerCase().trim();

  const currentMember = members.find((m) => {
    if (currentUserId && String(m.userId) === currentUserId) return true;
    if (currentUserEmail && m.email?.toLowerCase().trim() === currentUserEmail)
      return true;
    return false;
  });

  const isOwner =
    currentMember?.role === 'OWNER' ||
    (activeTrip?.ownerId !== undefined &&
      currentUserId !== undefined &&
      String(activeTrip.ownerId) === currentUserId);

  const isViewer = !isOwner && currentMember?.role === 'VIEWER';

  const [page, setPage] = useState(0);
  const [sort, setSort] = useState<TableSortState | null>(null);
  const [filters, setFilters] = useState<Record<string, ColumnFilterValue>>({});

  const [addOpen, setAddOpen] = useState(false);
  const [detailExpense, setDetailExpense] = useState<Expense | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);
  const [setBudgetOpen, setSetBudgetOpen] = useState(false);

  const search = typeof filters.title === 'string' ? filters.title : undefined;
  const category =
    typeof filters.category === 'string'
      ? filters.category
      : Array.isArray(filters.category)
        ? filters.category.join(',')
        : undefined;
  const payer = typeof filters.payer === 'string' ? filters.payer : undefined;
  const splitType =
    typeof filters.splitType === 'string'
      ? filters.splitType
      : Array.isArray(filters.splitType)
        ? filters.splitType.join(',')
        : undefined;

  const handleSortChange = (newSort: TableSortState | null) => {
    setSort(newSort);
    setPage(0);
  };

  const handleFilterChange = (
    newFilters: Record<string, ColumnFilterValue>,
  ) => {
    setFilters(newFilters);
    setPage(0);
  };

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
    isFetching: isExpensesFetching,
    refetch: refetchExpenses,
  } = useTripExpenses({
    tripId,
    page,
    size: 10,
    search,
    title: search,
    category,
    payer,
    splitType,
    sortBy: sort?.columnId,
    sortDirection: sort?.direction,
  });

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
      <AppPageContainer
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          py: 10,
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
      </AppPageContainer>
    );
  }

  return (
    <AppPageContainer>
      <AppPageHeader
        icon={<AccountBalanceWalletRoundedIcon sx={{ fontSize: '24px' }} />}
        title={t('pageTitle')}
        badge={activeTrip.baseCurrency}
        subtitle={
          <Stack
            direction="row"
            spacing={0.75}
            sx={{
              alignItems: 'center',
              flexWrap: 'wrap',
              fontSize: '14px',
              color: 'text.secondary',
            }}
          >
            <span>{t('trip')}:</span>
            <Typography
              component="span"
              sx={{
                fontSize: '14px',
                fontWeight: 700,
                color: 'primary.main',
              }}
            >
              {activeTrip.name}
            </Typography>
            <span>·</span>
            <span>{t('destination')}:</span>
            <Typography
              component="span"
              sx={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'text.primary',
              }}
            >
              {activeTrip.destination || t('notUpdated')}
            </Typography>
          </Stack>
        }
        actions={
          !isViewer ? (
            <>
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
            </>
          ) : null
        }
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(3, 1fr)',
          },
          gap: 2,
          alignItems: 'stretch',
        }}
      >
        <BudgetMetricsCards
          summary={summary}
          currency={activeTrip.baseCurrency}
          onOpenSetBudget={!isViewer ? () => setSetBudgetOpen(true) : undefined}
        />
      </Box>

      {summary?.categoryBreakdown && (
        <CategorySpendingList
          breakdown={summary.categoryBreakdown}
          currency={activeTrip.baseCurrency}
          onOpenSetBudget={!isViewer ? () => setSetBudgetOpen(true) : undefined}
        />
      )}

      <ExpenseTable
        expenses={expenses}
        isLoading={isExpensesLoading || isSummaryLoading}
        isFetching={isExpensesFetching}
        pagination={pagination}
        tableMaxHeight={380}
        onPageChange={(newPage) => setPage(newPage)}
        onViewDetail={(expense) => setDetailExpense(expense)}
        onEdit={(expense) => setEditingExpense(expense)}
        onDelete={(expense) => setDeletingExpense(expense)}
        onAddNew={() => setAddOpen(true)}
        sort={sort}
        onSortChange={handleSortChange}
        filters={filters}
        onFilterChange={handleFilterChange}
        readOnly={isViewer}
      />

      <ExpenseDetailDialog
        open={Boolean(detailExpense)}
        expense={detailExpense}
        onClose={() => setDetailExpense(null)}
        onEdit={(expense) => setEditingExpense(expense)}
        readOnly={isViewer}
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
    </AppPageContainer>
  );
};

export default ExpenseOverview;
