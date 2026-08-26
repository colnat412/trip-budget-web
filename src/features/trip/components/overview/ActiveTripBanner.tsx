'use client';

import { Box, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import TripSummaryMetric from './TripSummaryMetric';
import { formatDateRange } from '@/base/utils';
import type { Trip } from '../../types';

interface ActiveTripBannerProps {
  trip: Trip;
}

export default function ActiveTripBanner({ trip }: ActiveTripBannerProps) {
  const t = useTranslations('overview');
  const tTrip = useTranslations('trip');
  const dateRangeStr = formatDateRange(trip.startDate, trip.endDate);
  const isLive = trip.status === 'IN_PROGRESS';

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
            {isLive && (
              <Box
                component="span"
                sx={{
                  px: 1,
                  py: 0.25,
                  borderRadius: '999px',
                  bgcolor: 'rgba(74,222,128,0.2)',
                  color: '#86EFAC',
                  fontSize: '11px',
                  fontWeight: 700,
                }}
              >
                ● {tTrip('inProgress')}
              </Box>
            )}
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

          <Typography
            sx={{ color: 'rgba(255,255,255,0.72)', fontSize: '13px' }}
          >
            {trip.destination}
            {dateRangeStr ? ` · ${dateRangeStr}` : ''}
            {trip.baseCurrency ? ` · ${trip.baseCurrency}` : ''}
          </Typography>
        </Stack>

        <Box
          sx={{
            width: 132,
            height: 132,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            borderRadius: '50%',
            border: '12px solid #F97316',
            bgcolor: 'rgba(7,18,37,0.18)',
          }}
        >
          <Stack spacing={0.25} sx={{ alignItems: 'center' }}>
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.65)',
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
                fontSize: '21px',
                fontWeight: 800,
              }}
            >
              12.0tr
            </Typography>
            <Typography
              sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '10px' }}
            >
              / 10tr
            </Typography>
          </Stack>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          px: 2,
          py: 1.5,
          borderRadius: '14px',
          bgcolor: 'rgba(255,255,255,0.1)',
        }}
      >
        <TripSummaryMetric label={t('remaining')} value="-1.985.000 đ" danger />
        <TripSummaryMetric label={t('averagePerDay')} value="2.397.000 đ" />
        <TripSummaryMetric label={t('expenseCount')} value="9" />
      </Box>
    </Box>
  );
}
