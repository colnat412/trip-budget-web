'use client';

import React from 'react';
import { Box, Stack } from '@mui/material';

import type { ActivityStatus, PlanActivity } from '../types';
import ActivityTimelineCard from './ActivityTimelineCard';
import PlanEmptyState from './PlanEmptyState';

export interface DayTimelineListProps {
  activities: PlanActivity[];
  currency: string;
  onAddActivity: () => void;
  onEditActivity: (activity: PlanActivity) => void;
  onDeleteActivity: (activity: PlanActivity) => void;
  onToggleStatus: (activity: PlanActivity, nextStatus: ActivityStatus) => void;
  onConvertToExpense?: (activity: PlanActivity) => void;
}

const DayTimelineList = ({
  activities,
  currency,
  onAddActivity,
  onEditActivity,
  onDeleteActivity,
  onToggleStatus,
  onConvertToExpense,
}: DayTimelineListProps) => {
  if (activities.length === 0) {
    return <PlanEmptyState onAddActivity={onAddActivity} />;
  }

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Stack spacing={2}>
        {activities.map((activity) => (
          <ActivityTimelineCard
            key={activity.id}
            activity={activity}
            currency={currency}
            onEdit={onEditActivity}
            onDelete={onDeleteActivity}
            onToggleStatus={onToggleStatus}
            onConvertToExpense={onConvertToExpense}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default DayTimelineList;
