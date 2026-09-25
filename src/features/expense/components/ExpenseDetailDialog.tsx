'use client';

import React from 'react';
import { Box, Typography, Stack, Avatar, Chip } from '@mui/material';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import HourglassEmptyRoundedIcon from '@mui/icons-material/HourglassEmptyRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import NotesRoundedIcon from '@mui/icons-material/NotesRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import { useTranslations } from 'next-intl';
import { AppDialog, AppButton, AppCategoryChip } from '@/base/components/ui';
import { formatCurrency, formatDate } from '@/base/utils';
import type { Expense } from '../types';

export interface ExpenseDetailDialogProps {
  open: boolean;
  expense: Expense | null;
  onClose: () => void;
  onEdit?: (expense: Expense) => void;
  readOnly?: boolean;
}

const ExpenseDetailDialog = ({
  open,
  expense,
  onClose,
  onEdit,
  readOnly = false,
}: ExpenseDetailDialogProps) => {
  const t = useTranslations('expense');

  if (!expense) return null;

  const splitSummary =
    expense.splitType in { EQUAL: 1, EXACT_AMOUNT: 1, PERCENTAGE: 1, SHARE: 1 }
      ? t(
          `splits.${expense.splitType as 'EQUAL' | 'EXACT_AMOUNT' | 'PERCENTAGE' | 'SHARE'}`,
        )
      : t('splits.EQUAL');

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={t('dialog.detailTitle')}
      icon={<ReceiptLongRoundedIcon color="primary" />}
      maxWidth="sm"
      actions={
        <Stack
          direction="row"
          spacing={1.5}
          sx={{ width: '100%', justifyContent: 'flex-end' }}
        >
          <AppButton intent="secondary" onClick={onClose}>
            {t('dialog.close')}
          </AppButton>
          {onEdit && !readOnly && (
            <AppButton
              intent="primary"
              startIcon={<EditRoundedIcon fontSize="small" />}
              onClick={() => {
                onClose();
                onEdit(expense);
              }}
            >
              {t('row.edit')}
            </AppButton>
          )}
        </Stack>
      }
    >
      <Stack spacing={2.5}>
        <Box
          sx={{
            p: 2.5,
            borderRadius: '14px',
            bgcolor: 'action.hover',
            border: 1,
            borderColor: 'divider',
          }}
        >
          <Stack
            direction="row"
            sx={{
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 1.5,
              mb: 1.5,
            }}
          >
            <Stack spacing={0.5}>
              <Typography
                sx={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: 'text.primary',
                }}
              >
                {expense.title}
              </Typography>
              <Typography
                sx={{
                  fontSize: '13px',
                  color: 'text.secondary',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {formatDate(expense.expenseDate, 'DD/MM/YYYY')}
              </Typography>
            </Stack>
            <AppCategoryChip category={expense.category} />
          </Stack>

          <Stack
            direction="row"
            sx={{
              justifyContent: 'space-between',
              alignItems: 'baseline',
              pt: 1,
              borderTop: 1,
              borderColor: 'divider',
            }}
          >
            <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
              {t('table.colAmount')}
            </Typography>
            <Typography
              sx={{
                fontSize: '22px',
                fontWeight: 800,
                color: 'primary.main',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {formatCurrency(expense.amount, expense.currency)}
            </Typography>
          </Stack>
        </Box>

        <Stack spacing={1}>
          <Typography
            sx={{
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'text.secondary',
            }}
          >
            {t('dialog.paidBy')}
          </Typography>
          <Box
            sx={{
              p: 1.75,
              borderRadius: '12px',
              border: 1,
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1.5,
            }}
          >
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <Avatar
                src={expense.payerAvatarUrl || undefined}
                alt={expense.payerName || 'Payer'}
                sx={{
                  width: 36,
                  height: 36,
                  fontWeight: 700,
                  fontSize: '14px',
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                }}
              >
                {expense.payerName
                  ? expense.payerName.charAt(0).toUpperCase()
                  : 'U'}
              </Avatar>
              <Stack spacing={0.25}>
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'text.primary',
                  }}
                >
                  {expense.payerName || '—'}
                </Typography>
                {expense.payerEmail && (
                  <Typography
                    sx={{ fontSize: '12px', color: 'text.secondary' }}
                  >
                    {expense.payerEmail}
                  </Typography>
                )}
              </Stack>
            </Stack>
            <Chip
              label={t('dialog.paidFullAmount', {
                amount: formatCurrency(expense.amount, expense.currency),
              })}
              size="small"
              sx={{
                bgcolor: 'success.light',
                color: 'success.dark',
                fontWeight: 600,
                fontSize: '12px',
              }}
            />
          </Box>
        </Stack>

        <Stack spacing={1.25}>
          <Stack
            direction="row"
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'text.secondary',
              }}
            >
              {t('dialog.splitBreakdown', {
                count: expense.splits?.length || 0,
              })}
            </Typography>
            <Chip
              label={splitSummary}
              size="small"
              variant="outlined"
              sx={{ fontSize: '12px', fontWeight: 600 }}
            />
          </Stack>

          <Stack
            spacing={1}
            sx={{
              p: 1,
              borderRadius: '12px',
              border: 1,
              borderColor: 'divider',
              maxHeight: 220,
              overflowY: 'auto',
            }}
          >
            {expense.splits && expense.splits.length > 0 ? (
              expense.splits.map((split) => {
                const percent =
                  expense.amount > 0
                    ? `${Math.round((split.allocatedAmount / expense.amount) * 100)}%`
                    : '0%';

                return (
                  <Box
                    key={split.id}
                    sx={{
                      p: 1.25,
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1.5,
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1.25}
                      sx={{ alignItems: 'center' }}
                    >
                      <Avatar
                        src={split.userAvatarUrl || undefined}
                        alt={split.userName || 'Member'}
                        sx={{
                          width: 30,
                          height: 30,
                          fontSize: '13px',
                          fontWeight: 600,
                          bgcolor: 'secondary.main',
                          color: 'secondary.contrastText',
                        }}
                      >
                        {split.userName
                          ? split.userName.charAt(0).toUpperCase()
                          : 'M'}
                      </Avatar>
                      <Stack spacing={0}>
                        <Typography
                          sx={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: 'text.primary',
                          }}
                        >
                          {split.userName || `User #${split.userId}`}
                        </Typography>
                        {split.userEmail && (
                          <Typography
                            sx={{ fontSize: '11px', color: 'text.secondary' }}
                          >
                            {split.userEmail}
                          </Typography>
                        )}
                      </Stack>
                    </Stack>

                    <Stack
                      direction="row"
                      spacing={1.5}
                      sx={{ alignItems: 'center' }}
                    >
                      <Stack spacing={0} sx={{ textAlign: 'right' }}>
                        <Typography
                          sx={{
                            fontSize: '13px',
                            fontWeight: 700,
                            fontFamily: 'var(--font-mono)',
                            color: 'text.primary',
                          }}
                        >
                          {formatCurrency(
                            split.allocatedAmount,
                            expense.currency,
                          )}
                        </Typography>
                        <Typography
                          sx={{ fontSize: '11px', color: 'text.secondary' }}
                        >
                          {percent}
                        </Typography>
                      </Stack>

                      {split.settled ? (
                        <Chip
                          icon={
                            <CheckCircleRoundedIcon
                              sx={{ fontSize: '14px !important' }}
                            />
                          }
                          label={t('dialog.settled')}
                          size="small"
                          sx={{
                            bgcolor: 'success.light',
                            color: 'success.dark',
                            fontWeight: 600,
                            fontSize: '11px',
                            height: 24,
                          }}
                        />
                      ) : (
                        <Chip
                          icon={
                            <HourglassEmptyRoundedIcon
                              sx={{ fontSize: '14px !important' }}
                            />
                          }
                          label={t('dialog.pending')}
                          size="small"
                          sx={{
                            bgcolor: 'warning.light',
                            color: 'warning.dark',
                            fontWeight: 600,
                            fontSize: '11px',
                            height: 24,
                          }}
                        />
                      )}
                    </Stack>
                  </Box>
                );
              })
            ) : (
              <Typography
                sx={{
                  py: 2,
                  textAlign: 'center',
                  fontSize: '13px',
                  color: 'text.secondary',
                }}
              >
                —
              </Typography>
            )}
          </Stack>
        </Stack>

        {expense.note && (
          <Stack spacing={0.75}>
            <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
              <NotesRoundedIcon
                sx={{ fontSize: 16, color: 'text.secondary' }}
              />
              <Typography
                sx={{
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'text.secondary',
                }}
              >
                {t('dialog.note')}
              </Typography>
            </Stack>
            <Box
              sx={{
                p: 1.5,
                borderRadius: '10px',
                bgcolor: 'action.hover',
                border: 1,
                borderColor: 'divider',
              }}
            >
              <Typography
                sx={{
                  fontSize: '13px',
                  color: 'text.primary',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {expense.note}
              </Typography>
            </Box>
          </Stack>
        )}

        {expense.receiptUrl && (
          <Stack spacing={0.75}>
            <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'text.secondary',
              }}
            >
              {t('dialog.receipt')}
            </Typography>
            <Box
              component="a"
              href={expense.receiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.75,
                fontSize: '13px',
                color: 'primary.main',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              <OpenInNewRoundedIcon sx={{ fontSize: 16 }} />
              {expense.receiptUrl}
            </Box>
          </Stack>
        )}
      </Stack>
    </AppDialog>
  );
};

export default ExpenseDetailDialog;
