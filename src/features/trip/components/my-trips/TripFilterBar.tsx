'use client';

import React from 'react';
import {
  Box,
  IconButton,
  InputAdornment,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import TableRowsRoundedIcon from '@mui/icons-material/TableRowsRounded';
import { useTranslations } from 'next-intl';

import {
  AppSelect,
  type AppSelectOption,
  AppTextField,
  AppFilterChipGroup,
  type AppFilterChipOption,
  type TableSortState,
} from '@/base/components/ui';

export interface TripFilterValues {
  search: string;
  destination: string;
  status: string;
  currency: string;
}

export interface TripFilterBarProps {
  filters: TripFilterValues;
  onFilterChange: (patch: Partial<TripFilterValues>) => void;
  sort: TableSortState | null;
  onSortChange: (sort: TableSortState | null) => void;
  totalTrips: number;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
}

const POPULAR_DESTINATIONS = [
  'Đà Nẵng',
  'Đà Lạt',
  'Hà Nội',
  'Phú Quốc',
  'Sapa',
  'Hồ Chí Minh',
  'Hội An',
  'Nha Trang',
];

const CURRENCIES = [
  { code: 'VND', label: 'VND (₫)' },
  { code: 'USD', label: 'USD ($)' },
  { code: 'EUR', label: 'EUR (€)' },
  { code: 'JPY', label: 'JPY (¥)' },
  { code: 'KRW', label: 'KRW (₩)' },
];

const TripFilterBar = ({
  filters,
  onFilterChange,
  sort,
  onSortChange,
  totalTrips,
  viewMode,
  onViewModeChange,
}: TripFilterBarProps) => {
  const t = useTranslations('myTrips');
  const tTrip = useTranslations('trip');

  const { search, destination, status, currency } = filters;

  const destinationOptions: AppSelectOption[] = [
    { value: '', label: t('all') },
    ...POPULAR_DESTINATIONS.map((d) => ({ value: d, label: d })),
  ];

  const statusOptions: AppSelectOption[] = [
    { value: '', label: tTrip('allTrips') },
    { value: 'IN_PROGRESS', label: tTrip('inProgress') },
    { value: 'PLANNING', label: tTrip('planning') },
    { value: 'CONFIRMED', label: tTrip('confirmed') },
    { value: 'COMPLETED', label: tTrip('completed') },
    { value: 'DRAFT', label: tTrip('draft') },
  ];

  const currencyOptions: AppSelectOption[] = [
    { value: '', label: t('all') },
    ...CURRENCIES.map((c) => ({ value: c.code, label: c.label })),
  ];

  const sortOptions: AppSelectOption[] = [
    { value: 'newest', label: t('sortNewest') },
    { value: 'oldest', label: t('sortOldest') },
    { value: 'nameAsc', label: t('sortName') },
    { value: 'destinationAsc', label: t('sortDestination') },
  ];

  const quickTagOptions: AppFilterChipOption<string>[] =
    POPULAR_DESTINATIONS.map((dest) => ({
      value: dest,
      label: dest,
    }));

  const getSortSelectValue = () => {
    if (!sort) return 'newest';
    if (sort.columnId === 'createdAt' && sort.direction === 'asc')
      return 'oldest';
    if (sort.columnId === 'name' && sort.direction === 'asc') return 'nameAsc';
    if (sort.columnId === 'destination' && sort.direction === 'asc')
      return 'destinationAsc';
    return 'newest';
  };

  const handleSortChange = (val: string) => {
    if (!val || val === 'newest') {
      onSortChange(null);
    } else if (val === 'oldest') {
      onSortChange({ columnId: 'createdAt', direction: 'asc' });
    } else if (val === 'nameAsc') {
      onSortChange({ columnId: 'name', direction: 'asc' });
    } else if (val === 'destinationAsc') {
      onSortChange({ columnId: 'destination', direction: 'asc' });
    }
  };

  const filterSelectSx = {
    flex: { xs: '1 1 calc(33.333% - 6px)', sm: '0 0 auto' },
    minWidth: { xs: 80, sm: 120 },
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 0.5 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 1,
          alignItems: { xs: 'stretch', md: 'center' },
        }}
      >
        <AppTextField
          value={search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          placeholder={t('filterNamePlaceholder')}
          size="small"
          variantType="search"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon
                    sx={{ color: 'text.secondary', fontSize: 18 }}
                  />
                </InputAdornment>
              ),
              endAdornment: search ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => onFilterChange({ search: '' })}
                    edge="end"
                    aria-label="clear search"
                    sx={{ p: 0.5 }}
                  >
                    <ClearRoundedIcon sx={{ fontSize: 15 }} />
                  </IconButton>
                </InputAdornment>
              ) : null,
            },
          }}
          sx={{ flex: 1 }}
        />

        <Box
          sx={{
            display: 'flex',
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            gap: 1,
            width: { xs: '100%', md: 'auto' },
          }}
        >
          <AppSelect
            variantType="filter"
            label={t('allDestinations')}
            value={destination}
            options={destinationOptions}
            onChange={(e) =>
              onFilterChange({ destination: String(e.target.value ?? '') })
            }
            sx={filterSelectSx}
          />

          <AppSelect
            variantType="filter"
            label={tTrip('statusLabel')}
            value={status}
            options={statusOptions}
            onChange={(e) =>
              onFilterChange({ status: String(e.target.value ?? '') })
            }
            sx={filterSelectSx}
          />

          <AppSelect
            variantType="filter"
            label={t('allCurrencies')}
            value={currency}
            options={currencyOptions}
            onChange={(e) =>
              onFilterChange({ currency: String(e.target.value ?? '') })
            }
            sx={filterSelectSx}
          />
        </Box>
      </Box>

      <AppFilterChipGroup
        label={t('popularKeywords')}
        options={quickTagOptions}
        value={destination}
        onChange={(dest) => onFilterChange({ destination: dest })}
        allLabel={t('all') || 'Tất cả'}
        showAll
      />

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          gap: 1,
          pt: 1,
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Typography
          sx={{
            fontSize: '12.5px',
            fontWeight: 700,
            color: 'text.secondary',
          }}
        >
          {totalTrips} {t('resultsLabel') || 'kết quả'}
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: 'center',
            justifyContent: { xs: 'space-between', sm: 'flex-end' },
          }}
        >
          <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontWeight: 600,
                fontSize: '12px',
                display: { xs: 'none', sm: 'inline' },
              }}
            >
              {t('sortBy')}
            </Typography>
            <AppSelect
              variantType="compact"
              label={t('sortBy')}
              value={getSortSelectValue()}
              options={sortOptions}
              onChange={(e) => handleSortChange(String(e.target.value ?? ''))}
              sx={{ minWidth: { xs: 110, sm: 125 } }}
            />
          </Stack>

          <ToggleButtonGroup
            size="small"
            value={viewMode}
            exclusive
            onChange={(_, val) => {
              if (val) onViewModeChange(val);
            }}
            aria-label="view mode"
            sx={{
              height: 32,
              bgcolor: 'background.paper',
              '& .MuiToggleButton-root': {
                px: 1,
                py: 0.25,
                borderColor: 'divider',
                '&.Mui-selected': {
                  bgcolor: 'action.selected',
                  color: 'primary.main',
                },
              },
            }}
          >
            <ToggleButton value="grid" aria-label="grid view">
              <GridViewRoundedIcon sx={{ fontSize: 16 }} />
            </ToggleButton>
            <ToggleButton value="table" aria-label="table view">
              <TableRowsRoundedIcon sx={{ fontSize: 16 }} />
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Box>
    </Box>
  );
};

export default TripFilterBar;
