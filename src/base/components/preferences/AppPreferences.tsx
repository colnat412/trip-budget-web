'use client';

import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import {
  IconButton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { axiosPut } from '@/base/api';
import { AppToast } from '@/base/components/ui';
import type { AppLocale } from '@/i18n/config';

const AppPreferences = () => {
  const t = useTranslations('preferences');
  const locale = useLocale();
  const router = useRouter();
  const [isChangingLocale, startLocaleTransition] = useTransition();
  const [showLocaleError, setShowLocaleError] = useState(false);
  const { mode, setMode } = useColorScheme();
  const isDarkMode = mode === 'dark';

  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      {showLocaleError && (
        <AppToast
          open
          severity="error"
          message={t('changeError')}
          onClose={() => setShowLocaleError(false)}
        />
      )}
      <ToggleButtonGroup
        exclusive
        size="small"
        value={locale}
        disabled={isChangingLocale}
        aria-label={t('language')}
        onChange={(_event, value: AppLocale | null) => {
          if (!value || value === locale) return;

          window.dispatchEvent(
            new CustomEvent('localeChange', { detail: value }),
          );

          startLocaleTransition(async () => {
            try {
              await axiosPut<{ locale: AppLocale }, { locale: AppLocale }>(
                '/preferences/locale',
                { locale: value },
              );
              router.refresh();
            } catch {
              setShowLocaleError(true);
            }
          });
        }}
        sx={{
          bgcolor: 'action.hover',
          '& .MuiToggleButton-root': {
            minWidth: 42,
            minHeight: 34,
            px: 1,
            borderColor: 'divider',
            color: 'text.secondary',
            fontSize: '12px',
            fontWeight: 800,
            '&.Mui-selected': {
              bgcolor: 'background.paper',
              color: 'primary.main',
            },
          },
        }}
      >
        <ToggleButton value="vi">VNI</ToggleButton>
        <ToggleButton value="en">ENG</ToggleButton>
      </ToggleButtonGroup>

      <Tooltip title={isDarkMode ? t('light') : t('dark')}>
        <IconButton
          aria-label={isDarkMode ? t('light') : t('dark')}
          onClick={() => setMode(isDarkMode ? 'light' : 'dark')}
          sx={{
            width: 36,
            height: 36,
            border: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
            color: 'text.primary',
          }}
        >
          {isDarkMode ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
        </IconButton>
      </Tooltip>
    </Stack>
  );
};

export default AppPreferences;
