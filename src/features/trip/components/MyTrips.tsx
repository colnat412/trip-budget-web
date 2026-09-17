'use client';

import { useCallback, useState } from 'react';
import { Stack } from '@mui/material';
import { useRouter } from 'next/navigation';

import type { ColumnFilterValue, TableSortState } from '@/base/components/ui';
import useMyTrips from '../hooks/useMyTrips';
import { useTripContext } from '../context/TripContext';
import MyTripsHeader from './my-trips/MyTripsHeader';
import TripTable from './my-trips/TripTable';
import EditTripDialog from './EditTripDialog';
import DeleteTripDialog from './DeleteTripDialog';
import type { Trip } from '../types';

const MyTrips = () => {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sort, setSort] = useState<TableSortState | null>(null);
  const [filters, setFilters] = useState<Record<string, ColumnFilterValue>>({});
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [deletingTrip, setDeletingTrip] = useState<Trip | null>(null);

  const search = typeof filters.name === 'string' ? filters.name : undefined;
  const destination =
    typeof filters.destination === 'string' ? filters.destination : undefined;
  const currency =
    typeof filters.baseCurrency === 'string'
      ? filters.baseCurrency
      : Array.isArray(filters.baseCurrency)
        ? filters.baseCurrency.join(',')
        : undefined;
  const status =
    typeof filters.status === 'string'
      ? filters.status
      : Array.isArray(filters.status)
        ? filters.status.join(',')
        : undefined;

  const { trips, pagination, isLoading, isFetching, refetch } = useMyTrips({
    page,
    size: rowsPerPage,
    search,
    destination,
    currency,
    status,
    sortBy: sort?.columnId,
    sortDirection: sort?.direction,
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

  const handleSortChange = useCallback((newSort: TableSortState | null) => {
    setSort(newSort);
    setPage(0);
  }, []);

  const handleFilterChange = useCallback(
    (newFilters: Record<string, ColumnFilterValue>) => {
      setFilters(newFilters);
      setPage(0);
    },
    [],
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

      <TripTable
        trips={trips}
        isLoading={isLoading}
        isFetching={isFetching}
        activeTripId={activeTrip?.id ?? null}
        onSelectTrip={handleSelectTrip}
        onCreateTrip={openCreateTrip}
        onEditTrip={setEditingTrip}
        onDeleteTrip={setDeletingTrip}
        sort={sort}
        onSortChange={handleSortChange}
        filters={filters}
        onFilterChange={handleFilterChange}
        pagination={
          totalCount > 0
            ? {
                page,
                pageSize: rowsPerPage,
                totalCount,
                onPageChange: setPage,
                onPageSizeChange: (newSize) => {
                  setRowsPerPage(newSize);
                  setPage(0);
                },
                pageSizeOptions: [5, 10, 20],
              }
            : null
        }
      />

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
};

export default MyTrips;
