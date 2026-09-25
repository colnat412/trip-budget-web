'use client';

import { Box, Drawer } from '@mui/material';
import { usePathname } from 'next/navigation';
import React, { useState, type ReactNode } from 'react';

import AppSidebar from './AppSidebar';
import AppTopBar from './AppTopBar';
import CreateTripHost from './CreateTripHost';
import TripMembersHost from './TripMembersHost';
import GlobalLoadingHost from './GlobalLoadingHost';
import { TripProvider } from '@/features/trip/context/TripContext';
import { UserProvider } from '@/features/user/context/UserContext';

export interface AppShellProps {
  children: ReactNode;
  sidebarDisabledPaths?: readonly string[];
}

const AppShell = ({ children, sidebarDisabledPaths = [] }: AppShellProps) => {
  const pathname = usePathname();
  const showSidebar = !sidebarDisabledPaths.includes(pathname);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  if (!showSidebar) {
    return <>{children}</>;
  }

  return (
    <UserProvider>
      <TripProvider>
        <Box
          sx={{
            display: 'flex',
            bgcolor: 'background.paper',
            height: '100dvh',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              flexShrink: 0,
            }}
          >
            <AppSidebar />
          </Box>

          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerClose}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: 250,
                borderRight: 1,
                borderColor: 'divider',
              },
            }}
          >
            <AppSidebar
              onClose={handleDrawerClose}
              sx={{ width: '100%', borderRight: 0 }}
            />
          </Drawer>

          <Box
            sx={{
              minWidth: 0,
              height: '100dvh',
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              overflow: 'hidden',
            }}
          >
            <AppTopBar onToggleMobileMenu={handleDrawerToggle} />
            <Box
              component="main"
              sx={{
                minWidth: 0,
                minHeight: 0,
                flexGrow: 1,
                overflowY: 'auto',
              }}
            >
              {children}
            </Box>
          </Box>
          <CreateTripHost />
          <TripMembersHost />
          <GlobalLoadingHost />
        </Box>
      </TripProvider>
    </UserProvider>
  );
};

export default AppShell;
