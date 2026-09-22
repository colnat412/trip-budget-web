'use client';

import React from 'react';
import { Box, ButtonBase, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import { useTranslations } from 'next-intl';

import { formatDate } from '@/base/utils';
import type { PlanDay } from '../types';

export interface PlanDayTabsProps {
  days: PlanDay[];
  selectedDayId: string;
  onSelectDay: (dayId: string) => void;
}

const PlanDayTabs = ({
  days,
  selectedDayId,
  onSelectDay,
}: PlanDayTabsProps) => {
  const t = useTranslations('plan');

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        overflowX: 'auto',
        pb: 0.5,
        '&::-webkit-scrollbar': { height: 6 },
        '&::-webkit-scrollbar-thumb': {
          bgcolor: 'action.hover',
          borderRadius: '999px',
        },
      }}
    >
      {days.map((day) => {
        const isSelected = String(day.id) === String(selectedDayId);
        const formattedDate = day.planDate
          ? formatDate(day.planDate, 'DD/MM/YYYY')
          : null;

        return (
          <ButtonBase
            key={day.id}
            onClick={() => onSelectDay(day.id)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 0.5,
              py: 1.25,
              px: 2,
              borderRadius: '14px',
              border: 1,
              borderColor: isSelected ? 'primary.main' : 'divider',
              bgcolor: isSelected ? 'primary.main' : 'background.paper',
              color: isSelected ? 'primary.contrastText' : 'text.primary',
              minWidth: 120,
              flexShrink: 0,
              textAlign: 'left',
              transition: 'all 0.2s ease',
              boxShadow: (theme) => {
                return isSelected
                  ? `0 6px 16px ${alpha(theme.palette.primary.main, 0.16)}`
                  : `0 2px 4px ${alpha(theme.palette.text.primary, 0.04)}`;
              },
              '&:hover': {
                bgcolor: isSelected ? 'primary.main' : 'action.hover',
                borderColor: 'primary.main',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                gap: 1,
              }}
            >
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: isSelected ? 800 : 700,
                  color: 'inherit',
                }}
              >
                {t('dayTab', { day: day.dayNumber })}
              </Typography>

              <Box
                component="span"
                sx={{
                  px: 0.75,
                  py: 0.1,
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: 700,
                  bgcolor: (theme) => {
                    return isSelected
                      ? alpha(theme.palette.primary.contrastText, 0.2)
                      : (theme.vars?.palette ?? theme.palette).action.hover;
                  },
                  color: isSelected ? 'primary.contrastText' : 'text.secondary',
                }}
              >
                {day.totalActivities}
              </Box>
            </Box>

            {formattedDate && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  opacity: isSelected ? 0.9 : 0.75,
                  fontSize: '11px',
                }}
              >
                <CalendarTodayRoundedIcon sx={{ fontSize: '12px' }} />
                <span>{formattedDate}</span>
              </Box>
            )}
          </ButtonBase>
        );
      })}
    </Box>
  );
};

export default PlanDayTabs;
