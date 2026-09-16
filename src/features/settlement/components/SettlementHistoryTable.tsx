'use client';

import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import { useTranslations } from 'next-intl';

import { AppCard, AppConfirmDialog } from '@/base/components/ui';
import { formatCurrency, formatDate, getUserInitials } from '@/base/utils';
import type { Settlement } from '../types';

export interface SettlementHistoryTableProps {
  settlements: Settlement[];
  onDelete?: (settlement: Settlement) => void;
}

export default function SettlementHistoryTable({
  settlements,
  onDelete,
}: SettlementHistoryTableProps) {
  const t = useTranslations('settlement');
  const [selectedSettlement, setSelectedSettlement] =
    useState<Settlement | null>(null);

  if (settlements.length === 0) {
    return (
      <AppCard
        sx={{
          p: 3,
          borderRadius: '20px',
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          textAlign: 'center',
        }}
      >
        <Stack spacing={1} sx={{ alignItems: 'center', py: 2 }}>
          <HistoryRoundedIcon sx={{ fontSize: 36, color: 'text.disabled' }} />
          <Typography
            sx={{ fontSize: '14px', fontWeight: 600, color: 'text.secondary' }}
          >
            {t('historyEmpty')}
          </Typography>
        </Stack>
      </AppCard>
    );
  }

  return (
    <>
      <AppCard
        sx={{
          borderRadius: '20px',
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography
            sx={{ fontSize: '16px', fontWeight: 700, color: 'text.primary' }}
          >
            {t('historyTitle')} ({settlements.length})
          </Typography>
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: 'action.hover' }}>
                <TableCell
                  sx={{
                    py: 1.5,
                    px: 2.5,
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                  }}
                >
                  {t('date')}
                </TableCell>
                <TableCell
                  sx={{
                    py: 1.5,
                    px: 2,
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                  }}
                >
                  {t('payer')}
                </TableCell>
                <TableCell
                  sx={{
                    py: 1.5,
                    px: 2,
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                  }}
                >
                  {t('payee')}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    py: 1.5,
                    px: 2,
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                  }}
                >
                  {t('amount')}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    py: 1.5,
                    px: 2,
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                  }}
                >
                  {t('method')}
                </TableCell>
                <TableCell
                  sx={{
                    py: 1.5,
                    px: 2,
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                  }}
                >
                  {t('note')}
                </TableCell>
                {onDelete && (
                  <TableCell
                    align="right"
                    sx={{ py: 1.5, px: 2.5, width: 60 }}
                  />
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {settlements.map((s) => (
                <TableRow
                  key={s.id}
                  hover
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <TableCell sx={{ py: 1.75, px: 2.5 }}>
                    <Typography
                      sx={{
                        fontSize: '13px',
                        color: 'text.secondary',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {formatDate(s.settledAt, 'DD/MM/YYYY')}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ py: 1.75, px: 2 }}>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ alignItems: 'center' }}
                    >
                      <Avatar
                        src={s.payerAvatarUrl || undefined}
                        sx={{
                          width: 28,
                          height: 28,
                          fontSize: '11px',
                          fontWeight: 700,
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                        }}
                      >
                        {getUserInitials(s.payerName || 'Member')}
                      </Avatar>
                      <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>
                        {s.payerName || '—'}
                      </Typography>
                    </Stack>
                  </TableCell>

                  <TableCell sx={{ py: 1.75, px: 2 }}>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ alignItems: 'center' }}
                    >
                      <Avatar
                        src={s.payeeAvatarUrl || undefined}
                        sx={{
                          width: 28,
                          height: 28,
                          fontSize: '11px',
                          fontWeight: 700,
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                        }}
                      >
                        {getUserInitials(s.payeeName || 'Member')}
                      </Avatar>
                      <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>
                        {s.payeeName || '—'}
                      </Typography>
                    </Stack>
                  </TableCell>

                  <TableCell align="right" sx={{ py: 1.75, px: 2 }}>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: 'success.main',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {formatCurrency(s.amount, s.currency)}
                    </Typography>
                  </TableCell>

                  <TableCell align="center" sx={{ py: 1.75, px: 2 }}>
                    <Chip
                      size="small"
                      label={
                        s.paymentMethod === 'BANK_TRANSFER'
                          ? t('methodBank')
                          : s.paymentMethod === 'CASH'
                            ? t('methodCash')
                            : t('methodOther')
                      }
                      sx={{
                        fontSize: '11px',
                        fontWeight: 600,
                        height: 22,
                        bgcolor: 'action.hover',
                        color: 'text.secondary',
                      }}
                    />
                  </TableCell>

                  <TableCell sx={{ py: 1.75, px: 2 }}>
                    <Typography
                      sx={{ fontSize: '13px', color: 'text.secondary' }}
                    >
                      {s.note || '—'}
                    </Typography>
                  </TableCell>

                  {onDelete && (
                    <TableCell align="right" sx={{ py: 1.75, px: 2.5 }}>
                      <Tooltip title={t('deleteConfirm.title')}>
                        <IconButton
                          size="small"
                          onClick={() => setSelectedSettlement(s)}
                          sx={{
                            color: 'text.secondary',
                            '&:hover': { color: 'error.main' },
                          }}
                        >
                          <DeleteOutlineRoundedIcon sx={{ fontSize: '18px' }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </AppCard>

      {selectedSettlement && (
        <AppConfirmDialog
          open={Boolean(selectedSettlement)}
          title={t('deleteConfirm.title')}
          description={t('deleteConfirm.desc')}
          confirmText={t('deleteConfirm.confirmBtn')}
          cancelText={t('deleteConfirm.cancelBtn')}
          intent="danger"
          onConfirm={() => {
            if (selectedSettlement && onDelete) {
              onDelete(selectedSettlement);
            }
            setSelectedSettlement(null);
          }}
          onClose={() => setSelectedSettlement(null)}
        />
      )}
    </>
  );
}
