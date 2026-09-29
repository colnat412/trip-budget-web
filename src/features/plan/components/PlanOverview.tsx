'use client';

import React, { useState } from 'react';
import { Box, Card, Skeleton, Stack, Typography } from '@mui/material';
import LuggageRoundedIcon from '@mui/icons-material/LuggageRounded';
import { useTranslations } from 'next-intl';

import { axiosClient } from '@/base/api';
import {
  AppPageContainer,
  AppToast,
  AppConfirmDialog,
  type AppToastSeverity,
} from '@/base/components/ui';
import { useTripContext } from '@/features/trip/context/TripContext';
import { useUserContext } from '@/features/user/context/UserContext';
import { useTripMembers } from '@/features/trip/hooks/useTripMembers';
import AddExpenseDialog from '@/features/expense/components/AddExpenseDialog';
import type { CreateExpensePayload } from '@/features/expense/types';
import ShareTripDialog from '@/features/trip/components/ShareTripDialog';
import useTripPlan from '../hooks/useTripPlan';
import {
  useCreateActivity,
  useCreateChecklist,
  useDeleteActivity,
  useUpdateActivity,
  useResetDayActivities,
} from '../hooks/usePlanMutation';
import type {
  ActivityStatus,
  CreateActivityPayload,
  CreateChecklistPayload,
  PlanActivity,
  PlanChecklist,
  UpdateActivityPayload,
} from '../types';
import AddActivityDialog from './AddActivityDialog';
import ChecklistDialog from './ChecklistDialog';
import DayTimelineList from './DayTimelineList';
import DeleteActivityDialog from './DeleteActivityDialog';
import EditActivityDialog from './EditActivityDialog';
import OptimizeRouteDialog from './OptimizeRouteDialog';
import PlanDayTabs from './PlanDayTabs';
import PlanHeader from './PlanHeader';
import ActivityLogDialog from './ActivityLogDialog';
import AiPlannerDialog from './AiPlannerDialog';

const PlanOverview = () => {
  const t = useTranslations('plan');
  const { activeTrip } = useTripContext();
  const tripId = activeTrip?.id;

  const { plan: overview, isLoading, refetch } = useTripPlan({ tripId });
  const { user } = useUserContext();
  const { members } = useTripMembers({ tripId });

  const currentUserId = user?.id !== undefined ? String(user.id) : undefined;
  const currentUserEmail = user?.email?.toLowerCase().trim();

  const currentMember = members.find((m) => {
    if (currentUserId && String(m.userId) === currentUserId) return true;
    if (currentUserEmail && m.email?.toLowerCase().trim() === currentUserEmail)
      return true;
    return false;
  });

  const isOwner =
    currentMember?.role === 'OWNER' ||
    (activeTrip?.ownerId !== undefined &&
      currentUserId !== undefined &&
      String(activeTrip.ownerId) === currentUserId);

  const isViewer = !isOwner && currentMember?.role === 'VIEWER';

  const [selectedDayId, setSelectedDayId] = useState<string>('');
  const [addActivityOpen, setAddActivityOpen] = useState(false);
  const [aiPlannerOpen, setAiPlannerOpen] = useState(false);
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [resetDayConfirmOpen, setResetDayConfirmOpen] = useState(false);
  const [optimizeDialogOpen, setOptimizeDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [activityLogOpen, setActivityLogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<PlanActivity | null>(
    null,
  );
  const [deletingActivity, setDeletingActivity] = useState<PlanActivity | null>(
    null,
  );
  const [convertExpenseActivity, setConvertExpenseActivity] =
    useState<PlanActivity | null>(null);

  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: AppToastSeverity;
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showToast = (
    message: string,
    severity: AppToastSeverity = 'success',
  ) => {
    setToast({ open: true, message, severity });
  };

  const days = overview?.days ?? [];
  const activeDayId =
    selectedDayId && days.some((d) => String(d.id) === String(selectedDayId))
      ? selectedDayId
      : days[0]?.id
        ? String(days[0].id)
        : '';

  const selectedDay =
    days.find((d) => String(d.id) === String(activeDayId)) ?? days[0] ?? null;

  const { createActivityAsync, isPending: isCreatingActivity } =
    useCreateActivity({
      tripId: tripId ?? '',
      dayId: selectedDay?.id ?? '',
      options: {
        onSuccess: () => {
          showToast(t('toasts.createActivitySuccess'));
          setAddActivityOpen(false);
          refetch();
        },
        onError: () => {
          showToast(t('toasts.error'), 'error');
        },
      },
    });

  const { updateActivityAsync, isPending: isUpdatingActivity } =
    useUpdateActivity({
      tripId: tripId ?? '',
      activityId: editingActivity?.id ?? '',
      options: {
        onSuccess: () => {
          showToast(t('toasts.updateActivitySuccess'));
          setEditingActivity(null);
          refetch();
        },
        onError: () => {
          showToast(t('toasts.error'), 'error');
        },
      },
    });

  const { deleteActivityAsync, isPending: isDeletingActivity } =
    useDeleteActivity({
      tripId: tripId ?? '',
      activityId: deletingActivity?.id ?? '',
      options: {
        onSuccess: () => {
          showToast(t('toasts.deleteActivitySuccess'));
          setDeletingActivity(null);
          refetch();
        },
        onError: () => {
          showToast(t('toasts.error'), 'error');
        },
      },
    });

  const { resetDayActivitiesAsync, isPending: isResettingDay } =
    useResetDayActivities({
      tripId: tripId ?? '',
      dayId: selectedDay?.id ?? '',
      options: {
        onSuccess: () => {
          showToast(t('toasts.resetDaySuccess'));
          setResetDayConfirmOpen(false);
          refetch();
        },
        onError: () => {
          showToast(t('toasts.error'), 'error');
        },
      },
    });

  const { createChecklistAsync, isPending: isCreatingChecklist } =
    useCreateChecklist({
      tripId: tripId ?? '',
      options: {
        onSuccess: () => {
          showToast(t('toasts.createChecklistSuccess'));
          refetch();
        },
        onError: () => {
          showToast(t('toasts.error'), 'error');
        },
      },
    });

  const handleToggleActivityStatus = async (
    activity: PlanActivity,
    nextStatus: ActivityStatus,
  ) => {
    try {
      await axiosClient.patch(
        `/trip/${tripId}/plan/activities/${activity.id}/status`,
        {
          status: nextStatus,
        },
      );
      showToast(t('toasts.statusUpdateSuccess'));
      refetch();
    } catch {
      showToast(t('toasts.error'), 'error');
    }
  };

  const handleToggleChecklist = async (item: PlanChecklist) => {
    try {
      await axiosClient.patch(
        `/trip/${tripId}/plan/checklists/${item.id}/toggle`,
      );
      refetch();
    } catch {
      showToast(t('toasts.error'), 'error');
    }
  };

  const handleDeleteChecklist = async (item: PlanChecklist) => {
    try {
      await axiosClient.delete(`/trip/${tripId}/plan/checklists/${item.id}`);
      showToast(t('toasts.deleteChecklistSuccess'));
      refetch();
    } catch {
      showToast(t('toasts.error'), 'error');
    }
  };

  const handleConvertToExpense = (activity: PlanActivity) => {
    setConvertExpenseActivity(activity);
  };

  const handleCreateConvertedExpense = async (
    payload: CreateExpensePayload,
  ) => {
    try {
      const response = await axiosClient.post(
        `/trip/${tripId}/expenses`,
        payload,
      );
      const createdExpenseId = response.data?.data?.id;

      if (convertExpenseActivity && createdExpenseId) {
        await axiosClient.put(
          `/trip/${tripId}/plan/activities/${convertExpenseActivity.id}`,
          {
            title: convertExpenseActivity.title,
            category: convertExpenseActivity.category,
            startTime: convertExpenseActivity.startTime || undefined,
            endTime: convertExpenseActivity.endTime || undefined,
            location: convertExpenseActivity.location || undefined,
            estimatedCost: convertExpenseActivity.estimatedCost,
            note: convertExpenseActivity.note || undefined,
            expenseId: createdExpenseId,
            status: 'COMPLETED',
          },
        );
      }
      showToast(t('toasts.updateActivitySuccess'));
      setConvertExpenseActivity(null);
      refetch();
    } catch {
      showToast(t('toasts.error'), 'error');
    }
  };

  const handleApplyOptimizedRoute = async (
    optimizedActivities: PlanActivity[],
  ) => {
    try {
      const updates = optimizedActivities.map((act, index) => {
        return axiosClient.put(`/trip/${tripId}/plan/activities/${act.id}`, {
          title: act.title,
          startTime: act.startTime || undefined,
          endTime: act.endTime || undefined,
          location: act.location || undefined,
          category: act.category,
          estimatedCost: act.estimatedCost,
          status: act.status,
          orderIndex: index,
          note: act.note || undefined,
          expenseId: act.expenseId || undefined,
        });
      });

      await Promise.all(updates);
      showToast(t('toasts.optimizeSuccess'));
      refetch();
    } catch {
      showToast(t('toasts.error'), 'error');
    }
  };

  if (!tripId) {
    return (
      <AppPageContainer
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Card
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: '20px',
            border: 1,
            borderColor: 'divider',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '20px',
              bgcolor: 'action.hover',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'primary.main',
            }}
          >
            <LuggageRoundedIcon sx={{ fontSize: '36px' }} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontSize: '18px',
              fontWeight: 700,
              color: 'text.primary',
            }}
          >
            {t('pageTitle')}
          </Typography>
          <Typography
            sx={{
              fontSize: '14px',
              color: 'text.secondary',
              maxWidth: 440,
            }}
          >
            {t('noActiveTrip')}
          </Typography>
        </Card>
      </AppPageContainer>
    );
  }

  return (
    <AppPageContainer>
      {isLoading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Skeleton variant="text" width={220} height={40} />
          <Skeleton variant="text" width={380} height={24} />
        </Box>
      ) : (
        <PlanHeader
          tripName={overview?.tripName ?? activeTrip?.name ?? ''}
          destination={overview?.destination ?? activeTrip?.destination ?? ''}
          totalDays={overview?.totalDays ?? overview?.days.length ?? 0}
          totalActivities={overview?.totalActivities ?? 0}
          completedActivities={overview?.completedActivities ?? 0}
          totalEstimatedCost={overview?.totalEstimatedCost ?? 0}
          currency={overview?.baseCurrency ?? activeTrip?.baseCurrency ?? 'VND'}
          onAddActivity={() => setAddActivityOpen(true)}
          onOpenChecklist={() => setChecklistOpen(true)}
          onOpenAiPlanner={() => setAiPlannerOpen(true)}
          onOpenShare={() => setShareDialogOpen(true)}
          onOpenActivityLogs={() => setActivityLogOpen(true)}
          readOnly={isViewer}
        />
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          {[1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              width={140}
              height={56}
              sx={{ borderRadius: '14px' }}
            />
          ))}
        </Box>
      ) : overview?.days && overview.days.length > 0 ? (
        <PlanDayTabs
          days={overview.days}
          selectedDayId={activeDayId}
          currency={overview?.baseCurrency ?? activeTrip?.baseCurrency ?? 'VND'}
          onSelectDay={(dayId) => setSelectedDayId(dayId)}
        />
      ) : null}

      {isLoading ? (
        <Stack spacing={2}>
          {[1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={100}
              sx={{ borderRadius: '16px' }}
            />
          ))}
        </Stack>
      ) : (
        <DayTimelineList
          activities={selectedDay?.activities ?? []}
          currency={overview?.baseCurrency ?? activeTrip?.baseCurrency ?? 'VND'}
          destinationContext={activeTrip?.destination}
          onAddActivity={() => setAddActivityOpen(true)}
          onEditActivity={(activity) => setEditingActivity(activity)}
          onDeleteActivity={(activity) => setDeletingActivity(activity)}
          onToggleStatus={handleToggleActivityStatus}
          onConvertToExpense={handleConvertToExpense}
          onOpenOptimizeRoute={() => setOptimizeDialogOpen(true)}
          onResetDayActivities={() => setResetDayConfirmOpen(true)}
          readOnly={isViewer}
        />
      )}

      <AddActivityDialog
        open={addActivityOpen}
        onClose={() => setAddActivityOpen(false)}
        onSubmit={(payload: CreateActivityPayload) =>
          createActivityAsync(payload)
        }
        isLoading={isCreatingActivity}
        tripCurrency={
          overview?.baseCurrency ?? activeTrip?.baseCurrency ?? 'VND'
        }
      />

      <EditActivityDialog
        open={!!editingActivity}
        onClose={() => setEditingActivity(null)}
        activity={editingActivity}
        onSubmit={(payload: UpdateActivityPayload) =>
          updateActivityAsync(payload)
        }
        isLoading={isUpdatingActivity}
        tripCurrency={
          overview?.baseCurrency ?? activeTrip?.baseCurrency ?? 'VND'
        }
      />

      <DeleteActivityDialog
        open={!!deletingActivity}
        onClose={() => setDeletingActivity(null)}
        onConfirm={() => deleteActivityAsync({})}
        activityTitle={deletingActivity?.title}
        loading={isDeletingActivity}
      />

      <ChecklistDialog
        open={checklistOpen}
        onClose={() => setChecklistOpen(false)}
        checklists={overview?.checklists ?? []}
        onAdd={(payload: CreateChecklistPayload) =>
          createChecklistAsync(payload)
        }
        onToggle={handleToggleChecklist}
        onDelete={handleDeleteChecklist}
        isLoading={isCreatingChecklist}
        readOnly={isViewer}
      />

      <OptimizeRouteDialog
        open={optimizeDialogOpen}
        onClose={() => setOptimizeDialogOpen(false)}
        dayNumber={selectedDay?.dayNumber ?? 1}
        activities={selectedDay?.activities ?? []}
        destinationContext={activeTrip?.destination}
        onApplyRoute={handleApplyOptimizedRoute}
      />

      {convertExpenseActivity && (
        <AddExpenseDialog
          open={!!convertExpenseActivity}
          onClose={() => setConvertExpenseActivity(null)}
          onSubmit={handleCreateConvertedExpense}
          tripCurrency={
            overview?.baseCurrency ?? activeTrip?.baseCurrency ?? 'VND'
          }
          tripId={tripId}
          initialData={{
            title: convertExpenseActivity.title,
            amount:
              convertExpenseActivity.estimatedCost > 0
                ? convertExpenseActivity.estimatedCost
                : undefined,
            category: convertExpenseActivity.category,
            expenseDate:
              overview?.days.find((d) => d.id === convertExpenseActivity.dayId)
                ?.planDate || undefined,
          }}
        />
      )}

      {tripId && (
        <ShareTripDialog
          open={shareDialogOpen}
          onClose={() => setShareDialogOpen(false)}
          tripId={tripId}
          tripName={overview?.tripName ?? activeTrip?.name ?? ''}
        />
      )}

      <ActivityLogDialog
        open={activityLogOpen}
        onClose={() => setActivityLogOpen(false)}
        tripId={tripId ?? null}
      />

      {tripId && (
        <AiPlannerDialog
          open={aiPlannerOpen}
          onClose={() => setAiPlannerOpen(false)}
          tripId={tripId}
          initialDestination={
            overview?.destination ?? activeTrip?.destination ?? ''
          }
          initialDays={
            activeTrip?.startDate && activeTrip?.endDate
              ? Math.max(
                  1,
                  Math.ceil(
                    (new Date(activeTrip.endDate).getTime() -
                      new Date(activeTrip.startDate).getTime()) /
                      (1000 * 3600 * 24),
                  ) + 1,
                )
              : overview?.totalDays || overview?.days?.length || 3
          }
          initialPeople={members?.length || 2}
          currency={overview?.baseCurrency ?? activeTrip?.baseCurrency ?? 'VND'}
          onSuccess={() => {
            showToast(t('toasts.aiGenerateSuccess'));
            refetch();
          }}
          onError={(msg) => showToast(msg, 'error')}
        />
      )}

      <AppConfirmDialog
        open={resetDayConfirmOpen}
        onClose={() => setResetDayConfirmOpen(false)}
        onConfirm={async () => {
          await resetDayActivitiesAsync({});
        }}
        title={t('dialog.resetDayTitle', { day: selectedDay?.dayNumber ?? '' })}
        description={t('dialog.resetDayDesc', {
          day: selectedDay?.dayNumber ?? '',
        })}
        confirmText={t('dialog.confirmResetDay')}
        cancelText={t('dialog.cancelBtn')}
        intent="danger"
        loading={isResettingDay}
      />

      <AppToast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />
    </AppPageContainer>
  );
};

export default PlanOverview;
