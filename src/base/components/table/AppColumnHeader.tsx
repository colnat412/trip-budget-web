'use client';

import React, { useState } from 'react';
import { Box, IconButton, Stack, TableCell, Typography } from '@mui/material';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import UnfoldMoreRoundedIcon from '@mui/icons-material/UnfoldMoreRounded';
import FilterAltRoundedIcon from '@mui/icons-material/FilterAltRounded';
import { useTranslations } from 'next-intl';

import AppColumnFilterPopover from './AppColumnFilterPopover';
import type {
  AppTableColumn,
  ColumnFilterValue,
  TableSortState,
} from './types';

interface AppColumnHeaderProps<T> {
  column: AppTableColumn<T>;
  sort: TableSortState | null;
  onSortToggle?: (columnId: string) => void;
  filterValue: ColumnFilterValue;
  onFilterChange: (columnId: string, value: ColumnFilterValue) => void;
}

const AppColumnHeader = <T,>({
  column,
  sort,
  onSortToggle,
  filterValue,
  onFilterChange,
}: AppColumnHeaderProps<T>) => {
  const t = useTranslations('table');
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(
    null,
  );

  const isSorted = sort?.columnId === column.id;
  const sortDirection = isSorted ? sort.direction : null;

  const isFiltered =
    column.filterable &&
    filterValue !== undefined &&
    filterValue !== null &&
    (Array.isArray(filterValue)
      ? filterValue.length > 0
      : String(filterValue).trim() !== '');

  const handleOpenFilter = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setFilterAnchorEl(e.currentTarget);
  };

  const handleCloseFilter = () => {
    setFilterAnchorEl(null);
  };

  const handleSortClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSortToggle?.(column.id);
  };

  return (
    <TableCell
      align={column.align || 'left'}
      sx={{
        fontWeight: 800,
        fontSize: '12px',
        textTransform: 'uppercase',
        color: isSorted || isFiltered ? 'primary.main' : 'text.secondary',
        py: 1.5,
        width: column.width,
        minWidth: column.minWidth,
        userSelect: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      <Stack
        direction="row"
        spacing={0.5}
        sx={{
          alignItems: 'center',
          justifyContent:
            column.align === 'right'
              ? 'flex-end'
              : column.align === 'center'
                ? 'center'
                : 'flex-start',
        }}
      >
        <Typography
          onClick={column.sortable ? handleSortClick : undefined}
          sx={{
            fontWeight: 800,
            fontSize: '12px',
            textTransform: 'uppercase',
            color: 'inherit',
            letterSpacing: '0.5px',
            cursor: column.sortable ? 'pointer' : 'default',
            display: 'inline-flex',
            alignItems: 'center',
            '&:hover': column.sortable ? { color: 'primary.main' } : undefined,
          }}
        >
          {column.label}
        </Typography>

        {column.sortable && (
          <IconButton
            size="small"
            onClick={handleSortClick}
            sx={{
              p: 0.3,
              color: isSorted ? 'primary.main' : 'text.disabled',
              '&:hover': { color: 'primary.main', bgcolor: 'action.hover' },
            }}
            title={t('sortBy', { column: column.label })}
          >
            {sortDirection === 'asc' ? (
              <ArrowUpwardRoundedIcon sx={{ fontSize: 15 }} />
            ) : sortDirection === 'desc' ? (
              <ArrowDownwardRoundedIcon sx={{ fontSize: 15 }} />
            ) : (
              <UnfoldMoreRoundedIcon sx={{ fontSize: 15, opacity: 0.6 }} />
            )}
          </IconButton>
        )}

        {column.filterable && (
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <IconButton
              size="small"
              onClick={handleOpenFilter}
              sx={{
                p: 0.3,
                color: isFiltered ? 'primary.main' : 'text.disabled',
                bgcolor: isFiltered ? 'action.hover' : 'transparent',
                '&:hover': { color: 'primary.main', bgcolor: 'action.hover' },
              }}
              title={t('filterBy', { column: column.label })}
            >
              <FilterAltRoundedIcon sx={{ fontSize: 15 }} />
            </IconButton>

            {isFiltered && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                }}
              />
            )}

            <AppColumnFilterPopover
              anchorEl={filterAnchorEl}
              open={Boolean(filterAnchorEl)}
              onClose={handleCloseFilter}
              column={column}
              currentValue={filterValue}
              onApply={(val) => onFilterChange(column.id, val)}
              onReset={() => onFilterChange(column.id, null)}
            />
          </Box>
        )}
      </Stack>
    </TableCell>
  );
};

export default AppColumnHeader;
