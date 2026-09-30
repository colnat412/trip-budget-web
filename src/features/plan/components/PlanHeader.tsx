'use client';

import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import ChecklistRoundedIcon from '@mui/icons-material/ChecklistRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import { Share } from '@mui/icons-material';
import { useTranslations } from 'next-intl';

import { AppButton } from '@/base/components/ui';
import { formatCurrency } from '@/base/utils';

export interface PlanHeaderProps {
  tripName: string;
  destination: string;
  totalDays: number;
  totalActivities: number;
  completedActivities: number;
  totalEstimatedCost: number;
  currency: string;
  onAddActivity?: () => void;
  onOpenChecklist: () => void;
  onOpenAiPlanner?: () => void;
  onOpenShare?: () => void;
  onOpenActivityLogs?: () => void;
  readOnly?: boolean;
}

const PlanHeader = ({
  tripName,
  destination,
  totalDays,
  totalActivities,
  completedActivities,
  totalEstimatedCost,
  currency,
  onAddActivity,
  onOpenChecklist,
  onOpenAiPlanner,
  onOpenShare,
  onOpenActivityLogs,
  readOnly = false,
}: PlanHeaderProps) => {
  const t = useTranslations('plan');

  const secondaryBtnSx = {
    flex: { xs: '1 1 calc(50% - 4px)', sm: 'initial' },
    minHeight: { xs: '36px', sm: '40px' },
    px: { xs: 1.25, sm: 2 },
    fontSize: { xs: '12px', sm: '13px' },
    fontWeight: 700,
    borderRadius: { xs: '10px', sm: '12px' },
    whiteSpace: 'nowrap',
    '& .MuiSvgIcon-root': {
      fontSize: { xs: '16px', sm: '18px' },
    },
  };

  const aiBtnSx = {
    ...secondaryBtnSx,
    borderColor: 'primary.light',
    color: 'primary.main',
    '&:hover': {
      borderColor: 'primary.main',
      bgcolor: 'primary.50',
    },
  };

  const primaryBtnSx = {
    flex: { xs: '1 1 100%', sm: 'initial' },
    minHeight: { xs: '38px', sm: '40px' },
    px: { xs: 2, sm: 2.5 },
    fontSize: { xs: '13px', sm: '14px' },
    fontWeight: 700,
    borderRadius: { xs: '10px', sm: '12px' },
    whiteSpace: 'nowrap',
    '& .MuiSvgIcon-root': {
      fontSize: { xs: '18px', sm: '20px' },
    },
  };

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'center' },
        gap: { xs: 1.5, sm: 2 },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
          minWidth: 0,
        }}
      >
        <Typography
          component="h1"
          sx={{
            fontFamily: 'var(--font-display)',
            fontSize: { xs: '20px', sm: '26px', md: '28px' },
            fontWeight: 800,
            color: 'text.primary',
            letterSpacing: '-0.5px',
          }}
        >
          {t('pageTitle')}
        </Typography>

        <Stack
          direction="row"
          spacing={0.75}
          sx={{
            alignItems: 'center',
            flexWrap: 'wrap',
            rowGap: 0.25,
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: '12.5px', sm: '13.5px' },
              fontWeight: 700,
              color: 'primary.main',
            }}
          >
            {tripName}
          </Typography>
          {destination && (
            <Typography
              sx={{
                fontSize: { xs: '11.5px', sm: '12.5px' },
                color: 'text.secondary',
              }}
            >
              · {destination}
            </Typography>
          )}
          <Typography
            sx={{
              fontSize: { xs: '11.5px', sm: '12.5px' },
              color: 'text.secondary',
            }}
          >
            · {totalDays} {t('totalDays').toLowerCase()} · {totalActivities}{' '}
            {t('totalActivities').toLowerCase()} ({completedActivities}{' '}
            {t('completedActivities').toLowerCase()})
          </Typography>
          {totalEstimatedCost > 0 && (
            <Typography
              sx={{
                fontSize: { xs: '11.5px', sm: '12.5px' },
                fontWeight: 700,
                color: 'success.main',
              }}
            >
              · {t('totalEstimatedCost')}:{' '}
              {formatCurrency(totalEstimatedCost, currency)}
            </Typography>
          )}
        </Stack>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignSelf: { xs: 'stretch', sm: 'auto' },
          flexWrap: 'wrap',
          gap: { xs: 1, sm: 1.25 },
        }}
      >
        {onOpenActivityLogs && (
          <AppButton
            intent="secondary"
            size="small"
            startIcon={<HistoryRoundedIcon />}
            onClick={onOpenActivityLogs}
            sx={secondaryBtnSx}
          >
            {t('activityLogBtn')}
          </AppButton>
        )}

        {!readOnly && onOpenShare && (
          <AppButton
            intent="secondary"
            size="small"
            startIcon={<Share />}
            onClick={onOpenShare}
            sx={secondaryBtnSx}
          >
            {t('shareBtn')}
          </AppButton>
        )}

        <AppButton
          intent="secondary"
          size="small"
          startIcon={<ChecklistRoundedIcon />}
          onClick={onOpenChecklist}
          sx={secondaryBtnSx}
        >
          {t('checklistBtn')}
        </AppButton>

        {!readOnly && onOpenAiPlanner && (
          <AppButton
            intent="secondary"
            size="small"
            startIcon={
              <AutoAwesomeRoundedIcon sx={{ color: 'primary.main' }} />
            }
            onClick={onOpenAiPlanner}
            sx={aiBtnSx}
          >
            {t('aiPlannerBtn')}
          </AppButton>
        )}

        {!readOnly && onAddActivity && (
          <AppButton
            intent="primary"
            size="small"
            startIcon={<AddRoundedIcon />}
            onClick={onAddActivity}
            sx={primaryBtnSx}
          >
            {t('addActivity')}
          </AppButton>
        )}
      </Box>
    </Box>
  );
};

export default PlanHeader;
