'use client';

import { Box, Skeleton, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { useTripContext } from '../context/TripContext';
import ActiveTripBanner from './overview/ActiveTripBanner';
import CategoryList from './overview/CategoryList';
import EmptyTripState from './overview/EmptyTripState';
import RecentExpenseList from './overview/RecentExpenseList';

const Overview = () => {
  const t = useTranslations('overview');
  const { trips, activeTrip, isLoading, openCreateTrip } = useTripContext();

  if (isLoading) {
    return (
      <Stack
        spacing={3}
        sx={{ p: { xs: 2, md: 3 }, bgcolor: 'action.hover', minHeight: '100%' }}
      >
        <Skeleton
          variant="rounded"
          width="100%"
          height={240}
          sx={{ borderRadius: '20px' }}
        />
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3}>
          <Skeleton
            variant="rounded"
            width="100%"
            height={300}
            sx={{ borderRadius: '20px' }}
          />
          <Skeleton
            variant="rounded"
            width="100%"
            height={300}
            sx={{ borderRadius: '20px' }}
          />
        </Stack>
      </Stack>
    );
  }

  if (!trips || trips.length === 0) {
    return (
      <Stack
        spacing={3}
        sx={{ p: { xs: 2, md: 3 }, bgcolor: 'action.hover', minHeight: '100%' }}
      >
        <EmptyTripState onCreateTrip={openCreateTrip} />
      </Stack>
    );
  }

  const currentTrip = activeTrip || trips[0];

  return (
    <Stack
      spacing={3}
      sx={{ p: { xs: 2, md: 3 }, bgcolor: 'action.hover', minHeight: '100%' }}
    >
      <ActiveTripBanner trip={currentTrip} />

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          gap: 3,
          alignItems: 'stretch',
        }}
      >
        <Stack
          component="section"
          spacing={2.5}
          sx={{
            flex: '1 1 52%',
            minWidth: 0,
            p: { xs: 2, md: 2.5 },
            border: 1,
            borderColor: 'divider',
            borderRadius: '20px',
            bgcolor: 'background.paper',
          }}
        >
          <Typography
            component="h2"
            sx={{ color: 'text.primary', fontSize: '17px', fontWeight: 800 }}
          >
            {t('spendingByCategory')}
          </Typography>
          <CategoryList
            tripId={currentTrip.id}
            currency={currentTrip.baseCurrency}
          />
        </Stack>

        <Stack
          component="section"
          spacing={1}
          sx={{
            flex: '1 1 48%',
            minWidth: 0,
            p: { xs: 2, md: 2.5 },
            border: 1,
            borderColor: 'divider',
            borderRadius: '20px',
            bgcolor: 'background.paper',
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            sx={{ alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Typography
              component="h2"
              sx={{ color: 'text.primary', fontSize: '17px', fontWeight: 800 }}
            >
              {t('recentTitle')}
            </Typography>
            <Typography
              component={Link}
              href="/expenses"
              sx={{
                color: 'primary.main',
                fontSize: '12px',
                fontWeight: 700,
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              {t('viewAll')} →
            </Typography>
          </Stack>
          <RecentExpenseList
            tripId={currentTrip.id}
            currency={currentTrip.baseCurrency}
          />
        </Stack>
      </Box>
    </Stack>
  );
};

export default Overview;
