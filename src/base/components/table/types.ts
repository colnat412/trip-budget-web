'use client';

import type React from 'react';

import type { SxProps, Theme } from '@mui/material';

export type ColumnFilterType = 'text' | 'select' | 'date';

export type ColumnFilterValue =
  | string
  | number
  | (string | number)[]
  | null
  | undefined;

export interface ColumnFilterOption {
  label: string;
  value: string | number;
}

export type SortDirection = 'asc' | 'desc';

export interface TableSortState {
  columnId: string;
  direction: SortDirection;
}

export interface AppTableColumn<T> {
  id: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  width?: string | number;
  minWidth?: string | number;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: ColumnFilterType;
  filterOptions?: ColumnFilterOption[];
  filterPlaceholder?: string;
  renderCell: (row: T, index: number) => React.ReactNode;
  getValue?: (row: T) => unknown;
}

export interface AppTablePaginationProps {
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange?: (newPageSize: number) => void;
  pageSizeOptions?: number[];
}

export interface AppTableEmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export interface AppTableProps<T> {
  columns: AppTableColumn<T>[];
  data: T[];
  keyExtractor?: (item: T, index: number) => string | number;
  isLoading?: boolean;
  loadingRowsCount?: number;
  pagination?: AppTablePaginationProps | null;
  emptyState?: AppTableEmptyStateProps;
  emptyContent?: React.ReactNode;
  header?: React.ReactNode;
  selectedRowId?: string | number | null;
  isRowSelected?: (item: T) => boolean;
  onRowClick?: (item: T) => void;
  sort?: TableSortState | null;
  onSortChange?: (sort: TableSortState | null) => void;
  filters?: Record<string, ColumnFilterValue>;
  onFilterChange?: (filters: Record<string, ColumnFilterValue>) => void;
  minWidth?: number | string;
  sx?: SxProps<Theme>;
}
