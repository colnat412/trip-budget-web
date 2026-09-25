'use client';

import { Box, Stack } from '@mui/material';
import { usePathname } from 'next/navigation';

import { DEFAULT_SIDEBAR_MENU } from './sidebar/config';
import SidebarBrand from './sidebar/SidebarBrand';
import SidebarMenu from './sidebar/SidebarMenu';
import SidebarTripCard from './sidebar/SidebarTripCard';
import SidebarUser from './sidebar/SidebarUser';
import type { AppSidebarProps } from './sidebar/types';
import { useTranslations } from 'next-intl';
import { useUserContext } from '@/features/user/context/UserContext';
import type { UserProfile } from '@/features/auth/types';
import AppPreferences from '../preferences/AppPreferences';

export type {
  AppSidebarProps,
  SidebarMenuItem as AppSidebarMenuItem,
  SidebarTrip,
  SidebarTripMember,
  SidebarUser,
} from './sidebar/types';

const AppSidebar = ({
  activeMenuId,
  menuItems = DEFAULT_SIDEBAR_MENU,
  currentUser: customUser,
  onMenuChange,
  onClose,
  sx,
}: AppSidebarProps) => {
  const t = useTranslations('sidebar');
  const pathname = usePathname();
  const { user: contextUser } = useUserContext();
  const currentUser =
    customUser ??
    (contextUser as { data?: UserProfile })?.data ??
    contextUser ??
    undefined;

  const routeMenuItem = menuItems.find(
    (item) =>
      (pathname === '/' && item.id === 'overview') ||
      pathname === item.href ||
      pathname.startsWith(`${item.href}/`),
  );
  const selectedMenuId = activeMenuId ?? routeMenuItem?.id ?? '';

  const handleMenuChange = (id: string) => {
    onMenuChange?.(id);
    onClose?.();
  };

  return (
    <Box
      component="aside"
      sx={{
        width: 240,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        borderRight: 1,
        borderColor: 'divider',
        overflow: 'hidden',
        ...sx,
      }}
    >
      <Box sx={{ p: 2 }}>
        <SidebarBrand />
      </Box>

      <Box sx={{ p: 1 }}>
        <SidebarTripCard />
      </Box>

      <Box
        component="nav"
        aria-label={t('navigation')}
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 1,
        }}
      >
        <SidebarMenu
          items={menuItems}
          selectedId={selectedMenuId}
          onChange={handleMenuChange}
        />
      </Box>

      <Stack
        spacing={2}
        sx={{
          borderTop: 1,
          borderColor: 'divider',
          p: 2,
        }}
      >
        <SidebarUser user={currentUser} />
        <AppPreferences />
      </Stack>
    </Box>
  );
};

export default AppSidebar;
