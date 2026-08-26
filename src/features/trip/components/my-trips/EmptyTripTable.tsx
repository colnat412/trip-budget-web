'use client';

import { Box, TableCell, TableRow, Typography } from '@mui/material';
import FlightTakeoffRoundedIcon from '@mui/icons-material/FlightTakeoffRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useTranslations } from 'next-intl';

import { AppButton } from '@/base/components/ui';

interface EmptyTripTableProps {
  onCreateTrip: () => void;
}

export default function EmptyTripTable({ onCreateTrip }: EmptyTripTableProps) {
  const t = useTranslations('myTrips');

  return (
    <TableRow>
      <TableCell colSpan={6} sx={{ py: 8, textAlign: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '16px',
              bgcolor: 'action.hover',
              color: 'text.secondary',
            }}
          >
            <FlightTakeoffRoundedIcon sx={{ fontSize: '28px' }} />
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: '16px',
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
      </TableCell>
    </TableRow>
  );
}
