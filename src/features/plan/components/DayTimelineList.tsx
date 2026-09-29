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
      }}
    >
      {/* tạm ẩn */}
      {/* {canOptimize && distanceData && distanceData.totalDistanceMeters > 0 && (
        <Card
          sx={{
            mb: 2.5,
            p: { xs: 1.5, sm: 2 },
            borderRadius: '16px',
            border: 1,
            borderColor: alpha(theme.palette.primary.main, 0.2),
            bgcolor:
              theme.palette.mode === 'dark'
                ? alpha(theme.palette.primary.main, 0.08)
                : alpha(theme.palette.primary.main, 0.03),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                bgcolor: alpha(theme.palette.primary.main, 0.15),
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <DirectionsCarFilledRoundedIcon sx={{ fontSize: '20px' }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: 'text.primary',
                }}
              >
                {t('dayTotalTitle', {
                  dist: distanceData.formattedTotalDistance,
                  time: distanceData.formattedTotalDuration,
                })}
              </Typography>
              <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                {t('dayTotalSub', { count: distanceData.segments.length })}
              </Typography>
            </Box>
          </Box>

          {onOpenOptimizeRoute && (
            <Button
              variant="outlined"
              size="small"
              onClick={onOpenOptimizeRoute}
              startIcon={<AutoAwesomeRoundedIcon sx={{ fontSize: '16px' }} />}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '12px',
                borderRadius: '10px',
                borderColor: alpha(theme.palette.primary.main, 0.4),
                bgcolor: 'background.paper',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                },
              }}
            >
              {t('optimizeBtn')}
            </Button>
          )}
        </Card>
      )} */}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
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
            {activities.length} {t('totalActivities').toLowerCase()}
          </Typography>
          {activities.reduce(
            (sum, act) =>
              sum + (act.estimatedCost ? Number(act.estimatedCost) : 0),
            0,
          ) > 0 && (
            <Typography
              sx={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'success.main',
              }}
            >
              · {t('dayTotalCostLabel')}:{' '}
              {formatCurrency(
                activities.reduce(
                  (sum, act) =>
                    sum + (act.estimatedCost ? Number(act.estimatedCost) : 0),
                  0,
                ),
                currency,
              )}
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
