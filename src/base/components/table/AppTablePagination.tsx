'use client';

import React from 'react';
import { TablePagination } from '@mui/material';
import { useTranslations } from 'next-intl';
import type { AppTablePaginationProps } from './types';

const AppTablePagination = ({
  page,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
}: AppTablePaginationProps) => {
  const t = useTranslations('table');

  return (
    <TablePagination
      component="div"
      count={totalCount}
      page={page}
      rowsPerPage={pageSize}
      rowsPerPageOptions={pageSizeOptions}
      onPageChange={(_, newPage) => onPageChange(newPage)}
      onRowsPerPageChange={
        onPageSizeChange
          ? (e) => onPageSizeChange(parseInt(e.target.value, 10))
          : undefined
      }
      labelRowsPerPage={t('rowsPerPage')}
      labelDisplayedRows={({ from, to, count }) =>
        t('displayedRows', {
          from,
          to,
          count: count !== -1 ? count : `>${to}`,
        })
      }
      sx={{
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        color: 'text.secondary',
        '.MuiTablePagination-select': {
          fontSize: '13px',
          fontWeight: 600,
        },
        '.MuiTablePagination-displayedRows': {
          fontSize: '13px',
          fontWeight: 600,
          fontFamily: 'var(--font-mono)',
        },
      }}
    />
  );
};

export default AppTablePagination;
