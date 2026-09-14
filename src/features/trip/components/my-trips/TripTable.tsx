'use client';

import React, { useMemo } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import FlightTakeoffRoundedIcon from '@mui/icons-material/FlightTakeoffRounded';
import { useTranslations } from 'next-intl';

import {
  AppActionMenu,
  AppButton,
  AppTable,
  type AppTableColumn,
  type AppTablePaginationProps,
  type ColumnFilterValue,
  type TableSortState,
} from '@/base/components/ui';
import { formatDateRange } from '@/base/utils';
import TripStatusChip from './TripStatusChip';
import type { Trip } from '../../types';

export interface TripTableProps {
  trips: Trip[];
  isLoading: boolean;
  activeTripId: string | number | null;
  onSelectTrip: (trip: Trip) => void;
  onCreateTrip: () => void;
  onEditTrip?: (trip: Trip) => void;
  onDeleteTrip?: (trip: Trip) => void;
  pagination?: AppTablePaginationProps | null;
  sort?: TableSortState | null;
  onSortChange?: (sort: TableSortState | null) => void;
  filters?: Record<string, ColumnFilterValue>;
  onFilterChange?: (filters: Record<string, ColumnFilterValue>) => void;
}

export default function TripTable({
  trips,
  isLoading,
  activeTripId,
  onSelectTrip,
  onCreateTrip,
  onEditTrip,
  onDeleteTrip,
  pagination,
  sort,
  onSortChange,
  filters,
  onFilterChange,
}: TripTableProps) {
  const t = useTranslations('myTrips');
  const tTrip = useTranslations('trip');

  const columns: AppTableColumn<Trip>[] = useMemo(
    () => [
      {
        id: 'name',
        label: t('colName'),
        // sortable: true,
        filterable: true,
        filterType: 'text',
        filterPlaceholder: t('filterNamePlaceholder'),
        getValue: (trip) => trip.name,
        renderCell: (trip) => {
          const isSelected = String(trip.id) === String(activeTripId);
          return (
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
          );
        },
      },
      {
        id: 'destination',
        label: t('colDestination'),
        // sortable: true,
        filterable: true,
        filterType: 'text',
        filterPlaceholder: t('filterDestinationPlaceholder'),
        getValue: (trip) => trip.destination || '',
        renderCell: (trip) => (
          <Typography
            sx={{ fontSize: '14px', fontWeight: 600, color: 'text.primary' }}
          >
            {trip.destination || '—'}
          </Typography>
        ),
      },
      {
        id: 'dates',
        label: t('colDates'),
        sortable: true,
        getValue: (trip) => trip.startDate,
        renderCell: (trip) => (
          <Typography
            sx={{
              fontSize: '13px',
              color: 'text.secondary',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {formatDateRange(trip.startDate, trip.endDate)}
          </Typography>
        ),
      },
      {
        id: 'baseCurrency',
        label: t('colCurrency'),
        filterable: true,
        filterType: 'select',
        filterOptions: [
          { label: 'VND', value: 'VND' },
          { label: 'USD', value: 'USD' },
          { label: 'EUR', value: 'EUR' },
          { label: 'JPY', value: 'JPY' },
          { label: 'THB', value: 'THB' },
          { label: 'SGD', value: 'SGD' },
        ],
        getValue: (trip) => trip.baseCurrency || 'VND',
        renderCell: (trip) => (
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
        ),
      },
      {
        id: 'status',
        label: t('colStatus'),
        // sortable: true,
        filterable: true,
        filterType: 'select',
        filterOptions: [
          { label: tTrip('draft'), value: 'DRAFT' },
          { label: tTrip('planning'), value: 'PLANNING' },
          { label: tTrip('inProgress'), value: 'IN_PROGRESS' },
          { label: tTrip('completed'), value: 'COMPLETED' },
          { label: tTrip('archived'), value: 'ARCHIVED' },
          { label: tTrip('cancelled'), value: 'CANCELLED' },
        ],
        getValue: (trip) => trip.status,
        renderCell: (trip) => <TripStatusChip status={trip.status} />,
      },
      {
        id: 'actions',
        label: t('colActions'),
        align: 'right',
        renderCell: (trip) => {
          const isSelected = String(trip.id) === String(activeTripId);
          const actionMenuItems = [
            {
              id: 'select',
              label: isSelected ? t('selected') : t('select'),
              icon: <CheckCircleOutlineRoundedIcon fontSize="small" />,
              onClick: () => onSelectTrip(trip),
            },
            {
              id: 'edit',
              label: t('edit'),
              icon: <EditRoundedIcon fontSize="small" />,
              onClick: () => onEditTrip?.(trip),
            },
            {
              id: 'delete',
              label: t('delete'),
              icon: <DeleteOutlineRoundedIcon fontSize="small" />,
              danger: true,
              onClick: () => onDeleteTrip?.(trip),
            },
          ];

          return (
            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: 'center', justifyContent: 'flex-end' }}
            >
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

              <AppActionMenu
                items={actionMenuItems}
                ariaLabel={`Actions for ${trip.name}`}
              />
            </Stack>
          );
        },
      },
    ],
    [activeTripId, onSelectTrip, onEditTrip, onDeleteTrip, t, tTrip],
  );

  return (
    <AppTable<Trip>
      columns={columns}
      data={trips}
      isLoading={isLoading}
      selectedRowId={activeTripId}
      onRowClick={onSelectTrip}
      pagination={pagination}
      sort={sort}
      onSortChange={onSortChange}
      filters={filters}
      onFilterChange={onFilterChange}
      emptyState={{
        icon: <FlightTakeoffRoundedIcon sx={{ fontSize: 40 }} />,
        title: t('emptyTitle'),
        description: t('emptyDescription'),
        actionLabel: t('createNew'),
        onAction: onCreateTrip,
      }}
    />
  );
}
