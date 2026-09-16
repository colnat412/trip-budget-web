'use client';

import React, { useState } from 'react';
import { Box, Skeleton, Stack, Typography } from '@mui/material';
import HandshakeRoundedIcon from '@mui/icons-material/HandshakeRounded';
import LuggageRoundedIcon from '@mui/icons-material/LuggageRounded';
import { useTranslations } from 'next-intl';

import {
  AppButton,
  AppCard,
  AppToast,
  type AppToastSeverity,
} from '@/base/components/ui';
import { useTripContext } from '@/features/trip/context/TripContext';
import {
  useCreateSettlement,
  useDeleteSettlement,
  useTripSettlementSummary,
} from '../hooks/useTripSettlement';
import MemberBalancesTable from './MemberBalancesTable';
import MyBalanceCard from './MyBalanceCard';
import RecordSettlementDialog from './RecordSettlementDialog';
import SettlementHistoryTable from './SettlementHistoryTable';
import SuggestedSettlementsList from './SuggestedSettlementsList';
import type {
  CreateSettlementRequest,
  Settlement,
  SuggestedSettlement,
} from '../types';

export default function SettlementOverview() {
  const t = useTranslations('settlement');
  const tTrip = useTranslations('trip');
  const {
    activeTrip,
    trips,
    isLoading: isTripLoading,
    openCreateTrip,
  } = useTripContext();

  const currentTrip = activeTrip || trips[0];
  const tripId = currentTrip?.id;

  const {
    summary,
    isLoading: isSummaryLoading,
    refetch,
  } = useTripSettlementSummary({
    tripId,
    enabled: Boolean(tripId),
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInitialData, setDialogInitialData] = useState<
    Partial<CreateSettlementRequest> | undefined
  >(undefined);

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

  const { createSettlementAsync, isPending: isCreating } = useCreateSettlement({
    tripId: tripId ?? '',
  });

  const { deleteSettlementAsync } = useDeleteSettlement({
    tripId: tripId ?? '',
  });

  const handleOpenRecordPayment = (prefill?: SuggestedSettlement) => {
    if (prefill) {
      setDialogInitialData({
        payerId: prefill.fromUserId,
        payeeId: prefill.toUserId,
        amount: prefill.amount,
        currency: prefill.currency,
      });
    } else {
      setDialogInitialData(undefined);
    }
    setDialogOpen(true);
  };

  const handleCreateSettlement = async (data: CreateSettlementRequest) => {
    try {
      await createSettlementAsync(data);
      showToast(t('toasts.createSuccess'), 'success');
      setDialogOpen(false);
      refetch();
    } catch (error) {
      console.error('Error creating settlement:', error);
      showToast(t('toasts.createError'), 'error');
    }
  };

  const handleDeleteSettlement = async (settlement: Settlement) => {
    try {
      await deleteSettlementAsync({ settlementId: settlement.id });
      showToast(t('toasts.deleteSuccess'), 'info');
      refetch();
    } catch (error) {
      console.error('Error deleting settlement:', error);
      showToast(t('toasts.deleteError'), 'error');
    }
  };

  if (isTripLoading || (isSummaryLoading && !summary)) {
    return (
      <Stack
        spacing={3}
        sx={{ p: { xs: 2, md: 3 }, bgcolor: 'action.hover', minHeight: '100%' }}
      >
        <Skeleton
          variant="rounded"
          width="100%"
          height={160}
          sx={{ borderRadius: '20px' }}
        />
        <Skeleton
          variant="rounded"
          width="100%"
          height={200}
          sx={{ borderRadius: '20px' }}
        />
        <Skeleton
          variant="rounded"
          width="100%"
          height={300}
          sx={{ borderRadius: '20px' }}
        />
      </Stack>
    );
  }

  if (!currentTrip) {
    return (
      <Stack
        spacing={3}
        sx={{ p: { xs: 2, md: 3 }, bgcolor: 'action.hover', minHeight: '100%' }}
      >
        <AppCard sx={{ p: 5, textAlign: 'center', borderRadius: '20px' }}>
          <Stack spacing={2} sx={{ alignItems: 'center' }}>
            <LuggageRoundedIcon sx={{ fontSize: 48, color: 'text.disabled' }} />
            <Typography sx={{ fontSize: '18px', fontWeight: 700 }}>
              {tTrip('noTrips')}
            </Typography>
            <AppButton intent="primary" onClick={openCreateTrip}>
              {tTrip('createTrip')}
            </AppButton>
          </Stack>
        </AppCard>
      </Stack>
    );
  }

  const memberOptions = (summary?.memberBalances || []).map((m) => ({
    userId: m.userId,
    name: m.name,
  }));

  const currency = summary?.currency || currentTrip.baseCurrency || 'VND';

  return (
    <Box
      sx={{ p: { xs: 2, md: 3 }, bgcolor: 'action.hover', minHeight: '100%' }}
    >
      <Stack spacing={3}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
          }}
        >
          <Stack spacing={0.5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography
                component="h1"
                sx={{
                  fontSize: { xs: '20px', md: '24px' },
                  fontWeight: 800,
                  color: 'text.primary',
                  letterSpacing: '-0.5px',
                }}
              >
                {t('pageTitle')}
              </Typography>
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '999px',
                  bgcolor: 'action.hover',
                  border: 1,
                  borderColor: 'divider',
                  color: 'primary.main',
                  fontSize: '12px',
                  fontWeight: 700,
                }}
              >
                {currentTrip.name}
              </Box>
            </Box>
            <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
              {t('pageSubtitle')}
            </Typography>
          </Stack>

          <AppButton
            intent="primary"
            startIcon={<HandshakeRoundedIcon sx={{ fontSize: '18px' }} />}
            onClick={() => handleOpenRecordPayment()}
          >
            {t('recordPayment')}
          </AppButton>
        </Box>

        <MyBalanceCard
          myBalance={summary?.myBalance ?? 0}
          myStatus={summary?.myStatus ?? 'SETTLED'}
          currency={currency}
          totalExpenses={summary?.totalExpenses ?? 0}
          totalSettled={summary?.totalSettled ?? 0}
          onOpenRecordPayment={() => handleOpenRecordPayment()}
        />

        <Stack spacing={1.5}>
          <Box>
            <Typography
              sx={{ fontSize: '16px', fontWeight: 700, color: 'text.primary' }}
            >
              {t('suggestedTitle')}
            </Typography>
            <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
              {t('suggestedDesc')}
            </Typography>
          </Box>

          <SuggestedSettlementsList
            suggestedSettlements={summary?.suggestedSettlements ?? []}
            onSettle={(settlement) => handleOpenRecordPayment(settlement)}
          />
        </Stack>

        <MemberBalancesTable
          memberBalances={summary?.memberBalances ?? []}
          currency={currency}
        />

        <SettlementHistoryTable
          settlements={summary?.settlementHistory ?? []}
          onDelete={handleDeleteSettlement}
        />
      </Stack>

      {dialogOpen && (
        <RecordSettlementDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          members={memberOptions}
          initialData={dialogInitialData}
          currency={currency}
          isLoading={isCreating}
          onSubmit={handleCreateSettlement}
        />
      )}

      <AppToast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />
    </Box>
  );
}
