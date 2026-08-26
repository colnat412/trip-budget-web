'use client';

import { Box } from '@mui/material';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import AppSidebar from './AppSidebar';
import AppTopBar from './AppTopBar';
import CreateTripHost from './CreateTripHost';
import GlobalLoadingHost from './GlobalLoadingHost';
import { TripProvider } from '@/features/trip/context/TripContext';
import { UserProvider } from '@/features/user/context/UserContext';

export interface AppShellProps {
  children: ReactNode;
  sidebarDisabledPaths?: readonly string[];
}

export default function AppShell({
  children,
  sidebarDisabledPaths = [],
}: AppShellProps) {
  const pathname = usePathname();
  const showSidebar = !sidebarDisabledPaths.includes(pathname);

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
            minHeight: '100dvh',
          }}
        >
          <AppSidebar />
          <Box
            sx={{
              minWidth: 0,
              minHeight: '100dvh',
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
            }}
          >
            <AppTopBar />
            <Box
              component="main"
              sx={{
                minWidth: 0,
                minHeight: 0,
                flexGrow: 1,
                overflow: 'auto',
              }}
            >
              {children}
            </Box>
          </Box>
          <CreateTripHost />
          <GlobalLoadingHost />
        </Box>
      </TripProvider>
    </UserProvider>
  );
}
