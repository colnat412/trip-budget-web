'use client';

import { Box, Chip } from '@mui/material';
import { alpha } from '@mui/material/styles';
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
  | 'archived'
  | 'cancelled'
  | 'draft';

interface StatusConfig {
  variant: StatusThemeVariant;
  labelKey: StatusLabelKey;
}

const STATUS_CONFIG_MAP: Record<TripStatus, StatusConfig> = {
  IN_PROGRESS: { variant: 'success', labelKey: 'inProgress' },
  PLANNING: { variant: 'primary', labelKey: 'planning' },
  CONFIRMED: { variant: 'primary', labelKey: 'confirmed' },
  COMPLETED: { variant: 'secondary', labelKey: 'completed' },
  ARCHIVED: { variant: 'neutral', labelKey: 'archived' },
  CANCELLED: { variant: 'error', labelKey: 'cancelled' },
  DELETED: { variant: 'error', labelKey: 'cancelled' },
  DRAFT: { variant: 'neutral', labelKey: 'draft' },
};

const TripStatusChip = ({ status }: TripStatusChipProps) => {
  const t = useTranslations('trip');
  const config = STATUS_CONFIG_MAP[status] ?? {
    variant: 'neutral' as StatusThemeVariant,
    labelKey: 'draft' as StatusLabelKey,
  };

  return (
    <Chip
      size="small"
      label={t(config.labelKey)}
      icon={
        <Box
          component="span"
          sx={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            ml: '6px !important',
            mr: '-2px !important',
            bgcolor: (theme) => {
              const palette = theme.vars?.palette ?? theme.palette;
              switch (config.variant) {
                case 'success':
                  return palette.success.main;
                case 'primary':
                  return palette.primary.main;
                case 'secondary':
                  return palette.secondary.main;
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
          switch (config.variant) {
            case 'success':
              return alpha(theme.palette.success.main, 0.12);
            case 'primary':
              return alpha(theme.palette.primary.main, 0.12);
            case 'secondary':
              return alpha(theme.palette.secondary.main, 0.12);
            case 'error':
              return alpha(theme.palette.error.main, 0.12);
            case 'neutral':
            default:
              return (theme.vars?.palette ?? theme.palette).action.hover;
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
