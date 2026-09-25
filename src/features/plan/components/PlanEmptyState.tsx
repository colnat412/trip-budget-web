'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useTranslations } from 'next-intl';

import { AppButton } from '@/base/components/ui';

export interface PlanEmptyStateProps {
  onAddActivity?: () => void;
  readOnly?: boolean;
}

const PlanEmptyState = ({
  onAddActivity,
  readOnly = false,
}: PlanEmptyStateProps) => {
  const t = useTranslations('plan');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        py: { xs: 6, md: 8 },
        px: { xs: 2, md: 3 },
        borderRadius: '16px',
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: '16px',
          bgcolor: 'action.hover',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'primary.main',
        }}
      >
        <EventAvailableRoundedIcon sx={{ fontSize: '32px' }} />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 700,
            color: 'text.primary',
          }}
        >
          {t('emptyActivities')}
        </Typography>
        <Typography
          sx={{
            fontSize: '13px',
            color: 'text.secondary',
            maxWidth: 420,
          }}
        >
          {t('emptyActivitiesDesc')}
        </Typography>
      </Box>

      {!readOnly && onAddActivity && (
        <AppButton
          intent="primary"
          size="medium"
          startIcon={<AddRoundedIcon />}
          onClick={onAddActivity}
        >
          {t('addFirstActivity')}
        </AppButton>
      )}
    </Box>
  );
};

export default PlanEmptyState;
