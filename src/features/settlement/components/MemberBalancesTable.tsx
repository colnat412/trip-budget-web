'use client';

import React from 'react';
import {
  Avatar,
  Box,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useTranslations } from 'next-intl';

import { AppCard } from '@/base/components/ui';
import { formatCurrency, getUserInitials } from '@/base/utils';
import type { MemberBalance } from '../types';

export interface MemberBalancesTableProps {
  memberBalances: MemberBalance[];
  currency: string;
}

const MemberBalancesTable = ({
  memberBalances,
  currency,
}: MemberBalancesTableProps) => {
  const t = useTranslations('settlement');

  return (
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
          {t('memberBalancesTitle')} ({memberBalances.length})
        </Typography>
      </Box>

      <TableContainer>
        <Table sx={{ minWidth: 600 }}>
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
                {t('member')}
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
                {t('paid')}
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
                {t('owed')}
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
                {t('netBalance')}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  py: 1.5,
                  px: 2.5,
                  fontSize: '12px',
                  fontWeight: 700,
                  color: 'text.secondary',
                  textTransform: 'uppercase',
                }}
              >
                {t('status')}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {memberBalances.map((m) => {
              const isOwed = m.status === 'OWED';
              const isOwes = m.status === 'OWES';

              const balanceColor = isOwed
                ? 'success.main'
                : isOwes
                  ? 'error.main'
                  : 'text.secondary';

              return (
                <TableRow
                  key={m.userId}
                  hover
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <TableCell sx={{ py: 2, px: 2.5 }}>
                    <Stack
                      direction="row"
                      spacing={1.5}
                      sx={{ alignItems: 'center' }}
                    >
                      <Avatar
                        src={m.avatarUrl || undefined}
                        sx={{
                          width: 36,
                          height: 36,
                          fontSize: '13px',
                          fontWeight: 700,
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                        }}
                      >
                        {getUserInitials(m.name || 'Member')}
                      </Avatar>
                      <Box>
                        <Typography
                          sx={{
                            fontSize: '14px',
                            fontWeight: 700,
                            color: 'text.primary',
                            lineHeight: 1.2,
                          }}
                        >
                          {m.name || t('defaultMember')}
                        </Typography>
                        {m.email && (
                          <Typography
                            sx={{ fontSize: '12px', color: 'text.secondary' }}
                          >
                            {m.email}
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                  </TableCell>

                  <TableCell align="right" sx={{ py: 2, px: 2 }}>
                    <Typography
                      sx={{ fontSize: '13px', fontFamily: 'var(--font-mono)' }}
                    >
                      {formatCurrency(m.totalPaid, currency)}
                    </Typography>
                  </TableCell>

                  <TableCell align="right" sx={{ py: 2, px: 2 }}>
                    <Typography
                      sx={{ fontSize: '13px', fontFamily: 'var(--font-mono)' }}
                    >
                      {formatCurrency(m.totalOwed, currency)}
                    </Typography>
                  </TableCell>

                  <TableCell align="right" sx={{ py: 2, px: 2 }}>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)',
                        color: balanceColor,
                      }}
                    >
                      {m.netBalance > 0
                        ? `+${formatCurrency(m.netBalance, currency)}`
                        : formatCurrency(m.netBalance, currency)}
                    </Typography>
                  </TableCell>

                  <TableCell align="center" sx={{ py: 2, px: 2.5 }}>
                    <Chip
                      size="small"
                      label={
                        isOwed
                          ? t('statusOwed')
                          : isOwes
                            ? t('statusOwes')
                            : t('statusSettled')
                      }
                      sx={{
                        fontWeight: 700,
                        fontSize: '11px',
                        borderRadius: '999px',
                        bgcolor: isOwed
                          ? 'success.light'
                          : isOwes
                            ? 'error.light'
                            : 'action.hover',
                        color: isOwed
                          ? 'success.dark'
                          : isOwes
                            ? 'error.dark'
                            : 'text.secondary',
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </AppCard>
  );
};

export default MemberBalancesTable;
