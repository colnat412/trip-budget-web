'use client';

import { Chip } from '@mui/material';
import { useTranslations } from 'next-intl';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';

import type { TripMemberRole } from '../../types/member.types';

interface RoleBadgeProps {
  role: TripMemberRole;
}

const RoleBadge = ({ role }: RoleBadgeProps) => {
  const t = useTranslations('members.roles');

  const config = {
    OWNER: {
      color: 'warning' as const,
      icon: <SecurityRoundedIcon sx={{ fontSize: '14px' }} />,
    },
    VICE: {
      color: 'secondary' as const,
      icon: <SecurityRoundedIcon sx={{ fontSize: '14px' }} />,
    },
    EDITOR: {
      color: 'info' as const,
      icon: <EditRoundedIcon sx={{ fontSize: '14px' }} />,
    },
    MEMBER: {
      color: 'success' as const,
      icon: <GroupRoundedIcon sx={{ fontSize: '14px' }} />,
    },
    VIEWER: {
      color: 'default' as const,
      icon: <VisibilityRoundedIcon sx={{ fontSize: '14px' }} />,
    },
  }[role] || {
    color: 'default' as const,
    icon: <GroupRoundedIcon sx={{ fontSize: '14px' }} />,
  };

  return (
    <Chip
      size="small"
      icon={config.icon}
      label={t(role)}
      color={config.color}
      variant={role === 'OWNER' || role === 'VICE' ? 'filled' : 'outlined'}
      sx={{
        fontWeight: 700,
        fontSize: '12px',
        borderRadius: '8px',
        height: '24px',
      }}
    />
  );
};

export default RoleBadge;
