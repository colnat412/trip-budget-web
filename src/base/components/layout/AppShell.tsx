'use client';

import { Box } from '@mui/material';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

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
          <AppSidebar />
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
            <AppTopBar />
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
