'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Avatar, Box, Checkbox, Chip, Stack, Typography } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import { useTranslations } from 'next-intl';

import { AppButton, AppNumberInput } from '@/base/components/ui';
import { formatCurrency } from '@/base/utils';
import { getUserInitials } from '@/base/utils/user';
import type { SplitItemPayload, SplitType } from '../types';

export interface SplitMember {
  userId: string | number;
  name?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
}

export interface SplitAllocationSectionProps {
  splitType: SplitType;
  totalAmount: number;
  currency: string;
  members: SplitMember[];
  initialSplits?: SplitItemPayload[];
  onChange: (
    splits: SplitItemPayload[],
    isValid: boolean,
    errorMessage?: string,
  ) => void;
}

interface CustomAllocation {
  selected?: boolean;
  amount?: number;
  splitValue?: number;
}

const SplitAllocationSection = ({
  splitType,
  totalAmount,
  currency,
  members,
  initialSplits = [],
  onChange,
}: SplitAllocationSectionProps) => {
  const t = useTranslations('expense');

  const [customAllocations, setCustomAllocations] = useState<
    Record<string, CustomAllocation>
  >({});

  const memberAllocations = useMemo(() => {
    return members.map((m) => {
      const key = String(m.userId);
      const custom = customAllocations[key];
      const initial = initialSplits.find(
        (s) => String(s.userId) === String(m.userId),
      );

      const isSelected =
        custom?.selected !== undefined ? custom.selected : true;
      const amount =
        custom?.amount !== undefined
          ? custom.amount
          : (initial?.allocatedAmount ?? 0);
      const splitValue =
        custom?.splitValue !== undefined
          ? custom.splitValue
          : (initial?.splitValue ?? (splitType === 'PERCENTAGE' ? 0 : 1));

      return {
        member: m,
        selected: isSelected,
        amount,
        splitValue,
      };
    });
  }, [members, customAllocations, initialSplits, splitType]);

  const selectedMembers = useMemo(
    () => memberAllocations.filter((s) => s.selected),
    [memberAllocations],
  );
  const selectedCount = selectedMembers.length;

  const { allocatedSum, remaining, isValid, errorMessage, generatedSplits } =
    useMemo(() => {
      if (selectedCount === 0) {
        return {
          allocatedSum: 0,
          remaining: totalAmount,
          isValid: false,
          errorMessage: t('form.errors.splitErrorNoMembers'),
          generatedSplits: [],
        };
      }

      if (splitType === 'EQUAL') {
        const baseShare = Math.floor((totalAmount / selectedCount) * 100) / 100;
        const splits: SplitItemPayload[] = selectedMembers.map((m) => ({
          userId: m.member.userId,
          allocatedAmount: baseShare,
          splitValue: 1,
        }));

        return {
          allocatedSum: totalAmount,
          remaining: 0,
          isValid: true,
          generatedSplits: splits,
        };
      }

      if (splitType === 'EXACT_AMOUNT') {
        const sum = selectedMembers.reduce(
          (acc, m) => acc + (m.amount || 0),
          0,
        );
        const rem = totalAmount - sum;
        const valid = Math.abs(rem) < 0.01;

        const splits: SplitItemPayload[] = selectedMembers.map((m) => ({
          userId: m.member.userId,
          allocatedAmount: m.amount || 0,
          splitValue: m.amount || 0,
        }));

        return {
          allocatedSum: sum,
          remaining: rem,
          isValid: valid,
          errorMessage: valid
            ? undefined
            : t('form.errors.splitErrorExact', {
                sum: formatCurrency(sum, currency),
                total: formatCurrency(totalAmount, currency),
              }),
          generatedSplits: splits,
        };
      }

      if (splitType === 'PERCENTAGE') {
        const sumPct = selectedMembers.reduce(
          (acc, m) => acc + (m.splitValue || 0),
          0,
        );
        const remPct = 100 - sumPct;
        const valid = Math.abs(remPct) < 0.01;

        const splits: SplitItemPayload[] = selectedMembers.map((m) => {
          const pct = m.splitValue || 0;
          const allocated = Math.floor(((totalAmount * pct) / 100) * 100) / 100;
          return {
            userId: m.member.userId,
            splitValue: pct,
            allocatedAmount: allocated,
          };
        });

        return {
          allocatedSum: sumPct,
          remaining: remPct,
          isValid: valid,
          errorMessage: valid
            ? undefined
            : t('form.errors.splitErrorPercent', { sum: String(sumPct) }),
          generatedSplits: splits,
        };
      }

      if (splitType === 'SHARE') {
        const totalShares = selectedMembers.reduce(
          (acc, m) => acc + (m.splitValue > 0 ? m.splitValue : 0),
          0,
        );
        const hasInvalidShare = selectedMembers.some((m) => m.splitValue <= 0);

        const splits: SplitItemPayload[] = selectedMembers.map((m) => {
          const share = m.splitValue > 0 ? m.splitValue : 1;
          const allocated =
            totalShares > 0
              ? Math.floor(((totalAmount * share) / totalShares) * 100) / 100
              : 0;
          return {
            userId: m.member.userId,
            splitValue: share,
            allocatedAmount: allocated,
          };
        });

        return {
          allocatedSum: totalShares,
          remaining: 0,
          isValid: !hasInvalidShare && totalShares > 0,
          errorMessage: hasInvalidShare
            ? t('form.errors.splitErrorPositiveShare')
            : undefined,
          generatedSplits: splits,
        };
      }

      return {
        allocatedSum: 0,
        remaining: 0,
        isValid: true,
        generatedSplits: [],
      };
    }, [selectedCount, selectedMembers, splitType, totalAmount, currency, t]);

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const prevPayloadRef = useRef<string>('');

  useEffect(() => {
    const payload = JSON.stringify({
      splits: generatedSplits,
      isValid,
      errorMessage,
    });
    if (payload !== prevPayloadRef.current) {
      prevPayloadRef.current = payload;
      onChangeRef.current?.(generatedSplits, isValid, errorMessage);
    }
  }, [generatedSplits, isValid, errorMessage]);

  // Toggle checkbox chọn thành viên
  const handleToggleMember = (userId: string | number) => {
    const key = String(userId);
    setCustomAllocations((prev) => {
      const current = memberAllocations.find(
        (m) => String(m.member.userId) === key,
      );
      const currentSelected = current?.selected ?? true;
      return {
        ...prev,
        [key]: {
          ...prev[key],
          selected: !currentSelected,
        },
      };
    });
  };

  const handleAmountChange = (
    userId: string | number,
    value: number | undefined,
  ) => {
    const key = String(userId);
    setCustomAllocations((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        amount: value ?? 0,
      },
    }));
  };

  const handleSplitValueChange = (
    userId: string | number,
    value: number | undefined,
  ) => {
    const key = String(userId);
    setCustomAllocations((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        splitValue: value ?? 0,
      },
    }));
  };

  const handleAutoFillRemaining = (targetUserId: string | number) => {
    const key = String(targetUserId);
    if (splitType === 'EXACT_AMOUNT') {
      setCustomAllocations((prev) => {
        const current = memberAllocations.find(
          (m) => String(m.member.userId) === key,
        );
        const currentAmount = current?.amount ?? 0;
        return {
          ...prev,
          [key]: {
            ...prev[key],
            amount: Math.max(0, currentAmount + remaining),
          },
        };
      });
    } else if (splitType === 'PERCENTAGE') {
      setCustomAllocations((prev) => {
        const current = memberAllocations.find(
          (m) => String(m.member.userId) === key,
        );
        const currentPct = current?.splitValue ?? 0;
        return {
          ...prev,
          [key]: {
            ...prev[key],
            splitValue: Math.max(0, currentPct + remaining),
          },
        };
      });
    }
  };

  if (members.length === 0) {
    return null;
  }

  return (
    <Stack spacing={1.5} sx={{ mt: 1 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        sx={{
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
        }}
      >
        <Typography
          variant="caption"
          sx={{ fontWeight: 700, color: 'text.secondary' }}
        >
          {t('form.splitsTitle')} ({selectedCount}/{members.length})
        </Typography>

        {splitType === 'EXACT_AMOUNT' && (
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Chip
              size="small"
              icon={
                isValid ? (
                  <CheckCircleRoundedIcon sx={{ fontSize: 15 }} />
                ) : (
                  <WarningAmberRoundedIcon sx={{ fontSize: 15 }} />
                )
              }
              label={
                isValid
                  ? t('form.exactMatch')
                  : `${t('form.remainingToAllocate')}: ${formatCurrency(remaining, currency)}`
              }
              color={isValid ? 'success' : 'warning'}
              sx={{ fontWeight: 600, fontSize: '11px' }}
            />
          </Stack>
        )}

        {splitType === 'PERCENTAGE' && (
          <Chip
            size="small"
            icon={
              isValid ? (
                <CheckCircleRoundedIcon sx={{ fontSize: 15 }} />
              ) : (
                <WarningAmberRoundedIcon sx={{ fontSize: 15 }} />
              )
            }
            label={
              isValid
                ? '100%'
                : `${t('form.allocatedTotal')}: ${allocatedSum}% (${t('form.remainingToAllocate')}: ${remaining}%)`
            }
            color={isValid ? 'success' : 'warning'}
            sx={{ fontWeight: 600, fontSize: '11px' }}
          />
        )}

        {splitType === 'SHARE' && (
          <Chip
            size="small"
            label={`${t('form.allocatedTotal')}: ${allocatedSum} ${t('form.sharesUnit')}`}
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 600, fontSize: '11px' }}
          />
        )}
      </Stack>

      <Stack
        spacing={1}
        sx={{
          bgcolor: 'action.hover',
          borderRadius: '12px',
          p: 1.5,
          border: 1,
          borderColor: isValid ? 'divider' : 'warning.light',
        }}
      >
        {memberAllocations.map(({ member, selected, amount, splitValue }) => (
          <Stack
            key={String(member.userId)}
            direction="row"
            spacing={1}
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
              bgcolor: selected ? 'background.paper' : 'transparent',
              p: 1,
              borderRadius: '8px',
              border: 1,
              borderColor: selected ? 'divider' : 'transparent',
              opacity: selected ? 1 : 0.6,
              transition: 'all 0.15s ease',
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: 'center', minWidth: 0 }}
            >
              <Checkbox
                size="small"
                checked={selected}
                onChange={() => handleToggleMember(member.userId)}
                sx={{ p: 0.5 }}
              />
              <Avatar
                src={member.avatarUrl || undefined}
                sx={{
                  width: 28,
                  height: 28,
                  fontSize: '12px',
                  bgcolor: 'primary.light',
                }}
              >
                {getUserInitials(member.name || member.email)}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    fontSize: '13px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {member.name || member.email || String(member.userId)}
                </Typography>
                {member.email && member.name && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      fontSize: '11px',
                      display: 'block',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {member.email}
                  </Typography>
                )}
              </Box>
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: 'center', flexShrink: 0 }}
            >
              {splitType === 'EQUAL' && selected && (
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                    fontSize: '13px',
                  }}
                >
                  {formatCurrency(
                    selectedCount > 0 ? totalAmount / selectedCount : 0,
                    currency,
                  )}
                </Typography>
              )}

              {splitType === 'EXACT_AMOUNT' && (
                <Stack
                  direction="row"
                  spacing={0.5}
                  sx={{ alignItems: 'center' }}
                >
                  <Box sx={{ width: 130 }}>
                    <AppNumberInput
                      size="small"
                      disabled={!selected}
                      value={amount}
                      currencySuffix={currency}
                      onValueChange={(val) =>
                        handleAmountChange(member.userId, val)
                      }
                      slotProps={{
                        htmlInput: {
                          style: {
                            textAlign: 'right',
                            fontSize: '12px',
                            padding: '4px 8px',
                          },
                        },
                      }}
                    />
                  </Box>
                  {selected && Math.abs(remaining) > 0 && (
                    <AppButton
                      size="small"
                      intent="secondary"
                      title={t('form.autoFillRemaining')}
                      onClick={() => handleAutoFillRemaining(member.userId)}
                      sx={{ minWidth: 28, px: 0.5, py: 0.5, height: 28 }}
                    >
                      <AutoFixHighRoundedIcon sx={{ fontSize: 14 }} />
                    </AppButton>
                  )}
                </Stack>
              )}

              {splitType === 'PERCENTAGE' && (
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: 'center' }}
                >
                  <Box sx={{ width: 85 }}>
                    <AppNumberInput
                      size="small"
                      disabled={!selected}
                      value={splitValue}
                      currencySuffix="%"
                      onValueChange={(val) =>
                        handleSplitValueChange(member.userId, val)
                      }
                      slotProps={{
                        htmlInput: {
                          style: {
                            textAlign: 'right',
                            fontSize: '12px',
                            padding: '4px 8px',
                          },
                        },
                      }}
                    />
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      width: 75,
                      textAlign: 'right',
                      color: 'text.secondary',
                      fontWeight: 500,
                    }}
                  >
                    {formatCurrency(
                      totalAmount * ((splitValue || 0) / 100),
                      currency,
                    )}
                  </Typography>
                </Stack>
              )}

              {splitType === 'SHARE' && (
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: 'center' }}
                >
                  <Box sx={{ width: 85 }}>
                    <AppNumberInput
                      size="small"
                      disabled={!selected}
                      value={splitValue}
                      currencySuffix={t('form.sharesUnit')}
                      onValueChange={(val) =>
                        handleSplitValueChange(member.userId, val)
                      }
                      slotProps={{
                        htmlInput: {
                          style: {
                            textAlign: 'right',
                            fontSize: '12px',
                            padding: '4px 8px',
                          },
                        },
                      }}
                    />
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      width: 75,
                      textAlign: 'right',
                      color: 'text.secondary',
                      fontWeight: 500,
                    }}
                  >
                    {formatCurrency(
                      allocatedSum > 0
                        ? totalAmount * ((splitValue || 0) / allocatedSum)
                        : 0,
                      currency,
                    )}
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Stack>
        ))}
      </Stack>

      {errorMessage && (
        <Typography
          variant="caption"
          sx={{ color: 'error.main', fontWeight: 500 }}
        >
          {errorMessage}
        </Typography>
      )}
    </Stack>
  );
};

export default SplitAllocationSection;
