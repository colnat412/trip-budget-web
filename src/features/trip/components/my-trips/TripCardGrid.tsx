'use client';

import React from 'react';
import { Box, Skeleton, Typography } from '@mui/material';
import FlightTakeoffRoundedIcon from '@mui/icons-material/FlightTakeoffRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useTranslations } from 'next-intl';

import { AppButton } from '@/base/components/ui';
import TripCardItem from './TripCardItem';
import type { Trip } from '../../types';

export interface TripCardGridProps {
  trips: Trip[];
  isLoading?: boolean;
  activeTripId?: string | number | null;
  onSelectTrip: (trip: Trip) => void;
  onCreateTrip: () => void;
  onEditTrip?: (trip: Trip) => void;
  onDeleteTrip?: (trip: Trip) => void;
}

const TripCardGrid = ({
  trips,
  isLoading = false,
  activeTripId,
  onSelectTrip,
  onCreateTrip,
  onEditTrip,
  onDeleteTrip,
}: TripCardGridProps) => {
  const t = useTranslations('myTrips');

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(auto-fill, minmax(250px, 1fr))',
          },
          gap: { xs: 1.5, sm: 2, md: 2.5 },
        }}
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <Box
            key={index}
            sx={{
              borderRadius: '14px',
              overflow: 'hidden',
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Skeleton variant="rectangular" sx={{ width: '100%', pt: '58%' }} />
            <Box sx={{ p: 1.75, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Skeleton width="40%" height={22} />
              <Skeleton width="80%" height={18} />
              <Skeleton width="60%" height={14} />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  pt: 1,
                  mt: 0.5,
                  borderTop: 1,
                  borderColor: 'divider',
                }}
              >
                <Skeleton width="28%" height={22} />
                <Skeleton width="28%" height={26} />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  if (trips.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: 1.75,
          py: 7,
          px: 2,
          borderRadius: '14px',
          bgcolor: 'background.paper',
          border: '1px dashed',
          borderColor: 'divider',
        }}
      >
        <Box
          sx={{
            width: 52,
            height: 52,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '14px',
            bgcolor: 'action.hover',
            color: 'primary.main',
          }}
        >
          <FlightTakeoffRoundedIcon sx={{ fontSize: '26px' }} />
        </Box>
        <Box sx={{ maxWidth: 340 }}>
          <Typography
            sx={{
              fontSize: '15px',
              fontWeight: 700,
              color: 'text.primary',
              mb: 0.5,
            }}
          >
            {t('emptyTitle')}
          </Typography>
          <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
            {t('emptyDescription')}
          </Typography>
        </Box>
        <AppButton
          size="small"
          intent="primary"
          startIcon={<AddRoundedIcon fontSize="small" />}
          onClick={onCreateTrip}
        >
          {t('createNew')}
        </AppButton>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(auto-fill, minmax(250px, 1fr))',
        },
        gap: { xs: 1.5, sm: 2, md: 2.5 },
      }}
    >
      {trips.map((trip) => {
        const isActive =
          activeTripId !== null &&
          activeTripId !== undefined &&
          String(trip.id) === String(activeTripId);

        return (
          <TripCardItem
            key={trip.id}
            trip={trip}
            isActive={isActive}
            onSelect={onSelectTrip}
            onEdit={onEditTrip}
            onDelete={onDeleteTrip}
          />
        );
      })}
    </Box>
  );
};

export default TripCardGrid;
