'use client';

import { Avatar, Chip, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

import { AppButton } from '@/base/components/ui';
import AppActionMenu, {
  type AppActionMenuItem,
} from '@/base/components/ui/AppActionMenu';
import { getUserInitials } from '@/base/utils/user';
import type { TripMember, TripMemberRole } from '../../types/member.types';
import RoleBadge from './RoleBadge';

interface TripMemberRowProps {
  member: TripMember;
  isCurrentUserOwner: boolean;
  currentUserRole?: TripMemberRole;
  currentUserId?: string | number;
  onEditRole: (member: TripMember) => void;
  onRemove: (member: TripMember) => void;
  onLeave: (member: TripMember) => void;
  onAccept?: (member: TripMember) => void;
}

const TripMemberRow = ({
  member,
  isCurrentUserOwner,
  currentUserRole,
  currentUserId,
  onEditRole,
  onRemove,
  onLeave,
  onAccept,
}: TripMemberRowProps) => {
  const t = useTranslations('members');

  const isSelf =
    currentUserId !== undefined &&
    String(member.userId) === String(currentUserId);
  const isTargetOwner = member.role === 'OWNER';
  const isTargetVice = member.role === 'VICE' || member.role === 'EDITOR';

  const canAccept =
    (isCurrentUserOwner ||
      currentUserRole === 'VICE' ||
      currentUserRole === 'EDITOR') &&
    member.status === 'INVITED';

  const canEditRole =
    !isSelf &&
    !isTargetOwner &&
    (isCurrentUserOwner ||
      ((currentUserRole === 'VICE' || currentUserRole === 'EDITOR') &&
        !isTargetVice));

  const canRemove =
    !isSelf &&
    !isTargetOwner &&
    (isCurrentUserOwner ||
      ((currentUserRole === 'VICE' || currentUserRole === 'EDITOR') &&
        !isTargetVice));

  const menuItems: AppActionMenuItem[] = [];

  if (canAccept && onAccept) {
    // Buttons will be displayed inline, so we don't add accept to menu
  }

  if (canEditRole) {
    menuItems.push({
      id: 'edit-role',
      label: t('actions.changeRole'),
      icon: <EditRoundedIcon fontSize="small" />,
      onClick: () => onEditRole(member),
    });
  }

  if (canRemove && !(canAccept && onAccept)) {
    menuItems.push({
      id: 'remove-member',
      label:
        member.status === 'INVITED'
          ? t('actions.rejectMember')
          : t('actions.removeMember'),
      icon: <DeleteOutlineRoundedIcon fontSize="small" />,
      danger: true,
      onClick: () => onRemove(member),
    });
  }

  if (isSelf && !isCurrentUserOwner) {
    menuItems.push({
      id: 'leave-trip',
      label: t('actions.leaveTrip'),
      icon: <LogoutRoundedIcon fontSize="small" />,
      danger: true,
      onClick: () => onLeave(member),
    });
  }

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: { xs: 'wrap', sm: 'nowrap' },
        p: 2,
        borderRadius: '16px',
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        transition: 'all 0.2s ease',
        '&:hover': {
          bgcolor: 'action.hover',
          borderColor: 'primary.light',
        },
      }}
    >
      <Stack
        direction="row"
        spacing={1.5}
        sx={{ alignItems: 'center', minWidth: 0, flex: 1 }}
      >
        <Avatar
          src={member.avatarUrl || undefined}
          alt={member.name}
          sx={{
            width: 42,
            height: 42,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            fontWeight: 800,
            fontSize: '14px',
            border: 2,
            borderColor: 'background.paper',
            flexShrink: 0,
          }}
        >
          {getUserInitials(member.name || member.email)}
        </Avatar>

        <Stack spacing={0.25} sx={{ minWidth: 0, flex: 1 }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: 'center', minWidth: 0 }}
          >
            <Typography
              noWrap
              sx={{
                fontWeight: 700,
                fontSize: '14px',
                color: 'text.primary',
                flexShrink: 1,
              }}
            >
              {member.name}
            </Typography>
            {member.status !== 'ACTIVE' && (
              <Chip
                size="small"
                label={t(`statuses.${member.status}`)}
                color={member.status === 'INVITED' ? 'warning' : 'default'}
                sx={{
                  height: '20px',
                  fontSize: '10px',
                  fontWeight: 600,
                  borderRadius: '6px',
                  flexShrink: 0,
                }}
              />
            )}
          </Stack>
          <Typography
            noWrap
            sx={{
              fontSize: '12px',
              color: 'text.secondary',
            }}
          >
            {member.email}
          </Typography>
        </Stack>
      </Stack>

      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: 'center', flexShrink: 0 }}
      >
        {canAccept && onAccept && (
          <>
            <AppButton
              intent="primary"
              size="small"
              onClick={() => onAccept(member)}
              sx={{
                minWidth: 0,
                minHeight: 0,
                height: 24,
                // padding: '0 8px',
                fontSize: '12px',
                fontWeight: 700,
                borderRadius: '8px',
              }}
            >
              {t('actions.acceptBtn')}
            </AppButton>
            <AppButton
              intent="danger"
              size="small"
              onClick={() => onRemove(member)}
              sx={{
                minWidth: 0,
                minHeight: 0,
                height: 24,
                padding: '0 8px',
                fontSize: '12px',
                fontWeight: 700,
                borderRadius: '8px',
              }}
            >
              {t('actions.rejectMember')}
            </AppButton>
          </>
        )}
        <RoleBadge role={member.role} />
        {menuItems.length > 0 && <AppActionMenu items={menuItems} />}
      </Stack>
    </Stack>
  );
};

export default TripMemberRow;
