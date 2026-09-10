'use client';

import { Avatar, Chip, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

import AppActionMenu, {
  type AppActionMenuItem,
} from '@/base/components/ui/AppActionMenu';
import { getUserInitials } from '@/base/utils/user';
import type { TripMember } from '../../types/member.types';
import RoleBadge from './RoleBadge';

interface TripMemberRowProps {
  member: TripMember;
  isCurrentUserOwner: boolean;
  currentUserId?: string | number;
  onEditRole: (member: TripMember) => void;
  onRemove: (member: TripMember) => void;
  onLeave: (member: TripMember) => void;
}

export default function TripMemberRow({
  member,
  isCurrentUserOwner,
  currentUserId,
  onEditRole,
  onRemove,
  onLeave,
}: TripMemberRowProps) {
  const t = useTranslations('members');

  const menuItems: AppActionMenuItem[] = [];

  if (isCurrentUserOwner && member.role !== 'OWNER') {
    menuItems.push({
      id: 'edit-role',
      label: t('actions.changeRole'),
      icon: <EditRoundedIcon fontSize="small" />,
      onClick: () => onEditRole(member),
    });
    menuItems.push({
      id: 'remove-member',
      label: t('actions.removeMember'),
      icon: <DeleteOutlineRoundedIcon fontSize="small" />,
      danger: true,
      onClick: () => onRemove(member),
    });
  }

  if (
    !isCurrentUserOwner &&
    currentUserId !== undefined &&
    String(member.userId) === String(currentUserId)
  ) {
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
        sx={{ alignItems: 'center', minWidth: 0 }}
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
          }}
        >
          {getUserInitials(member.name || member.email)}
        </Avatar>

        <Stack spacing={0.25} sx={{ minWidth: 0 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Typography
              noWrap
              sx={{
                fontWeight: 700,
                fontSize: '14px',
                color: 'text.primary',
              }}
            >
              {member.name}
            </Typography>
            {member.status !== 'ACTIVE' && (
              <Chip
                size="small"
                label={t(`statuses.${member.status}`)}
                color="default"
                sx={{
                  height: '20px',
                  fontSize: '10px',
                  fontWeight: 600,
                  borderRadius: '6px',
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
        <RoleBadge role={member.role} />
        {menuItems.length > 0 && <AppActionMenu items={menuItems} />}
      </Stack>
    </Stack>
  );
}
