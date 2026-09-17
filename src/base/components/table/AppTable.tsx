'use client';

import React, { useMemo, useState } from 'react';
import {
  Box,
  Chip,
  Collapse,
  LinearProgress,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  alpha,
} from '@mui/material';
import FilterAltOffRoundedIcon from '@mui/icons-material/FilterAltOffRounded';
import InboxRoundedIcon from '@mui/icons-material/InboxRounded';
import { useTranslations } from 'next-intl';

import { AppButton } from '../ui';
import AppColumnHeader from './AppColumnHeader';
import AppTablePagination from './AppTablePagination';
import type { AppTableProps, ColumnFilterValue, TableSortState } from './types';

const AppTable = <T,>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  isFetching = false,
  loadingRowsCount = 5,
  pagination,
  emptyState,
  emptyContent,
  header,
  selectedRowId,
  isRowSelected,
  onRowClick,
  sort: controlledSort,
  onSortChange: controlledOnSortChange,
  filters: controlledFilters,
  onFilterChange: controlledOnFilterChange,
  minWidth = 650,
  sx,
}: AppTableProps<T>) => {
  const t = useTranslations('table');

  const [internalSort, setInternalSort] = useState<TableSortState | null>(null);
  const activeSort =
    controlledSort !== undefined ? controlledSort : internalSort;

  const [internalFilters, setInternalFilters] = useState<
    Record<string, ColumnFilterValue>
  >({});
  const activeFilters =
    controlledFilters !== undefined ? controlledFilters : internalFilters;

  const handleSortToggle = (columnId: string) => {
    let newSort: TableSortState | null = null;
    if (!activeSort || activeSort.columnId !== columnId) {
      newSort = { columnId, direction: 'asc' };
    } else if (activeSort.direction === 'asc') {
      newSort = { columnId, direction: 'desc' };
    } else {
      newSort = null;
    }

    if (controlledOnSortChange) {
      controlledOnSortChange(newSort);
    } else {
      setInternalSort(newSort);
    }
  };

  const handleFilterChange = (columnId: string, value: ColumnFilterValue) => {
    const nextFilters = { ...activeFilters };
    if (
      value === null ||
      value === undefined ||
      (Array.isArray(value) && value.length === 0) ||
      String(value).trim() === ''
    ) {
      delete nextFilters[columnId];
    } else {
      nextFilters[columnId] = value;
    }

    if (controlledOnFilterChange) {
      controlledOnFilterChange(nextFilters);
    } else {
      setInternalFilters(nextFilters);
    }
  };

  const handleClearAllFilters = () => {
    if (controlledOnFilterChange) {
      controlledOnFilterChange({});
    } else {
      setInternalFilters({});
    }
  };

  const activeFilterEntries = useMemo(() => {
    return Object.entries(activeFilters).filter(([, val]) => {
      if (val === null || val === undefined) return false;
      if (Array.isArray(val)) return val.length > 0;
      return String(val).trim() !== '';
    });
  }, [activeFilters]);

  const displayData = data;
  const shouldShowSkeleton =
    (isLoading || isFetching) && displayData.length === 0;

  const defaultKeyExtractor = (item: T, index: number): string | number => {
    if (keyExtractor) return keyExtractor(item, index);
    if (
      typeof item === 'object' &&
      item !== null &&
      'id' in item &&
      (typeof (item as { id: unknown }).id === 'string' ||
        typeof (item as { id: unknown }).id === 'number')
    ) {
      return (item as { id: string | number }).id;
    }
    return index;
  };

  return (
    <Stack
      spacing={0}
      sx={{
        bgcolor: 'background.paper',
        borderRadius: '16px',
        border: 1,
        borderColor: 'divider',
        overflow: 'hidden',
        ...sx,
      }}
    >
      {header && <Box>{header}</Box>}

      <Collapse in={activeFilterEntries.length > 0} unmountOnExit>
        <Stack
          direction="row"
          sx={{
            py: 1,
            px: { xs: 2, sm: 2.5 },
            bgcolor: 'action.hover',
            borderBottom: 1,
            borderColor: 'divider',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 0.75,
              flexGrow: 1,
              minWidth: 0,
            }}
          >
            <Typography
              sx={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'text.secondary',
                letterSpacing: '0.5px',
              }}
            >
              {t('filtering')}
            </Typography>

            {activeFilterEntries.map(([colId, val]) => {
              const col = columns.find((c) => c.id === colId);
              const label = col ? col.label : colId;
              let displayVal = String(val);
              if (Array.isArray(val)) {
                if (col?.filterOptions) {
                  const labels = val.map((v) => {
                    const opt = col.filterOptions?.find((o) => o.value === v);
                    return opt ? opt.label : String(v);
                  });
                  displayVal = labels.join(', ');
                } else {
                  displayVal = val.join(', ');
                }
              }

              return (
                <Chip
                  key={colId}
                  size="small"
                  label={`${label}: ${displayVal}`}
                  onDelete={() => handleFilterChange(colId, null)}
                  sx={{
                    bgcolor: 'background.paper',
                    border: 1,
                    borderColor: 'divider',
                    fontWeight: 600,
                    fontSize: '11px',
                    color: 'primary.main',
                  }}
                />
              );
            })}
          </Box>

          <AppButton
            size="small"
            intent="secondary"
            startIcon={<FilterAltOffRoundedIcon sx={{ fontSize: 13 }} />}
            onClick={handleClearAllFilters}
            sx={{
              fontSize: '11px',
              py: 0.2,
              px: 1,
              minHeight: 24,
            }}
          >
            {t('clearAll')}
          </AppButton>
        </Stack>
      </Collapse>

      {isFetching && !shouldShowSkeleton && (
        <LinearProgress
          sx={{
            height: '3px',
            bgcolor: 'transparent',
            '& .MuiLinearProgress-bar': {
              bgcolor: 'primary.main',
            },
          }}
        />
      )}

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: 0,
          overflow: 'hidden',
          bgcolor: 'background.paper',
        }}
      >
        <Table sx={{ minWidth }}>
          <TableHead sx={{ bgcolor: 'action.hover' }}>
            <TableRow>
              {columns.map((column) => (
                <AppColumnHeader
                  key={column.id}
                  column={column}
                  sort={activeSort}
                  onSortToggle={handleSortToggle}
                  filterValue={activeFilters[column.id]}
                  onFilterChange={handleFilterChange}
                />
              ))}
            </TableRow>
          </TableHead>

          <TableBody
            sx={{
              opacity: isFetching && !shouldShowSkeleton ? 0.6 : 1,
              transition: 'opacity 0.2s ease',
            }}
          >
            {shouldShowSkeleton ? (
              Array.from({ length: loadingRowsCount }).map((_, rIdx) => (
                <TableRow key={rIdx}>
                  {columns.map((col, cIdx) => (
                    <TableCell
                      key={cIdx}
                      align={col.align || 'left'}
                      sx={{ py: 2 }}
                    >
                      <Skeleton
                        variant="text"
                        width={col.width ? '70%' : '80%'}
                        height={24}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : displayData.length === 0 ? (
              activeFilterEntries.length === 0 && emptyContent ? (
                emptyContent
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    sx={{
                      py: 8,
                      textAlign: 'center',
                    }}
                  >
                    <Stack
                      spacing={1.5}
                      sx={{
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: '999px',
                          bgcolor: 'action.hover',
                          color: 'text.disabled',
                          display: 'inline-flex',
                        }}
                      >
                        {emptyState?.icon || (
                          <InboxRoundedIcon sx={{ fontSize: 44 }} />
                        )}
                      </Box>
                      <Stack spacing={0.5} sx={{ alignItems: 'center' }}>
                        <Typography
                          sx={{
                            fontSize: '16px',
                            fontWeight: 700,
                            color: 'text.primary',
                          }}
                        >
                          {emptyState?.title ||
                            (activeFilterEntries.length > 0
                              ? t('noResultsFound')
                              : t('noData'))}
                        </Typography>
                        {emptyState?.description && (
                          <Typography
                            sx={{
                              fontSize: '13px',
                              color: 'text.secondary',
                              maxWidth: 380,
                            }}
                          >
                            {emptyState.description}
                          </Typography>
                        )}
                      </Stack>

                      {emptyState?.actionLabel && emptyState?.onAction && (
                        <AppButton
                          intent="primary"
                          size="small"
                          onClick={emptyState.onAction}
                        >
                          {emptyState.actionLabel}
                        </AppButton>
                      )}

                      {activeFilterEntries.length > 0 &&
                        !emptyState?.actionLabel && (
                          <AppButton
                            intent="secondary"
                            size="small"
                            startIcon={
                              <FilterAltOffRoundedIcon sx={{ fontSize: 14 }} />
                            }
                            onClick={handleClearAllFilters}
                          >
                            {t('clearFilter')}
                          </AppButton>
                        )}
                    </Stack>
                  </TableCell>
                </TableRow>
              )
            ) : (
              displayData.map((row, index) => {
                const rowKey = defaultKeyExtractor(row, index);
                const itemRecord =
                  typeof row === 'object' && row !== null
                    ? (row as Record<string, unknown>)
                    : null;
                const isSelected = isRowSelected
                  ? isRowSelected(row)
                  : selectedRowId !== undefined &&
                      selectedRowId !== null &&
                      itemRecord &&
                      'id' in itemRecord
                    ? String(itemRecord.id) === String(selectedRowId)
                    : false;

                return (
                  <TableRow
                    key={rowKey}
                    hover
                    onClick={
                      onRowClick
                        ? (e) => {
                            const target = e.target as HTMLElement;
                            if (
                              target.closest(
                                'button, a, input, select, textarea, [role="button"], [role="menuitem"], .MuiIconButton-root, .MuiMenu-root',
                              )
                            ) {
                              return;
                            }
                            onRowClick(row);
                          }
                        : undefined
                    }
                    sx={{
                      cursor: onRowClick ? 'pointer' : 'default',
                      bgcolor: isSelected
                        ? (theme) => alpha(theme.palette.primary.main, 0.08)
                        : 'inherit',
                      '&:hover': {
                        bgcolor: isSelected
                          ? (theme) => alpha(theme.palette.primary.main, 0.12)
                          : 'action.hover',
                      },
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    {columns.map((col) => (
                      <TableCell
                        key={col.id}
                        align={col.align || 'left'}
                        sx={{
                          py: 1.75,
                          fontSize: '13px',
                          color: 'text.primary',
                        }}
                      >
                        {col.renderCell(row, index)}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {pagination && (
        <AppTablePagination
          page={pagination.page}
          pageSize={pagination.pageSize}
          totalCount={pagination.totalCount}
          onPageChange={pagination.onPageChange}
          onPageSizeChange={pagination.onPageSizeChange}
          pageSizeOptions={pagination.pageSizeOptions}
        />
      )}
    </Stack>
  );
};

export default AppTable;
