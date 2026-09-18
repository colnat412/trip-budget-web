'use client';

import { Box, Chip } from '@mui/material';
import { useTranslations } from 'next-intl';
import type { TripStatus } from '../../types';

interface TripStatusChipProps {
  status: TripStatus;
}

type StatusThemeVariant =
  | 'success'
  | 'primary'
  | 'secondary'
  | 'neutral'
  | 'error';

type StatusLabelKey =
  | 'inProgress'
  | 'planning'
  | 'confirmed'
  | 'completed'
  | 'draft'
  | 'archived'
  | 'cancelled';

const STATUS_CONFIG_MAP: Record<
  TripStatus,
  {
    variant: StatusThemeVariant;
    labelKey: StatusLabelKey;
  }
> = {
  IN_PROGRESS: { variant: 'success', labelKey: 'inProgress' },
  PLANNING: { variant: 'primary', labelKey: 'planning' },
  CONFIRMED: { variant: 'primary', labelKey: 'confirmed' },
  COMPLETED: { variant: 'secondary', labelKey: 'completed' },
  DRAFT: { variant: 'neutral', labelKey: 'draft' },
  ARCHIVED: { variant: 'neutral', labelKey: 'archived' },
  CANCELLED: { variant: 'error', labelKey: 'cancelled' },
  DELETED: { variant: 'error', labelKey: 'cancelled' },
};

const TripStatusChip = ({ status }: TripStatusChipProps) => {
  const t = useTranslations('trip');
  const config = STATUS_CONFIG_MAP[status] || STATUS_CONFIG_MAP.DRAFT;
  const label = t(config.labelKey) || status;

  return (
    <Chip
      size="small"
      label={label}
      icon={
        <Box
          sx={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            ml: 0.5,
            bgcolor: (theme) => {
              const palette = theme.vars?.palette ?? theme.palette;
              switch (config.variant) {
                case 'success':
                  return palette.success.main;
                case 'primary':
                  return palette.primary.main;
                case 'secondary':
                  return palette.secondary.dark;
                case 'error':
                  return palette.error.main;
                case 'neutral':
                default:
                  return palette.text.secondary;
              }
            },
          }}
        />
      }
      sx={{
        fontWeight: 700,
        fontSize: '12px',
        borderRadius: '6px',
        border: 'none',
        height: 24,
        bgcolor: (theme) => {
          const palette = theme.vars?.palette ?? theme.palette;
          switch (config.variant) {
            case 'success':
              return palette.success.light
                ? 'rgba(22, 163, 74, 0.12)'
                : 'action.hover';
            case 'primary':
              return 'rgba(30, 58, 138, 0.12)';
            case 'secondary':
              return 'rgba(249, 115, 22, 0.12)';
            case 'error':
              return 'rgba(220, 38, 38, 0.12)';
            case 'neutral':
            default:
              return palette.action.hover;
          }
        },
        color: (theme) => {
          const palette = theme.vars?.palette ?? theme.palette;
          switch (config.variant) {
            case 'success':
              return palette.success.dark;
            case 'primary':
              return palette.primary.main;
            case 'secondary':
              return palette.secondary.dark;
            case 'error':
              return palette.error.main;
            case 'neutral':
            default:
              return palette.text.secondary;
          }
        },
        '& .MuiChip-label': {
          px: 1,
        },
      }}
    />
  );
};

export default TripStatusChip;
