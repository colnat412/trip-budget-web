'use client';

import { Box, Stack, Typography } from '@mui/material';
import FlightTakeoffRoundedIcon from '@mui/icons-material/FlightTakeoffRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useTranslations } from 'next-intl';

import { AppButton } from '@/base/components/ui';

interface MyTripsHeaderProps {
  totalTrips: number;
  onCreateTrip: () => void;
}

const MyTripsHeader = ({
  totalTrips,
  onCreateTrip,
}: MyTripsHeaderProps) => {
  const t = useTranslations('myTrips');

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      sx={{
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'space-between',
      }}
    >
      <Box>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <FlightTakeoffRoundedIcon
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
            {t('title')}
          </Typography>
          <Box
            sx={{
              px: 1,
              py: 0.25,
              borderRadius: '999px',
              bgcolor: 'action.hover',
              fontSize: '12px',
              fontWeight: 700,
              color: 'text.secondary',
            }}
          >
            {totalTrips}
          </Box>
        </Stack>
        <Typography sx={{ color: 'text.secondary', fontSize: '14px', mt: 0.5 }}>
          {t('description')}
        </Typography>
      </Box>

      <AppButton
        intent="primary"
        size="medium"
        startIcon={<AddRoundedIcon fontSize="small" />}
        onClick={onCreateTrip}
        sx={{ flexShrink: 0 }}
      >
        {t('createNew')}
      </AppButton>
    </Stack>
  );
};

export default MyTripsHeader;
