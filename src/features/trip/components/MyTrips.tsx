'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';

import {
  AppPageContainer,
  type ColumnFilterValue,
  type TableSortState,
} from '@/base/components/ui';
import useMyTrips from '../hooks/useMyTrips';
import { useTripContext } from '../context/TripContext';
import MyTripsHeader from './my-trips/MyTripsHeader';
import TripFilterBar, { type TripFilterValues } from './my-trips/TripFilterBar';
import TripCardGrid from './my-trips/TripCardGrid';
import TripTable from './my-trips/TripTable';
import TripGridPagination from './my-trips/TripGridPagination';
import EditTripDialog from './EditTripDialog';
import DeleteTripDialog from './DeleteTripDialog';
import type { Trip } from '../types';

const MyTrips = () => {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [sort, setSort] = useState<TableSortState | null>(null);
  const [filters, setFilters] = useState<Record<string, ColumnFilterValue>>({});
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
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
  const {
    activeTrip,
    selectTrip,
    openCreateTrip,
    refetchTrips,
    subscribeTrips,
  } = useTripContext();

  useEffect(() => {
    return subscribeTrips((event) => {
      if (event === 'created') {
        const hasCustomState =
          page !== 0 || Object.keys(filters).length > 0 || sort !== null;

        setPage(0);
        setFilters({});
        setSort(null);

        if (!hasCustomState) {
          void refetch();
        }
      } else {
        void refetch();
      }
    });
  }, [subscribeTrips, page, filters, sort, refetch]);

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

  const filterValues: TripFilterValues = useMemo(
    () => ({
      search: typeof filters.name === 'string' ? filters.name : '',
      destination:
        typeof filters.destination === 'string' ? filters.destination : '',
      status:
        typeof filters.status === 'string'
          ? filters.status
          : Array.isArray(filters.status)
            ? filters.status.join(',')
            : '',
      currency:
        typeof filters.baseCurrency === 'string'
          ? filters.baseCurrency
          : Array.isArray(filters.baseCurrency)
            ? filters.baseCurrency.join(',')
            : '',
    }),
    [filters],
  );

  const handleFilterUpdate = useCallback((patch: Partial<TripFilterValues>) => {
    setFilters((prev) => {
      const next = { ...prev };
      if ('search' in patch) {
        if (!patch.search) delete next.name;
        else next.name = patch.search;
      }
      if ('destination' in patch) {
        if (!patch.destination) delete next.destination;
        else next.destination = patch.destination;
      }
      if ('status' in patch) {
        if (!patch.status) delete next.status;
        else next.status = patch.status;
      }
      if ('currency' in patch) {
        if (!patch.currency) delete next.baseCurrency;
        else next.baseCurrency = patch.currency;
      }
      return next;
    });
    setPage(0);
  }, []);

  const handleEditSuccess = useCallback(() => {
    void refetchTrips('updated');
  }, [refetchTrips]);

  const handleDeleteSuccess = useCallback(() => {
    void refetchTrips('deleted');
  }, [refetchTrips]);

  const totalCount = pagination?.totalElements ?? trips.length;

  return (
    <AppPageContainer>
      <MyTripsHeader totalTrips={totalCount} onCreateTrip={openCreateTrip} />

      <TripFilterBar
        filters={filterValues}
        onFilterChange={handleFilterUpdate}
        sort={sort}
        onSortChange={handleSortChange}
        totalTrips={totalCount}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {viewMode === 'grid' ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TripCardGrid
            trips={trips}
            isLoading={isLoading}
            activeTripId={activeTrip?.id ?? null}
            onSelectTrip={handleSelectTrip}
            onCreateTrip={openCreateTrip}
            onEditTrip={setEditingTrip}
            onDeleteTrip={setDeletingTrip}
          />

          {totalCount > 0 && (
            <TripGridPagination
              count={totalCount}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={setPage}
              onRowsPerPageChange={(newSize) => {
                setRowsPerPage(newSize);
                setPage(0);
              }}
            />
          )}
        </Box>
      ) : (
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
      )}

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
    </AppPageContainer>
  );
};

export default MyTrips;
