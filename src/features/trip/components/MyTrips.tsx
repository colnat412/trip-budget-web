'use client';

import { useCallback, useState } from 'react';
import { Stack } from '@mui/material';
import { useRouter } from 'next/navigation';

import useMyTrips from '../hooks/useMyTrips';
import { useTripContext } from '../context/TripContext';
import MyTripsHeader from './my-trips/MyTripsHeader';
import TripTable from './my-trips/TripTable';
import TripTablePagination from './my-trips/TripTablePagination';
import EditTripDialog from './EditTripDialog';
import DeleteTripDialog from './DeleteTripDialog';
import type { Trip } from '../types';

export default function MyTrips() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [deletingTrip, setDeletingTrip] = useState<Trip | null>(null);

  const { trips, pagination, isLoading, isFetching, refetch } = useMyTrips({
    page,
    size: rowsPerPage,
  });
  const { activeTrip, selectTrip, openCreateTrip, refetchTrips } =
    useTripContext();

  const handleSelectTrip = useCallback(
    (trip: Trip) => {
      selectTrip(trip.id);
      router.push('/overview');
    },
    [selectTrip, router],
  );

  const handleEditSuccess = useCallback(() => {
    refetch();
    refetchTrips();
  }, [refetch, refetchTrips]);

  const handleDeleteSuccess = useCallback(() => {
    refetch();
    refetchTrips();
  }, [refetch, refetchTrips]);

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
          onEditTrip={setEditingTrip}
          onDeleteTrip={setDeletingTrip}
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

      <EditTripDialog
        open={Boolean(editingTrip)}
        trip={editingTrip}
        onClose={() => setEditingTrip(null)}
        onSuccess={handleEditSuccess}
      />

      <DeleteTripDialog
        open={Boolean(deletingTrip)}
        trip={deletingTrip}
        onClose={() => setDeletingTrip(null)}
        onSuccess={handleDeleteSuccess}
      />
    </Stack>
  );
}
