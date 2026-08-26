'use client';

import { useCallback, useState } from 'react';
import { Stack } from '@mui/material';
import { useRouter } from 'next/navigation';

import useMyTrips from '../hooks/useMyTrips';
import { useTripContext } from '../context/TripContext';
import MyTripsHeader from './my-trips/MyTripsHeader';
import TripTable from './my-trips/TripTable';
import TripTablePagination from './my-trips/TripTablePagination';
import type { Trip } from '../types';

export default function MyTrips() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { trips, pagination, isLoading, isFetching } = useMyTrips({
    page,
    size: rowsPerPage,
  });
  const { activeTrip, selectTrip, openCreateTrip } = useTripContext();

  const handleSelectTrip = useCallback(
    (trip: Trip) => {
      selectTrip(trip.id);
      router.push('/overview');
    },
    [selectTrip, router],
  );

  const totalCount = pagination?.totalElements ?? trips.length;

  return (
    <Stack
      spacing={3}
      sx={{
        p: { xs: 2, md: 3 },
        bgcolor: 'action.hover',
        minHeight: '100%',
      }}
    >
      <MyTripsHeader totalTrips={totalCount} onCreateTrip={openCreateTrip} />

      <Stack
        spacing={0}
        sx={{
          bgcolor: 'background.paper',
          borderRadius: '16px',
          border: 1,
          borderColor: 'divider',
          overflow: 'hidden',
        }}
      >
        <TripTable
          trips={trips}
          isLoading={isLoading || isFetching}
          activeTripId={activeTrip?.id ?? null}
          onSelectTrip={handleSelectTrip}
          onCreateTrip={openCreateTrip}
        />
        {totalCount > 0 && (
          <TripTablePagination
            count={totalCount}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={setPage}
            onRowsPerPageChange={setRowsPerPage}
          />
        )}
      </Stack>
    </Stack>
  );
}
