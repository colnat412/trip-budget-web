'use client';

import {
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useTranslations } from 'next-intl';

import EmptyTripTable from './EmptyTripTable';
import TripTableRow from './TripTableRow';
import type { Trip } from '../../types';

interface TripTableProps {
  trips: Trip[];
  isLoading: boolean;
  activeTripId: number | null;
  onSelectTrip: (trip: Trip) => void;
  onCreateTrip: () => void;
  onEditTrip?: (trip: Trip) => void;
  onDeleteTrip?: (trip: Trip) => void;
}

export default function TripTable({
  trips,
  isLoading,
  activeTripId,
  onSelectTrip,
  onCreateTrip,
  onEditTrip,
  onDeleteTrip,
}: TripTableProps) {
  const t = useTranslations('myTrips');

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        borderRadius: '16px',
        border: 1,
        borderColor: 'divider',
        overflow: 'hidden',
      }}
    >
      <Table sx={{ minWidth: 650 }}>
        <TableHead sx={{ bgcolor: 'action.hover' }}>
          <TableRow>
            <TableCell
              sx={{
                fontWeight: 800,
                fontSize: '12px',
                textTransform: 'uppercase',
                color: 'text.secondary',
                py: 1.5,
              }}
            >
              {t('colName')}
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 800,
                fontSize: '12px',
                textTransform: 'uppercase',
                color: 'text.secondary',
                py: 1.5,
              }}
            >
              {t('colDestination')}
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 800,
                fontSize: '12px',
                textTransform: 'uppercase',
                color: 'text.secondary',
                py: 1.5,
              }}
            >
              {t('colDates')}
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 800,
                fontSize: '12px',
                textTransform: 'uppercase',
                color: 'text.secondary',
                py: 1.5,
              }}
            >
              {t('colCurrency')}
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 800,
                fontSize: '12px',
                textTransform: 'uppercase',
                color: 'text.secondary',
                py: 1.5,
              }}
            >
              {t('colStatus')}
            </TableCell>
            <TableCell
              align="right"
              sx={{
                fontWeight: 800,
                fontSize: '12px',
                textTransform: 'uppercase',
                color: 'text.secondary',
                py: 1.5,
              }}
            >
              {t('colActions')}
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton variant="text" width="80%" height={24} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width="60%" height={24} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width="70%" height={24} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width="40%" height={24} />
                </TableCell>
                <TableCell>
                  <Skeleton
                    variant="rounded"
                    width={80}
                    height={24}
                    sx={{ borderRadius: '6px' }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Skeleton
                    variant="rounded"
                    width={90}
                    height={32}
                    sx={{ ml: 'auto', borderRadius: '8px' }}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : trips.length === 0 ? (
            <EmptyTripTable onCreateTrip={onCreateTrip} />
          ) : (
            trips.map((trip) => (
              <TripTableRow
                key={trip.id}
                trip={trip}
                isSelected={trip.id === activeTripId}
                onSelectTrip={onSelectTrip}
                onEditTrip={onEditTrip}
                onDeleteTrip={onDeleteTrip}
              />
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
