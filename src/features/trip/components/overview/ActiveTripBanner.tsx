'use client';

import { Box, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import TripSummaryMetric from './TripSummaryMetric';
import { AppButton } from '@/base/components/ui';
import { formatCurrency, formatDateRange } from '@/base/utils';
import { useTripContext } from '../../context/TripContext';
import useTripBudgetSummary from '@/features/expense/hooks/useTripBudgetSummary';
import useTripExpenses from '@/features/expense/hooks/useTripExpenses';
import TripStatusBadge from '../TripStatusBadge';
import type { Trip } from '../../types';

interface ActiveTripBannerProps {
  trip: Trip;
}

const ActiveTripBanner = ({ trip }: ActiveTripBannerProps) => {
  const t = useTranslations('overview');
  const tMembers = useTranslations('members');
  const { openMembers } = useTripContext();
  const dateRangeStr = formatDateRange(trip.startDate, trip.endDate);

  const { summary } = useTripBudgetSummary({ tripId: trip.id });
  const { pagination } = useTripExpenses({ tripId: trip.id, page: 0, size: 1 });

  const totalSpent = summary?.actualSpent ?? 0;
  const totalBudget = summary?.totalBudget ?? 0;
  const remaining = summary?.remainingBudget ?? 0;
  const isOver = totalSpent > totalBudget;

  const donutBorderColor = isOver
    ? 'error.main'
    : (summary?.percentageUsed ?? 0) > 85
      ? 'secondary.main'
      : 'success.main';

  let days = 1;
  if (trip.startDate && trip.endDate) {
    const diff =
      new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime();
    days = Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1);
  }
  const avgPerDay = totalSpent / days;
  const expenseCount = pagination?.totalElements ?? 0;

  return (
    <Box
      component="section"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        overflow: 'hidden',
        borderRadius: '20px',
        px: { xs: 2.5, md: 4 },
        py: 3.5,
        color: '#FFFFFF',
        background:
          'linear-gradient(120deg, #1E3A8A 0%, #167A91 55%, #287E68 100%)',
        boxShadow: '0 18px 45px rgba(15, 23, 42, 0.16)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Stack spacing={1.25} sx={{ minWidth: 0 }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: 'center', flexWrap: 'wrap' }}
          >
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.72)',
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              {t('activeTrip')}
            </Typography>
            <TripStatusBadge status={trip.status} />
          </Stack>

          <Typography
            component="h2"
            sx={{
              fontFamily: 'var(--font-display)',
              fontSize: { xs: '32px', md: '40px' },
              lineHeight: 1.1,
            }}
          >
            {trip.name}
          </Typography>

          <Stack
            direction="row"
            spacing={1.5}
            sx={{ alignItems: 'center', flexWrap: 'wrap', pt: 0.5 }}
          >
            <Typography
              sx={{ color: 'rgba(255,255,255,0.72)', fontSize: '13px' }}
            >
              {trip.destination}
              {dateRangeStr ? ` · ${dateRangeStr}` : ''}
              {trip.baseCurrency ? ` · ${trip.baseCurrency}` : ''}
            </Typography>

            <AppButton
              size="small"
              onClick={() => openMembers(false)}
              startIcon={<GroupRoundedIcon sx={{ fontSize: '14px' }} />}
              sx={{
                minHeight: '28px',
                px: '10px',
                py: '4px',
                borderRadius: '8px',
                bgcolor: 'rgba(255,255,255,0.15)',
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.25)',
                fontSize: '12px',
                fontWeight: 700,
                lineHeight: 1.4,
                textTransform: 'none',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.28)',
                  borderColor: 'rgba(255,255,255,0.4)',
                },
              }}
            >
              {tMembers('dialogTitle')}
            </AppButton>
          </Stack>
        </Stack>

        <Box
          sx={{
            width: '140px',
            height: '140px',
            p: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            borderRadius: '50%',
            border: '10px solid',
            borderColor: donutBorderColor,
            bgcolor: 'rgba(7,18,37,0.18)',
            textAlign: 'center',
          }}
        >
          <Stack spacing={0.25} sx={{ alignItems: 'center' }}>
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '10px',
                fontWeight: 800,
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              {t('spent')}
            </Typography>
            <Typography
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: '14px',
                fontWeight: 800,
                lineHeight: 1.2,
              }}
            >
              {formatCurrency(totalSpent, trip.baseCurrency)}
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
              }}
            >
              / {formatCurrency(totalBudget, trip.baseCurrency)}
            </Typography>
          </Stack>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          px: '16px',
          py: '12px',
          borderRadius: '14px',
          bgcolor: 'rgba(255,255,255,0.1)',
        }}
      >
        <TripSummaryMetric
          label={t('remaining')}
          value={formatCurrency(remaining, trip.baseCurrency)}
          danger={isOver}
        />
        <TripSummaryMetric
          label={t('averagePerDay')}
          value={formatCurrency(avgPerDay, trip.baseCurrency)}
        />
        <TripSummaryMetric
          label={t('expenseCount')}
          value={String(expenseCount)}
        />
      </Box>
    </Box>
  );
};

export default ActiveTripBanner;
