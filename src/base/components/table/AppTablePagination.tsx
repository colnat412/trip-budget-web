'use client';

import React from 'react';
import { Box, Pagination, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import AppSelect from '../ui/AppSelect';
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

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const from = totalCount === 0 ? 0 : page * pageSize + 1;
  const to = Math.min(totalCount, (page + 1) * pageSize);

  const sizeOptions = pageSizeOptions.map((size) => ({
    value: size,
    label: `${size} / trang`,
  }));

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: { xs: 1.25, sm: 2 },
        px: { xs: 1.5, sm: 2 },
        py: 1.25,
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        color: 'text.secondary',
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
            fontSize: '13px',
            fontWeight: 500,
            whiteSpace: 'nowrap',
          }}
        >
          {t('displayedRows', {
            from,
            to,
            count: totalCount,
          })}
        </Typography>

        {onPageSizeChange && (
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
              {t('rowsPerPage')}
            </Typography>
            <AppSelect
              variantType="compact"
              label="Số dòng"
              value={pageSize}
              options={sizeOptions}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
                onPageChange(0);
              }}
              sx={{ minWidth: 95 }}
            />
          </Stack>
        )}
      </Stack>

      <Pagination
        count={totalPages}
        page={page + 1}
        onChange={(_, newPage) => onPageChange(newPage - 1)}
        color="primary"
        shape="rounded"
        size="small"
        showFirstButton
        showLastButton
        sx={{
          '& .MuiPaginationItem-root': {
            fontWeight: 600,
            fontSize: '12.5px',
            borderRadius: '8px',
            minWidth: { xs: 28, sm: 30 },
            height: { xs: 28, sm: 30 },
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

export default AppTablePagination;
