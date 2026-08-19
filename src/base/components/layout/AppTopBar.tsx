'use client';

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import { Box, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

import { AppButton } from '@/base/components/ui';

const PAGE_MESSAGE_KEYS = {
  '/': 'overview',
  '/overview': 'overview',
  '/expenses': 'expenses',
  '/scan': 'scan',
  '/settlement': 'settlement',
  '/ai': 'ai',
} as const;

export default function AppTopBar() {
  const pathname = usePathname();
  const t = useTranslations('topBar');
  const tPageTitle = useTranslations('sidebar');
  const matchedPath = Object.keys(PAGE_MESSAGE_KEYS).find(
    (path) =>
      pathname === path ||
      (path !== '/' && pathname.startsWith(`${path}/`)),
  ) as keyof typeof PAGE_MESSAGE_KEYS | undefined;
  const titleKey = matchedPath ? PAGE_MESSAGE_KEYS[matchedPath] : 'overview';
  const pageTitle = titleKey === 'ai' ? 'AI' : tPageTitle(titleKey);

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
        <HomeRoundedIcon sx={{ color: 'primary.main', fontSize: '20px' }} />
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
          startIcon={<AddRoundedIcon />}
          sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
        >
          {t('addExpense')}
        </AppButton>
        <AppButton
          size="small"
          intent="secondary"
          startIcon={<PersonAddAltRoundedIcon />}
        >
          <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>
            {t('inviteMember')}
          </Box>
        </AppButton>
      </Stack>
    </Box>
  );
}
