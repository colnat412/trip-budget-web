'use client';

import { Box, Stack, TableCell, TableRow, Typography } from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import FlightTakeoffRoundedIcon from '@mui/icons-material/FlightTakeoffRounded';
import { useTranslations } from 'next-intl';

import { AppButton } from '@/base/components/ui';
import { formatDateRange } from '@/base/utils';
import TripStatusChip from './TripStatusChip';
import type { Trip } from '../../types';

interface TripTableRowProps {
  trip: Trip;
  isSelected: boolean;
  onSelectTrip: (trip: Trip) => void;
}

export default function TripTableRow({
  trip,
  isSelected,
  onSelectTrip,
}: TripTableRowProps) {
  const t = useTranslations('myTrips');
  const dateRangeStr = formatDateRange(trip.startDate, trip.endDate);

  return (
    <TableRow
      hover
      sx={{
        bgcolor: isSelected ? 'action.selected' : 'inherit',
        cursor: 'pointer',
        '&:last-child td, &:last-child th': { border: 0 },
      }}
      onClick={() => onSelectTrip(trip)}
    >
      <TableCell sx={{ py: 2 }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '10px',
              bgcolor: isSelected ? 'primary.main' : 'action.hover',
              color: isSelected ? 'primary.contrastText' : 'primary.main',
              flexShrink: 0,
            }}
          >
            <FlightTakeoffRoundedIcon sx={{ fontSize: '18px' }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              noWrap
              sx={{
                fontSize: '14px',
                fontWeight: 700,
                color: 'text.primary',
              }}
            >
              {trip.name}
            </Typography>
            {trip.description && (
              <Typography
                noWrap
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontSize: '12px',
                  display: 'block',
                  maxWidth: 240,
                }}
              >
                {trip.description}
              </Typography>
            )}
          </Box>
        </Stack>
      </TableCell>

      <TableCell sx={{ py: 2 }}>
        <Typography
          sx={{ fontSize: '14px', fontWeight: 600, color: 'text.primary' }}
        >
          {trip.destination}
        </Typography>
      </TableCell>

      <TableCell sx={{ py: 2 }}>
        <Typography
          sx={{
            fontSize: '13px',
            color: 'text.secondary',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {dateRangeStr}
        </Typography>
      </TableCell>

      <TableCell sx={{ py: 2 }}>
        <Typography
          sx={{
            fontSize: '13px',
            fontWeight: 700,
            color: 'text.primary',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {trip.baseCurrency || 'VND'}
        </Typography>
      </TableCell>

      <TableCell sx={{ py: 2 }}>
        <TripStatusChip status={trip.status} />
      </TableCell>

      <TableCell align="right" sx={{ py: 2 }}>
        <AppButton
          size="small"
          intent={isSelected ? 'secondary' : 'primary'}
          endIcon={
            isSelected ? (
              <CheckCircleRoundedIcon fontSize="small" />
            ) : (
              <ArrowForwardRoundedIcon fontSize="small" />
            )
          }
          onClick={(e) => {
            e.stopPropagation();
            onSelectTrip(trip);
          }}
          sx={{ minHeight: 32, fontSize: '12px' }}
        >
          {isSelected ? t('selected') : t('viewTrip')}
        </AppButton>
      </TableCell>
    </TableRow>
  );
}
