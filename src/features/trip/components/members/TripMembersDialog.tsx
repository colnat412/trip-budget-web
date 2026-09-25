'use client';

import { useState } from 'react';
import { Box, Chip, Stack } from '@mui/material';
import { useTranslations } from 'next-intl';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';

import AppDialog from '@/base/components/ui/AppDialog';
import AppButton from '@/base/components/ui/AppButton';
import AppConfirmDialog from '@/base/components/ui/AppConfirmDialog';
import AppToast, { type AppToastSeverity } from '@/base/components/ui/AppToast';
import { axiosClient } from '@/base/api';
import { useUserContext } from '@/features/user/context/UserContext';
import useCurrentUser from '@/features/user/hooks/useCurrentUser';
import type { UserProfile } from '@/features/auth/types';
import {
  useTripMembers,
  useInviteMember,
  useUpdateMemberRole,
  useRemoveMember,
  useLeaveTrip,
} from '../../hooks/useTripMembers';
import type {
  InviteMemberPayload,
  TripMember,
  TripMemberRole,
} from '../../types/member.types';
import TripMemberList from './TripMemberList';
import InviteMemberForm from './InviteMemberForm';
import EditMemberRoleDialog from './EditMemberRoleDialog';

interface TripMembersDialogProps {
  open: boolean;
  onClose: () => void;
  tripId: number | string;
  tripName?: string;
  tripOwnerId?: number | string;
  initialShowInvite?: boolean;
}

const TripMembersDialog = ({
  open,
  onClose,
  tripId,
  tripName = '',
  tripOwnerId,
  initialShowInvite = false,
}: TripMembersDialogProps) => {
  const t = useTranslations('members');
  const { user: userFromContext } = useUserContext();
  const { user: userFromHook } = useCurrentUser();

  const rawUser: UserProfile | null =
    (userFromContext as { data?: UserProfile })?.data ??
    userFromContext ??
    (userFromHook as { data?: UserProfile })?.data ??
    userFromHook;

  const [showInviteForm, setShowInviteForm] = useState(initialShowInvite);
  const [editingMember, setEditingMember] = useState<TripMember | null>(null);
  const [removingMember, setRemovingMember] = useState<TripMember | null>(null);
  const [isLeaving, setIsLeaving] = useState(false);

  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: AppToastSeverity;
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const { members, isLoading, refetch } = useTripMembers({
    tripId,
    enabled: open,
  });

  const currentUserId =
    rawUser?.id !== undefined ? String(rawUser.id) : undefined;
  const currentUserEmail = rawUser?.email?.toLowerCase().trim();

  const currentMember = members.find((m) => {
    if (currentUserId && String(m.userId) === currentUserId) return true;
    if (currentUserEmail && m.email?.toLowerCase().trim() === currentUserEmail)
      return true;
    return false;
  });

  const isCurrentUserOwner =
    currentMember?.role === 'OWNER' ||
    (tripOwnerId !== undefined &&
      currentUserId !== undefined &&
      String(tripOwnerId) === currentUserId) ||
    (!currentMember && members.length === 1 && members[0]?.role === 'OWNER') ||
    (!currentMember && !isLoading);

  const currentUserRole: TripMemberRole = isCurrentUserOwner
    ? 'OWNER'
    : (currentMember?.role ?? 'MEMBER');

  const canManageMembers =
    isCurrentUserOwner ||
    currentUserRole === 'VICE' ||
    currentUserRole === 'EDITOR' ||
    (!currentMember && !isLoading);

  const { inviteMember, isPending: isInviting } = useInviteMember({
    tripId,
    options: {
      onSuccess: () => {
        setToast({
          open: true,
          message: t('toasts.inviteSuccess'),
          severity: 'success',
        });
        setShowInviteForm(false);
        refetch();
      },
      onError: (err) => {
        setToast({
          open: true,
          message: err.message || t('toasts.inviteError'),
          severity: 'error',
        });
      },
    },
  });

  const { updateRole, isPending: isUpdatingRole } = useUpdateMemberRole({
    tripId,
    memberId: editingMember?.id ?? '',
    options: {
      onSuccess: () => {
        setToast({
          open: true,
          message: t('toasts.updateRoleSuccess'),
          severity: 'success',
        });
        setEditingMember(null);
        refetch();
      },
      onError: (err) => {
        setToast({
          open: true,
          message: err.message || t('toasts.updateRoleError'),
          severity: 'error',
        });
      },
    },
  });

  const { removeMember, isPending: isRemoving } = useRemoveMember({
    tripId,
    memberId: removingMember?.id ?? '',
    options: {
      onSuccess: () => {
        setToast({
          open: true,
          message: t('toasts.removeSuccess'),
          severity: 'success',
        });
        setRemovingMember(null);
        refetch();
      },
      onError: (err) => {
        setToast({
          open: true,
          message: err.message || t('toasts.removeError'),
          severity: 'error',
        });
      },
    },
  });

  const { leaveTrip, isPending: isLeavingTrip } = useLeaveTrip({
    tripId,
    options: {
      onSuccess: () => {
        setToast({
          open: true,
          message: t('toasts.leaveSuccess'),
          severity: 'success',
        });
        setIsLeaving(false);
        onClose();
      },
      onError: (err) => {
        setToast({
          open: true,
          message: err.message || t('toasts.leaveError'),
          severity: 'error',
        });
      },
    },
  });

  const handleInviteSubmit = (payload: InviteMemberPayload) => {
    inviteMember(payload);
  };

  const handleAcceptMember = async (member: TripMember) => {
    try {
      await axiosClient.put(`/trip/${tripId}/members/${member.id}/accept`);
      setToast({
        open: true,
        message: t('toasts.acceptSuccess'),
        severity: 'success',
      });
      refetch();
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { message?: string } } };
      setToast({
        open: true,
        message: apiErr.response?.data?.message || t('toasts.acceptError'),
        severity: 'error',
      });
    }
  };

  const handleUpdateRoleSubmit = (role: TripMemberRole) => {
    updateRole({ role });
  };

  const handleConfirmRemove = () => {
    if (removingMember) {
      removeMember({});
    }
  };

  const handleConfirmLeave = () => {
    leaveTrip({});
  };

  return (
    <>
      <AppDialog
        open={open}
        onClose={onClose}
        title={t('dialogTitle')}
        description={t('dialogSubtitle')}
        icon={<GroupRoundedIcon color="primary" />}
        maxWidth="sm"
        fullWidth
      >
        <Stack spacing={2.5}>
          {!showInviteForm && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Chip
                size="small"
                label={t('memberCount', { count: members.length })}
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 700, fontSize: '11px', height: '24px' }}
              />
              {canManageMembers && (
                <AppButton
                  intent="primary"
                  startIcon={<PersonAddRoundedIcon />}
                  onClick={() => setShowInviteForm(true)}
                  sx={{ fontSize: '13px', px: 2, borderRadius: '10px' }}
                >
                  {t('inviteBtn')}
                </AppButton>
              )}
            </Box>
          )}

          {showInviteForm && (
            <InviteMemberForm
              onSubmit={handleInviteSubmit}
              onCancel={() => setShowInviteForm(false)}
              isSubmitting={isInviting}
              canAssignVice={isCurrentUserOwner}
            />
          )}

          <TripMemberList
            members={members}
            isLoading={isLoading}
            isCurrentUserOwner={isCurrentUserOwner}
            currentUserRole={currentUserRole}
            currentUserId={currentUserId}
            onEditRole={(m) => setEditingMember(m)}
            onRemove={(m) => setRemovingMember(m)}
            onLeave={() => setIsLeaving(true)}
            onAccept={handleAcceptMember}
          />
        </Stack>
      </AppDialog>

      <EditMemberRoleDialog
        key={editingMember?.id}
        open={Boolean(editingMember)}
        onClose={() => setEditingMember(null)}
        member={editingMember}
        currentUserRole={currentUserRole}
        onSubmit={handleUpdateRoleSubmit}
        isSubmitting={isUpdatingRole}
      />

      <AppConfirmDialog
        open={Boolean(removingMember)}
        title={t('actions.confirmRemoveTitle')}
        description={
          removingMember
            ? t('actions.confirmRemoveDesc', {
                name: removingMember.name,
                email: removingMember.email,
              })
            : ''
        }
        confirmText={t('actions.confirmRemoveBtn')}
        cancelText={t('cancel')}
        intent="danger"
        loading={isRemoving}
        onConfirm={handleConfirmRemove}
        onClose={() => setRemovingMember(null)}
      />

      <AppConfirmDialog
        open={isLeaving}
        title={t('actions.confirmLeaveTitle')}
        description={t('actions.confirmLeaveDesc', { tripName })}
        confirmText={t('actions.confirmLeaveBtn')}
        cancelText={t('cancel')}
        intent="danger"
        loading={isLeavingTrip}
        onConfirm={handleConfirmLeave}
        onClose={() => setIsLeaving(false)}
      />

      <AppToast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />
    </>
  );
};

export default TripMembersDialog;
