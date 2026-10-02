'use client';

import React from 'react';
import { Box, Pagination, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import { AppSelect } from '@/base/components/ui';

export interface TripGridPaginationProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
  pageSizeOptions?: number[];
}

const DEFAULT_PAGE_SIZE_OPTIONS = [6, 12, 24];

const TripGridPagination = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
}: TripGridPaginationProps) => {
  const t = useTranslations('myTrips');

  const totalPages = Math.max(1, Math.ceil(count / rowsPerPage));
  const from = count === 0 ? 0 : page * rowsPerPage + 1;
  const to = Math.min(count, (page + 1) * rowsPerPage);

  const sizeOptions = pageSizeOptions.map((size) => ({
    value: size,
    label: `${size} ${t('perPageLabel') || '/ trang'}`,
  }));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: { xs: 1.5, sm: 2 },
        p: { xs: 1.5, sm: 2 },
        bgcolor: 'background.paper',
        borderRadius: '14px',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Stack
        direction="row"
        spacing={1.5}
        sx={{
          alignItems: 'center',
          justifyContent: { xs: 'space-between', sm: 'flex-start' },
          width: { xs: '100%', sm: 'auto' },
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontSize: '13px',
            fontWeight: 500,
            whiteSpace: 'nowrap',
          }}
        >
          <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {from} – {to}
          </Box>{' '}
          / {count} {t('tripsUnit') || 'chuyến đi'}
        </Typography>

        <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontSize: '12px',
              fontWeight: 600,
              display: { xs: 'none', md: 'inline' },
              whiteSpace: 'nowrap',
            }}
          >
            {t('pageSizeLabel') || 'Hiển thị:'}
          </Typography>
          <AppSelect
            variantType="compact"
            label="Số lượng"
            value={rowsPerPage}
            options={sizeOptions}
            onChange={(e) => {
              onRowsPerPageChange(Number(e.target.value));
              onPageChange(0);
            }}
            sx={{ minWidth: 105 }}
          />
        </Stack>
      </Stack>

      <Pagination
        count={totalPages}
        page={page + 1}
        onChange={(_, newPage) => onPageChange(newPage - 1)}
        color="primary"
        shape="rounded"
        size="medium"
        showFirstButton
        showLastButton
        sx={{
          '& .MuiPaginationItem-root': {
            fontWeight: 600,
            fontSize: '13px',
            borderRadius: '8px',
            minWidth: { xs: 28, sm: 32 },
            height: { xs: 28, sm: 32 },
            '&.Mui-selected': {
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              fontWeight: 700,
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            },
          },
        }}
      />
    </Box>
  );
};

export default TripGridPagination;
