'use client';

import { useState, type MouseEvent } from 'react';
import {
  Avatar,
  Box,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import UnfoldMoreRoundedIcon from '@mui/icons-material/UnfoldMoreRounded';
import { useRouter } from 'next/navigation';

import useLogout from '@/features/auth/hooks/useLogout';
import { useUserContext } from '@/features/user/context/UserContext';
import { getUserInitials } from '@/base/utils';
import ProfileDialog from '@/features/user/components/ProfileDialog';
import SidebarUserMenu from './SidebarUserMenu';
import type { SidebarUser as SidebarUserData } from './types';
import type { UserProfile } from '@/features/auth/types';

export interface SidebarUserProps {
  user?: Partial<SidebarUserData> | UserProfile;
}

const SidebarUser = ({ user: defaultUser }: SidebarUserProps) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user: currentUser, isLoading } = useUserContext();
  const { logoutMutation } = useLogout();

  const rawUser =
    (defaultUser as { data?: UserProfile })?.data ??
    defaultUser ??
    (currentUser as { data?: UserProfile })?.data ??
    currentUser;

  const displayName = rawUser?.name || 'User';
  const displayEmailOrRole = rawUser?.role || 'Member';
  const displayInitials = getUserInitials(rawUser?.name);
  const avatarSrc = rawUser?.avatarUrl || '/avatar.jpg';

  const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleCloseMenu();
    logoutMutation.mutate(
      {},
      {
        onSuccess: () => {
          router.push('/login');
          router.refresh();
        },
      },
    );
  };

  if (isLoading && !currentUser) {
    return (
      <Stack
        direction="row"
        spacing={1.25}
        sx={{
          height: '100%',
          alignItems: 'center',
          px: 1,
          py: 0.75,
        }}
      >
        <Skeleton variant="circular" width={36} height={36} />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Skeleton variant="text" width="60%" height={16} />
          <Skeleton variant="text" width="80%" height={12} />
        </Box>
      </Stack>
    );
  }

  return (
    <>
      <Stack
        direction="row"
        spacing={1.25}
        onClick={handleOpenMenu}
        sx={{
          height: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 1,
          py: 0.75,
          borderRadius: '12px',
          cursor: 'pointer',
          transition: 'background-color 0.15s ease',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <Stack
          direction="row"
          spacing={1.25}
          sx={{ alignItems: 'center', minWidth: 0 }}
        >
          <Avatar
            src={avatarSrc}
            sx={{
              width: 36,
              height: 36,
              bgcolor: 'primary.light',
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {displayInitials}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="body2"
              noWrap
              sx={{ fontWeight: 800, color: 'text.primary', fontSize: '13px' }}
            >
              {displayName}
            </Typography>
            <Typography
              variant="caption"
              noWrap
              sx={{
                display: 'block',
                color: 'text.secondary',
                fontSize: '11px',
              }}
            >
              {displayEmailOrRole}
            </Typography>
          </Box>
        </Stack>

        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenMenu(e);
          }}
          sx={{ color: 'text.secondary', p: 0.5 }}
        >
          <UnfoldMoreRoundedIcon sx={{ fontSize: '16px' }} />
        </IconButton>
      </Stack>

      <SidebarUserMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        onOpenProfile={() => setProfileOpen(true)}
        onLogout={handleLogout}
        isLoggingOut={logoutMutation.isPending}
      />

      <ProfileDialog
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        user={rawUser ?? undefined}
      />
    </>
  );
};

export default SidebarUser;
