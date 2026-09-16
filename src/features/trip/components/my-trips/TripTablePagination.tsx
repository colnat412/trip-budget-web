'use client';

import { Box, TablePagination } from '@mui/material';
import { useTranslations } from 'next-intl';

interface TripTablePaginationProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
}

const TripTablePagination = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: TripTablePaginationProps) => {
  const t = useTranslations('myTrips');

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        p: 1.5,
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <TablePagination
        component="div"
        count={count}
        page={page}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          onRowsPerPageChange(parseInt(e.target.value, 10));
          onPageChange(0);
        }}
        rowsPerPageOptions={[5, 10, 20]}
        labelRowsPerPage={t('rowsPerPage')}
        sx={{
          '.MuiTablePagination-toolbar': {
            minHeight: 48,
            pl: 1,
          },
          '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows':
            {
              fontSize: '13px',
              color: 'text.secondary',
            },
        }}
      />
    </Box>
  );
};

export default TripTablePagination;
