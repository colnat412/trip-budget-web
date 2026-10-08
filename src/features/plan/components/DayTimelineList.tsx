'use client';

import React, { useState, useEffect } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import { useLocale, useTranslations } from 'next-intl';

import { AppButton } from '@/base/components/ui';
import { formatCurrency } from '@/base/utils';
import type { ActivityStatus, PlanActivity, RouteSegment } from '../types';
import ActivityTimelineCard from './ActivityTimelineCard';
import ActivityDistanceConnector from './ActivityDistanceConnector';
import PlanEmptyState from './PlanEmptyState';
import { getConsecutiveDistances } from '../services/googleMapsService';

export interface DayTimelineListProps {
  activities: PlanActivity[];
  totalActivities?: number;
  totalEstimatedCost?: number;
  currency: string;
  destinationContext?: string;
  onAddActivity?: () => void;
  onEditActivity?: (activity: PlanActivity) => void;
  onDeleteActivity?: (activity: PlanActivity) => void;
  onToggleStatus?: (activity: PlanActivity, nextStatus: ActivityStatus) => void;
  onConvertToExpense?: (activity: PlanActivity) => void;
  onOpenOptimizeRoute?: () => void;
  onResetDayActivities?: () => void;
  readOnly?: boolean;
}

const DayTimelineList = ({
  activities,
  totalActivities,
  totalEstimatedCost,
  currency,
  destinationContext,
  onAddActivity,
  onEditActivity,
  onDeleteActivity,
  onToggleStatus,
  onConvertToExpense,
  onResetDayActivities,
  readOnly = false,
}: DayTimelineListProps) => {
  const locale = useLocale();
  const t = useTranslations('plan');

  const [distanceData, setDistanceData] = useState<{
    segments: RouteSegment[];
    formattedTotalDistance: string;
    formattedTotalDuration: string;
    totalDistanceMeters: number;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;

    getConsecutiveDistances(
      activities,
      locale === 'en' ? 'en' : 'vi',
      destinationContext,
    )
      .then((data) => {
        if (isMounted) {
          setDistanceData(data);
        }
      })
      .catch((err) => {
        console.error('Failed to get consecutive distances:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [activities, locale, destinationContext]);

  if (activities.length === 0) {
    return <PlanEmptyState onAddActivity={onAddActivity} readOnly={readOnly} />;
  }

  // const locActivities = activities.filter(
  //   (a) => a.location && a.location.trim().length > 0,
  // );
  // const canOptimize = locActivities.length >= 2;

  const dayTotalActivities = totalActivities ?? activities.length;
  const dayTotalCost =
    totalEstimatedCost !== undefined
      ? Number(totalEstimatedCost) || 0
      : activities.reduce(
          (sum, act) =>
            sum + (act.estimatedCost ? Number(act.estimatedCost) : 0),
          0,
        );

  const segmentMap = new Map<string, RouteSegment>();
  distanceData?.segments.forEach((seg) => {
    segmentMap.set(`${seg.fromActivityId}->${seg.toActivityId}`, seg);
  });

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 0.5,
          flexWrap: 'wrap',
          gap: 1.5,
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Typography
            sx={{
              fontSize: '13px',
              fontWeight: 700,
              color: 'text.secondary',
            }}
          >
            {dayTotalActivities} {t('totalActivities').toLowerCase()}
          </Typography>
          {dayTotalCost > 0 && (
            <Typography
              sx={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'success.main',
              }}
            >
              · {t('dayTotalCostLabel')}:{' '}
              {formatCurrency(dayTotalCost, currency)}
            </Typography>
          )}
        </Stack>

        {!readOnly && onResetDayActivities && (
          <AppButton
            intent="secondary"
            size="small"
            startIcon={<RestartAltRoundedIcon sx={{ fontSize: 16 }} />}
            onClick={onResetDayActivities}
            sx={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'error.main',
              borderColor: 'error.light',
              '&:hover': {
                borderColor: 'error.main',
                bgcolor: 'error.50',
              },
            }}
          >
            {t('resetDayBtn')}
          </AppButton>
        )}
      </Box>

      <Stack spacing={1}>
        {activities.map((activity, idx) => {
          const nextActivity = activities[idx + 1];
          const hasLocationCurrent = Boolean(
            activity.location && activity.location.trim().length > 0,
          );
          const hasLocationNext = Boolean(
            nextActivity?.location && nextActivity.location.trim().length > 0,
          );

          const segment =
            nextActivity &&
            segmentMap.get(`${activity.id}->${nextActivity.id}`);

          return (
            <React.Fragment key={activity.id}>
              <ActivityTimelineCard
                activity={activity}
                currency={currency}
                onEdit={onEditActivity}
                onDelete={onDeleteActivity}
                onToggleStatus={onToggleStatus}
                onConvertToExpense={onConvertToExpense}
                readOnly={readOnly}
              />

              {nextActivity && hasLocationCurrent && hasLocationNext && (
                <ActivityDistanceConnector
                  originLocation={activity.location!}
                  destinationLocation={nextActivity.location!}
                  distance={segment?.distance}
                  duration={segment?.duration}
                  isEstimated={segment?.isEstimated}
                  source={segment?.source}
                />
              )}
            </React.Fragment>
          );
        })}
      </Stack>
    </Box>
  );
};

export default DayTimelineList;
