'use client';

import React from 'react';
import { Box, Chip, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import { useTranslations } from 'next-intl';

import {
  AppActionMenu,
  AppCategoryChip,
  type AppActionMenuItem,
} from '@/base/components/ui';
import { formatCurrency } from '@/base/utils';
import type { ActivityStatus, PlanActivity } from '../types';

export interface ActivityTimelineCardProps {
  activity: PlanActivity;
  currency: string;
  onEdit: (activity: PlanActivity) => void;
  onDelete: (activity: PlanActivity) => void;
  onToggleStatus: (activity: PlanActivity, nextStatus: ActivityStatus) => void;
  onConvertToExpense?: (activity: PlanActivity) => void;
}

const ActivityTimelineCard = ({
  activity,
  currency,
  onEdit,
  onDelete,
  onToggleStatus,
  onConvertToExpense,
}: ActivityTimelineCardProps) => {
  const t = useTranslations('plan');
  const tStatus = useTranslations('plan.statuses');
  const tDialog = useTranslations('plan.dialog');

  const isCompleted = activity.status === 'COMPLETED';

  const timeDisplay =
    activity.startTime && activity.endTime
      ? `${activity.startTime.slice(0, 5)} – ${activity.endTime.slice(0, 5)}`
      : activity.startTime
        ? activity.startTime.slice(0, 5)
        : null;

  const menuItems: AppActionMenuItem[] = [
    {
      id: 'toggle',
      label: isCompleted ? tDialog('markPlanned') : tDialog('markCompleted'),
      icon: isCompleted ? (
        <RadioButtonUncheckedRoundedIcon fontSize="small" />
      ) : (
        <CheckCircleRoundedIcon fontSize="small" />
      ),
      onClick: () =>
        onToggleStatus(activity, isCompleted ? 'PLANNED' : 'COMPLETED'),
    },
    ...(onConvertToExpense && !activity.expenseId
      ? [
          {
            id: 'convert',
            label: tDialog('convertToExpense'),
            icon: <ReceiptLongRoundedIcon fontSize="small" />,
            onClick: () => onConvertToExpense(activity),
          },
        ]
      : []),
    {
      id: 'edit',
      label: tDialog('editTitle'),
      icon: <EditRoundedIcon fontSize="small" />,
      onClick: () => onEdit(activity),
    },
    {
      id: 'delete',
      label: tDialog('confirmDelete'),
      icon: <DeleteOutlineRoundedIcon fontSize="small" />,
      danger: true,
      onClick: () => onDelete(activity),
    },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'stretch',
        gap: { xs: 1.5, sm: 2 },
      }}
    >
      <Box
        sx={{
          width: { xs: '95px', sm: '110px' },
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          pt: { xs: 2, md: 2.75 },
        }}
      >
        {timeDisplay ? (
          <Typography
            sx={{
              fontFamily: 'var(--font-mono)',
              fontSize: { xs: '12px', sm: '13px' },
              fontWeight: 700,
              color: isCompleted ? 'text.secondary' : 'primary.main',
              whiteSpace: 'nowrap',
            }}
          >
            {timeDisplay}
          </Typography>
        ) : (
          <AccessTimeRoundedIcon
            sx={{ fontSize: '18px', color: 'text.disabled' }}
          />
        )}
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flexShrink: 0,
          width: '20px',
          pt: { xs: 2.25, md: 3 },
        }}
      >
        <Box
          sx={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            bgcolor: isCompleted
              ? 'success.main'
              : activity.status === 'IN_PROGRESS'
                ? 'primary.main'
                : 'action.selected',
            border: 2,
            borderColor: 'background.paper',
            boxShadow: (theme) => {
              return `0 0 0 2px ${alpha(theme.palette.primary.main, 0.15)}`;
            },
            flexShrink: 0,
          }}
        />
        <Box
          sx={{
            flexGrow: 1,
            width: '2px',
            bgcolor: 'divider',
            minHeight: '24px',
          }}
        />
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          minWidth: 0,
          p: { xs: 2, md: 3 },
          borderRadius: '16px',
          bgcolor: 'background.paper',
          border: 1,
          borderColor: (theme) => {
            return isCompleted
              ? alpha(theme.palette.success.main, 0.25)
              : (theme.vars?.palette ?? theme.palette).divider;
          },
          boxShadow: (theme) => {
            return `0 2px 6px ${alpha(theme.palette.text.primary, 0.04)}`;
          },
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: (theme) => {
              return `0 6px 18px ${alpha(theme.palette.text.primary, 0.08)}`;
            },
            borderColor: 'primary.light',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0.75,
              minWidth: 0,
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: 'center', flexWrap: 'wrap' }}
            >
              <Typography
                sx={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: isCompleted ? 'text.secondary' : 'text.primary',
                  textDecoration: isCompleted ? 'line-through' : 'none',
                }}
              >
                {activity.title}
              </Typography>

              <AppCategoryChip
                category={activity.category}
                sx={{
                  height: 22,
                  fontSize: '11px',
                }}
              />

              <Chip
                label={tStatus(activity.status)}
                size="small"
                sx={{
                  height: 22,
                  fontSize: '11px',
                  fontWeight: 700,
                  borderRadius: '6px',
                  bgcolor: (theme) => {
                    switch (activity.status) {
                      case 'COMPLETED':
                        return alpha(theme.palette.success.main, 0.12);
                      case 'IN_PROGRESS':
                        return alpha(theme.palette.primary.light, 0.12);
                      case 'SKIPPED':
                        return alpha(theme.palette.text.secondary, 0.12);
                      default:
                        return alpha(theme.palette.secondary.main, 0.12);
                    }
                  },
                  color: (theme) => {
                    const p = theme.vars?.palette ?? theme.palette;
                    switch (activity.status) {
                      case 'COMPLETED':
                        return p.success.main;
                      case 'IN_PROGRESS':
                        return p.primary.light;
                      case 'SKIPPED':
                        return p.text.secondary;
                      default:
                        return p.secondary.dark;
                    }
                  },
                }}
              />

              {activity.expenseId && (
                <Chip
                  icon={
                    <ReceiptLongRoundedIcon
                      sx={{ fontSize: '14px !important' }}
                    />
                  }
                  label={t('spentChip')}
                  size="small"
                  sx={{
                    height: 22,
                    fontSize: '11px',
                    fontWeight: 600,
                    borderRadius: '6px',
                    bgcolor: (theme) => {
                      return alpha(theme.palette.success.main, 0.12);
                    },
                    color: 'success.main',
                  }}
                />
              )}
            </Stack>

            {activity.location && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: 'text.secondary',
                  fontSize: '12px',
                }}
              >
                <PlaceRoundedIcon sx={{ fontSize: '14px', flexShrink: 0 }} />
                <span>{activity.location}</span>
              </Box>
            )}

            {activity.note && (
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontSize: '12px',
                  lineHeight: 1.4,
                }}
              >
                {activity.note}
              </Typography>
            )}

            {activity.estimatedCost > 0 && (
              <Typography
                sx={{
                  fontSize: '12px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  color: 'success.main',
                  pt: 0.25,
                }}
              >
                {t('estimatedCost', {
                  cost: formatCurrency(activity.estimatedCost, currency),
                })}
              </Typography>
            )}
          </Box>

          <AppActionMenu items={menuItems} size="small" />
        </Box>
      </Box>
    </Box>
  );
};

export default ActivityTimelineCard;
