'use client';

import React from 'react';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import DocumentScannerRoundedIcon from '@mui/icons-material/DocumentScannerRounded';
import FlightTakeoffRoundedIcon from '@mui/icons-material/FlightTakeoffRounded';
import HandshakeRoundedIcon from '@mui/icons-material/HandshakeRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import SavingsRoundedIcon from '@mui/icons-material/SavingsRounded';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';
import { Box, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

import { AppButton } from '@/base/components/ui';
import { useTripContext } from '@/features/trip/context/TripContext';

const PAGE_MESSAGE_KEYS = {
  '/': 'overview',
  '/overview': 'overview',
  '/trips': 'trips',
  '/plan': 'plan',
  '/expenses': 'expenses',
  '/scan': 'scan',
  '/settlement': 'settlement',
  '/ai': 'ai',
} as const;

const PAGE_ICONS: Record<string, React.ReactNode> = {
  overview: (
    <HomeRoundedIcon sx={{ color: 'primary.main', fontSize: '20px' }} />
  ),
  trips: (
    <FlightTakeoffRoundedIcon
      sx={{ color: 'primary.main', fontSize: '20px' }}
    />
  ),
  plan: (
    <CalendarMonthRoundedIcon
      sx={{ color: 'primary.main', fontSize: '20px' }}
    />
  ),
  expenses: (
    <SavingsRoundedIcon sx={{ color: 'primary.main', fontSize: '20px' }} />
  ),
  scan: (
    <DocumentScannerRoundedIcon
      sx={{ color: 'primary.main', fontSize: '20px' }}
    />
  ),
  settlement: (
    <HandshakeRoundedIcon sx={{ color: 'primary.main', fontSize: '20px' }} />
  ),
  ai: <SmartToyRoundedIcon sx={{ color: 'primary.main', fontSize: '20px' }} />,
};

const AppTopBar = () => {
  const pathname = usePathname();
  const t = useTranslations('topBar');
  const tPageTitle = useTranslations('sidebar');
  const tTrip = useTranslations('trip');
  const { openCreateTrip, openMembers, activeTrip } = useTripContext();

  const matchedPath = Object.keys(PAGE_MESSAGE_KEYS).find(
    (path) =>
      pathname === path || (path !== '/' && pathname.startsWith(`${path}/`)),
  ) as keyof typeof PAGE_MESSAGE_KEYS | undefined;
  const titleKey = matchedPath ? PAGE_MESSAGE_KEYS[matchedPath] : 'overview';
  const pageTitle = titleKey === 'ai' ? 'AI' : tPageTitle(titleKey);
  const pageIcon = PAGE_ICONS[titleKey] ?? PAGE_ICONS.overview;

  return (
    <Box
      component="header"
      sx={{
        minHeight: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        px: { xs: 2, md: 3 },
        py: 1,
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: 'center', minWidth: 0 }}
      >
        {pageIcon}
        <Typography
          component="h1"
          sx={{
            color: 'text.primary',
            fontSize: '18px',
            fontWeight: 800,
            whiteSpace: 'nowrap',
          }}
        >
          {pageTitle}
        </Typography>
      </Stack>

      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: 'center', flexShrink: 0 }}
      >
        <AppButton
          size="small"
          intent="primary"
          startIcon={<FlightTakeoffRoundedIcon />}
          onClick={openCreateTrip}
          sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
        >
          {tTrip('createTrip')}
        </AppButton>

        <AppButton
          size="small"
          intent="secondary"
          startIcon={<PersonAddAltRoundedIcon />}
          onClick={() => openMembers(true)}
          disabled={!activeTrip}
        >
          <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>
            {t('inviteMember')}
          </Box>
        </AppButton>
      </Stack>
    </Box>
  );
};

export default AppTopBar;
