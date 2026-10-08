'use client';

import { Box } from '@mui/material';
import { alpha, type Theme } from '@mui/material/styles';
import { useTranslations } from 'next-intl';
import type { TripStatus } from '../types';

interface TripStatusBadgeProps {
  status: TripStatus;
  size?: 'small' | 'medium';
}

type StatusThemeVariant =
  | 'success'
  | 'warning'
  | 'info'
  | 'primary'
  | 'secondary'
  | 'error'
  | 'neutral';

type StatusLabelKey =
  | 'inProgress'
  | 'planning'
  | 'confirmed'
  | 'completed'
  | 'archived'
  | 'cancelled'
  | 'draft';

interface StatusThemeConfig {
  variant: StatusThemeVariant;
  labelKey: StatusLabelKey;
}

const STATUS_CONFIG_MAP: Record<TripStatus, StatusThemeConfig> = {
  COMPLETED: { variant: 'success', labelKey: 'completed' },
  IN_PROGRESS: { variant: 'warning', labelKey: 'inProgress' },
  PLANNING: { variant: 'info', labelKey: 'planning' },
  CONFIRMED: { variant: 'primary', labelKey: 'confirmed' },
  ARCHIVED: { variant: 'neutral', labelKey: 'archived' },
  CANCELLED: { variant: 'error', labelKey: 'cancelled' },
  DELETED: { variant: 'error', labelKey: 'cancelled' },
  DRAFT: { variant: 'neutral', labelKey: 'draft' },
};

const getThemeStatusColors = (theme: Theme, variant: StatusThemeVariant) => {
  const palette = theme.palette;

  switch (variant) {
    case 'success':
      return {
        bg: alpha(palette.success.main, 0.22),
        border: alpha(palette.success.light, 0.35),
        text: palette.success.light,
        dot: palette.success.main,
      };
    case 'warning':
      return {
        bg: alpha(palette.warning.main, 0.22),
        border: alpha(palette.warning.light, 0.4),
        text: palette.warning.light,
        dot: palette.warning.main,
      };
    case 'info':
      return {
        bg: alpha(palette.info.main, 0.22),
        border: alpha(palette.info.light, 0.35),
        text: palette.info.light,
        dot: palette.info.main,
      };
    case 'primary':
      return {
        bg: alpha(palette.primary.light, 0.22),
        border: alpha(palette.primary.light, 0.35),
        text: palette.primary.light,
        dot: palette.primary.light,
      };
    case 'secondary':
      return {
        bg: alpha(palette.secondary.main, 0.22),
        border: alpha(palette.secondary.light, 0.4),
        text: palette.secondary.light,
        dot: palette.secondary.main,
      };
    case 'error':
      return {
        bg: alpha(palette.error.main, 0.22),
        border: alpha(palette.error.light, 0.35),
        text: palette.error.light,
        dot: palette.error.main,
      };
    case 'neutral':
    default:
      return {
        bg: alpha(palette.common.white, 0.15),
        border: alpha(palette.common.white, 0.25),
        text: palette.common.white,
        dot: alpha(palette.common.white, 0.7),
      };
  }
};

const TripStatusBadge = ({
  status,
  size = 'medium',
}: TripStatusBadgeProps) => {
  const t = useTranslations('trip');
  const config = STATUS_CONFIG_MAP[status] ?? STATUS_CONFIG_MAP.DRAFT;
  const isSmall = size === 'small';

  return (
    <Box
      component="span"
      sx={(theme) => {
        const colors = getThemeStatusColors(theme, config.variant);

        return {
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          px: isSmall ? '8px' : '10px',
          py: isSmall ? '3px' : '4px',
          borderRadius: '999px',
          bgcolor: colors.bg,
          border: `1px solid ${colors.border}`,
          color: colors.text,
          fontSize: isSmall ? '11px' : '12px',
          fontWeight: 700,
          fontFamily: 'var(--font-body)',
          lineHeight: 1,
          whiteSpace: 'nowrap',
          flexShrink: 0,
          verticalAlign: 'middle',
        };
      }}
    >
      <Box
        component="span"
        sx={(theme) => {
          const colors = getThemeStatusColors(theme, config.variant);

          return {
            width: isSmall ? '6px' : '7px',
            height: isSmall ? '6px' : '7px',
            borderRadius: '50%',
            bgcolor: colors.dot,
            flexShrink: 0,
          };
        }}
      />
      {t(config.labelKey)}
    </Box>
  );
};

export default TripStatusBadge;
