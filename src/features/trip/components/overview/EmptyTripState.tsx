'use client';

import { Box, Typography } from '@mui/material';
import FlightTakeoffRoundedIcon from '@mui/icons-material/FlightTakeoffRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useTranslations } from 'next-intl';

import { AppButton } from '@/base/components/ui';

interface EmptyTripStateProps {
  onCreateTrip: () => void;
}

const EmptyTripState = ({ onCreateTrip }: EmptyTripStateProps) => {
  const tTrip = useTranslations('trip');

  return (
    <Box
      component="section"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: 2.5,
        p: { xs: 4, md: 6 },
        borderRadius: '20px',
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '20px',
          bgcolor: 'primary.light',
          color: 'primary.contrastText',
        }}
      >
        <FlightTakeoffRoundedIcon sx={{ fontSize: '32px' }} />
      </Box>

      <Box sx={{ maxWidth: 460 }}>
        <Typography
          component="h2"
          sx={{
            fontFamily: 'var(--font-display)',
            fontSize: { xs: '24px', md: '28px' },
            fontWeight: 700,
            color: 'text.primary',
            mb: 1,
          }}
        >
          {tTrip('noTrips')}
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: '14px' }}>
          {tTrip('createDescription')}
        </Typography>
      </Box>

      <AppButton
        intent="primary"
        size="large"
        startIcon={<AddRoundedIcon />}
        onClick={onCreateTrip}
        sx={{ minHeight: 48, px: 4 }}
      >
        {tTrip('createTrip')}
      </AppButton>
    </Box>
  );
};

export default EmptyTripState;
