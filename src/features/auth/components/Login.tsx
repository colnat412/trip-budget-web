'use client';

import { type FormEvent, useRef, useState } from 'react';
import Image from 'next/image';
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

import { AppButton, AppTextField, AppToast } from '@/base/components/ui';
import SidebarBrand from '@/base/components/layout/sidebar/SidebarBrand';
import useLogin from '@/features/auth/hooks/useLogin';

interface LoginFormErrors {
  email?: string;
  password?: string;
}

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [formErrors, setFormErrors] = useState<LoginFormErrors>({});
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const { loginMutation } = useLogin();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    const nextErrors: LoginFormErrors = {};

    if (!normalizedEmail) {
      nextErrors.email = 'Please enter the email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      nextErrors.email = 'Invalid email format.';
    }

    if (!password) {
      nextErrors.password = 'Please enter the password.';
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
          console.error('SUCCESS');
        },
        onError: () => {
          console.error('ERROR');
        },
      },
    );
  };

  return (
    <Box
      component="section"
      sx={{
        minHeight: '100svh',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.15fr) minmax(440px, 0.85fr)',
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
          position: 'relative',
          overflow: 'hidden',
          // borderRadius: 4,
          bgcolor: 'primary.dark',
        }}
      >
        <Image
          src="/login-travel.svg"
          alt="Image"
          fill
          preload
          style={{ objectFit: 'cover' }}
        />

        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: 4,
            color: 'common.white',
            background:
              'linear-gradient(180deg, rgba(6, 28, 68, 0.48) 0%, rgba(6, 28, 68, 0.08) 42%, rgba(6, 28, 68, 0.78) 100%)',
            '& .MuiTypography-root': {
              color: 'inherit',
            },
          }}
        >
          <Stack>
            <SidebarBrand />
          </Stack>

          <Box sx={{ maxWidth: 560 }}>
            <Typography
              component="p"
              sx={{
                fontSize: '40px',
                fontFamily: 'var(--font-display)',
              }}
            >
              Go further, spend smarter.
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255,255,255,.82) !important',
                fontSize: '16px',
              }}
            >
              Plan your budget and fully enjoy every journey.
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
          <Typography
            component="h1"
            sx={{
              color: 'text.primary',
              fontFamily: 'var(--font-display)',
              fontSize: '32px',
              fontWeight: 600,
            }}
          >
            Welcome back
          </Typography>
          <Typography color="text.secondary">
            Sign in to continue managing your trips.
          </Typography>

          <Stack
            component="form"
            spacing={2}
            noValidate
            onSubmit={handleSubmit}
          >
            <AppTextField
              label="Email"
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
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter the password"
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
                          showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'
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
                label="Remember me"
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
                Forgot password?
              </Typography>
            </Stack>

            <AppButton
              type="submit"
              fullWidth
              loading={loginMutation.isPending}
              sx={{ minHeight: 54 }}
            >
              Login
            </AppButton>
          </Stack>
          <Stack
            spacing={'4px'}
            direction={'row'}
            sx={{ justifyContent: 'center' }}
          >
            <Typography align="center" color="text.secondary">
              {"Don't have an account yet?"}
            </Typography>
            <Box
              component={Link}
              href="#"
              sx={{ color: 'primary.main', fontWeight: 700 }}
            >
              Create an account
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
