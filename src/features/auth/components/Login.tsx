'use client';

import { useRouter } from 'next/navigation';
import { type FormEvent, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material';
import {
  EmailOutlined,
  LockOutlined,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from '@mui/icons-material';

import { DEFAULT_AUTH_REDIRECT_PATH } from '@/base/constants';
import { AppButton, AppTextField, AppToast } from '@/base/components/ui';
import SidebarBrand from '@/base/components/layout/sidebar/SidebarBrand';
import useLogin from '@/features/auth/hooks/useLogin';
import AppPreferences from '@/base/components/preferences/AppPreferences';
import { useTranslations } from 'next-intl';

interface LoginFormErrors {
  email?: string;
  password?: string;
}

const Login = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [formErrors, setFormErrors] = useState<LoginFormErrors>({});
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const { loginMutation } = useLogin();
  const t = useTranslations();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    const nextErrors: LoginFormErrors = {};

    if (!normalizedEmail) {
      nextErrors.email = t('validation.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      nextErrors.email = t('validation.emailInvalid');
    }

    if (!password) {
      nextErrors.password = t('validation.passwordRequired');
    }

    setFormErrors(nextErrors);

    if (nextErrors.email) {
      emailInputRef.current?.focus();
      return;
    }

    if (nextErrors.password) {
      passwordInputRef.current?.focus();
      return;
    }

    loginMutation.mutate(
      {
        email: normalizedEmail,
        password,
        rememberMe,
      },
      {
        onSuccess: () => {
          router.push(DEFAULT_AUTH_REDIRECT_PATH);
          router.refresh();
        },
        onError: () => {
          passwordInputRef.current?.focus();
        },
      },
    );
  };

  return (
    <Box
      component="section"
      sx={{
        minHeight: '100svh',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        bgcolor: 'background.paper',
      }}
    >
      <AppToast
        open={Boolean(loginMutation.error)}
        severity="error"
        message={loginMutation.error?.message ?? ''}
        onClose={loginMutation.clearError}
      />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1.15,
          flexShrink: 1,
          flexBasis: 0,
          minWidth: 0,
          minHeight: { xs: '340px', md: '100svh' },
          overflow: 'hidden',
          bgcolor: 'primary.dark',
          justifyContent: 'space-between',
          p: { xs: 3, md: 4 },
          color: 'common.white',
          backgroundImage:
            'linear-gradient(180deg, rgba(6, 28, 68, 0.48) 0%, rgba(6, 28, 68, 0.08) 42%, rgba(6, 28, 68, 0.78) 100%), url("/login-travel.svg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '& .MuiTypography-root': { color: 'inherit' },
        }}
      >
        <SidebarBrand />

        <Stack spacing={1} sx={{ maxWidth: 560 }}>
          <Typography
            component="p"
            sx={{ fontSize: '40px', fontFamily: 'var(--font-display)' }}
          >
            {t('login.slogan')}
          </Typography>
          <Typography
            sx={{ color: 'rgba(255,255,255,.82) !important', fontSize: '16px' }}
          >
            {t('login.sloganDescription')}
          </Typography>
        </Stack>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexGrow: 0.85,
          flexShrink: 1,
          flexBasis: 0,
          minWidth: { xs: 0, md: '440px' },
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, sm: 5 },
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 480,
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <AppPreferences />
          </Box>
          <Typography
            component="h1"
            sx={{
              color: 'text.primary',
              fontFamily: 'var(--font-display)',
              fontSize: '32px',
              fontWeight: 600,
            }}
          >
            {t('login.title')}
          </Typography>
          <Typography color="text.secondary">
            {t('login.description')}
          </Typography>

          <Stack
            component="form"
            spacing={2}
            noValidate
            onSubmit={handleSubmit}
          >
            <AppTextField
              label={t('login.email')}
              name="email"
              type="email"
              placeholder="user@example.com"
              autoComplete="email"
              required
              value={email}
              error={Boolean(formErrors.email)}
              helperText={formErrors.email}
              inputRef={emailInputRef}
              disabled={loginMutation.isPending}
              onChange={(event) => {
                setEmail(event.target.value);
                setFormErrors((current) => ({
                  ...current,
                  email: undefined,
                }));
                loginMutation.clearError();
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <AppTextField
              label={t('login.password')}
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder={t('login.passwordPlaceholder')}
              autoComplete="current-password"
              required
              value={password}
              error={Boolean(formErrors.password)}
              helperText={formErrors.password}
              inputRef={passwordInputRef}
              disabled={loginMutation.isPending}
              onChange={(event) => {
                setPassword(event.target.value);
                setFormErrors((current) => ({
                  ...current,
                  password: undefined,
                }));
                loginMutation.clearError();
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showPassword
                            ? t('login.hidePassword')
                            : t('login.showPassword')
                        }
                        edge="end"
                        onClick={() => setShowPassword((current) => !current)}
                      >
                        {showPassword ? (
                          <VisibilityOffOutlined />
                        ) : (
                          <VisibilityOutlined />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Stack
              sx={{ alignItems: 'center', justifyContent: 'space-between' }}
              direction={'row'}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={rememberMe}
                    disabled={loginMutation.isPending}
                    onChange={(event) => setRememberMe(event.target.checked)}
                  />
                }
                label={t('login.rememberMe')}
                sx={{
                  '& .MuiFormControlLabel-label': { fontSize: '14px' },
                }}
              />
              <Typography
                component={Link}
                href="#"
                sx={{
                  color: 'primary.main',
                  fontSize: '14px',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}
              >
                {t('login.forgotPassword')}
              </Typography>
            </Stack>

            <AppButton
              type="submit"
              fullWidth
              loading={loginMutation.isPending}
              sx={{ minHeight: 54 }}
            >
              {t('login.submit')}
            </AppButton>
          </Stack>
          <Stack
            spacing={'4px'}
            direction={'row'}
            sx={{ justifyContent: 'center' }}
          >
            <Typography align="center" color="text.secondary">
              {t('login.noAccount')}
            </Typography>
            <Box
              component={Link}
              href="#"
              sx={{ color: 'primary.main', fontWeight: 700 }}
            >
              {t('login.createAccount')}
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
