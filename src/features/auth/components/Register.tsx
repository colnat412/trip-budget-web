'use client';

import { useRouter } from 'next/navigation';
import { type FormEvent, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material';
import {
  EmailOutlined,
  LockOutlined,
  PersonOutlineOutlined,
  VisibilityOffOutlined,
  VisibilityOutlined,
  KeyOutlined,
  ArrowBackOutlined,
} from '@mui/icons-material';

import { DEFAULT_AUTH_REDIRECT_PATH } from '@/base/constants';
import { AppButton, AppTextField, AppToast } from '@/base/components/ui';
import SidebarBrand from '@/base/components/layout/sidebar/SidebarBrand';
import AppPreferences from '@/base/components/preferences/AppPreferences';
import useRegister from '@/features/auth/hooks/useRegister';
import useVerifyOtp from '@/features/auth/hooks/useVerifyOtp';
import useResendOtp from '@/features/auth/hooks/useResendOtp';
import GoogleAuthButton from './GoogleAuthButton';
import { useTranslations } from 'next-intl';

interface RegisterFormErrors {
  name?: string;
  email?: string;
  password?: string;
  otp?: string;
}

const Register = () => {
  const router = useRouter();
  const t = useTranslations();

  const [step, setStep] = useState<'REGISTER' | 'OTP'>('REGISTER');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [formErrors, setFormErrors] = useState<RegisterFormErrors>({});
  const [countdown, setCountdown] = useState(60);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const otpInputRef = useRef<HTMLInputElement>(null);

  const { registerMutation } = useRegister();
  const { verifyOtpMutation } = useVerifyOtp();
  const { resendOtpMutation } = useResendOtp();

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (step === 'OTP' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [step, countdown]);

  const handleRegisterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const nextErrors: RegisterFormErrors = {};

    if (!normalizedName) {
      nextErrors.name = t('validation.nameRequired');
    }

    if (!normalizedEmail) {
      nextErrors.email = t('validation.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      nextErrors.email = t('validation.emailInvalid');
    }

    if (!password) {
      nextErrors.password = t('validation.passwordRequired');
    } else if (password.length < 8) {
      nextErrors.password = t('validation.passwordMin');
    }

    setFormErrors(nextErrors);

    if (nextErrors.name) {
      nameInputRef.current?.focus();
      return;
    }
    if (nextErrors.email) {
      emailInputRef.current?.focus();
      return;
    }
    if (nextErrors.password) {
      passwordInputRef.current?.focus();
      return;
    }

    registerMutation.mutate(
      {
        name: normalizedName,
        email: normalizedEmail,
        password,
      },
      {
        onSuccess: () => {
          setStep('OTP');
          setCountdown(60);
          setSuccessToast(t('register.otpSentToast'));
          setTimeout(() => {
            otpInputRef.current?.focus();
          }, 200);
        },
      },
    );
  };

  const handleVerifyOtpSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanOtp = otp.trim();
    if (!cleanOtp || cleanOtp.length < 6) {
      setFormErrors({ otp: t('validation.otpRequired') });
      otpInputRef.current?.focus();
      return;
    }

    verifyOtpMutation.mutate(
      {
        email: email.trim().toLowerCase(),
        otp: cleanOtp,
      },
      {
        onSuccess: () => {
          router.push(DEFAULT_AUTH_REDIRECT_PATH);
          router.refresh();
        },
      },
    );
  };

  const handleResendOtp = () => {
    if (countdown > 0 || resendOtpMutation.isPending) return;

    resendOtpMutation.mutate(
      {
        email: email.trim().toLowerCase(),
      },
      {
        onSuccess: () => {
          setCountdown(60);
          setSuccessToast(t('register.otpResentToast'));
        },
      },
    );
  };

  const activeErrorMessage =
    registerMutation.error?.message ||
    verifyOtpMutation.error?.message ||
    resendOtpMutation.error?.message ||
    '';

  const clearAllErrors = () => {
    registerMutation.clearError();
    verifyOtpMutation.clearError();
    resendOtpMutation.clearError();
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
        open={Boolean(activeErrorMessage)}
        severity="error"
        message={activeErrorMessage}
        onClose={clearAllErrors}
      />

      <AppToast
        open={Boolean(successToast)}
        severity="success"
        message={successToast ?? ''}
        onClose={() => setSuccessToast(null)}
      />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1.15,
          flexShrink: 1,
          flexBasis: 0,
          minWidth: 0,
          minHeight: { xs: '300px', md: '100svh' },
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
            sx={{
              fontSize: '40px',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
            }}
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
            gap: '16px',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <AppPreferences />
          </Box>

          {step === 'REGISTER' ? (
            <>
              <Typography
                component="h1"
                sx={{
                  color: 'text.primary',
                  fontFamily: 'var(--font-display)',
                  fontSize: '32px',
                  fontWeight: 600,
                }}
              >
                {t('register.title')}
              </Typography>
              <Typography color="text.secondary">
                {t('register.description')}
              </Typography>

              <Stack
                component="form"
                spacing={2}
                noValidate
                onSubmit={handleRegisterSubmit}
              >
                <AppTextField
                  label={t('register.name')}
                  name="name"
                  placeholder={t('register.namePlaceholder')}
                  autoComplete="name"
                  required
                  value={name}
                  error={Boolean(formErrors.name)}
                  helperText={formErrors.name}
                  inputRef={nameInputRef}
                  disabled={registerMutation.isPending}
                  onChange={(event) => {
                    setName(event.target.value);
                    setFormErrors((current) => ({
                      ...current,
                      name: undefined,
                    }));
                    registerMutation.clearError();
                  }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutlineOutlined fontSize="small" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />

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
                  disabled={registerMutation.isPending}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setFormErrors((current) => ({
                      ...current,
                      email: undefined,
                    }));
                    registerMutation.clearError();
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
                  placeholder={t('register.passwordPlaceholder')}
                  autoComplete="new-password"
                  required
                  value={password}
                  error={Boolean(formErrors.password)}
                  helperText={formErrors.password}
                  inputRef={passwordInputRef}
                  disabled={registerMutation.isPending}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setFormErrors((current) => ({
                      ...current,
                      password: undefined,
                    }));
                    registerMutation.clearError();
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
                            onClick={() =>
                              setShowPassword((current) => !current)
                            }
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

                <AppButton
                  type="submit"
                  fullWidth
                  loading={registerMutation.isPending}
                  sx={{ minHeight: '54px', height: '54px' }}
                >
                  {t('register.submit')}
                </AppButton>
              </Stack>

              <Divider>
                <Typography variant="caption" color="text.secondary">
                  {t('login.orContinueWithEmail')}
                </Typography>
              </Divider>

              <GoogleAuthButton text="signup_with" />

              <Stack
                spacing="4px"
                direction="row"
                sx={{ justifyContent: 'center' }}
              >
                <Typography align="center" color="text.secondary">
                  {t('register.hasAccount')}
                </Typography>
                <Box
                  component={Link}
                  href="/login"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  {t('register.loginNow')}
                </Box>
              </Stack>
            </>
          ) : (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                  size="small"
                  onClick={() => {
                    setStep('REGISTER');
                    clearAllErrors();
                  }}
                  aria-label={t('register.back')}
                >
                  <ArrowBackOutlined fontSize="small" />
                </IconButton>
                <Typography
                  component="h1"
                  sx={{
                    color: 'text.primary',
                    fontFamily: 'var(--font-display)',
                    fontSize: '28px',
                    fontWeight: 600,
                  }}
                >
                  {t('register.verifyTitle')}
                </Typography>
              </Box>

              <Typography color="text.secondary">
                {t('register.verifyDescription')}{' '}
                <Box
                  component="span"
                  sx={{ fontWeight: 700, color: 'text.primary' }}
                >
                  {email}
                </Box>
                . {t('register.verifyDescriptionSuffix')}
              </Typography>

              <Stack
                component="form"
                spacing={2.5}
                noValidate
                onSubmit={handleVerifyOtpSubmit}
              >
                <AppTextField
                  label={t('register.otpLabel')}
                  name="otp"
                  placeholder="123456"
                  required
                  value={otp}
                  error={Boolean(formErrors.otp)}
                  helperText={formErrors.otp}
                  inputRef={otpInputRef}
                  disabled={verifyOtpMutation.isPending}
                  onChange={(event) => {
                    const value = event.target.value
                      .replace(/\D/g, '')
                      .slice(0, 6);
                    setOtp(value);
                    setFormErrors((current) => ({
                      ...current,
                      otp: undefined,
                    }));
                    verifyOtpMutation.clearError();
                  }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <KeyOutlined fontSize="small" />
                        </InputAdornment>
                      ),
                    },
                    htmlInput: {
                      maxLength: 6,
                      style: {
                        letterSpacing: '8px',
                        fontSize: '22px',
                        fontWeight: 700,
                        textAlign: 'center',
                      },
                    },
                  }}
                />

                <AppButton
                  type="submit"
                  fullWidth
                  loading={verifyOtpMutation.isPending}
                  sx={{ minHeight: '54px', height: '54px' }}
                >
                  {t('register.verifySubmit')}
                </AppButton>

                <Stack
                  direction="row"
                  sx={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {countdown > 0
                      ? t('register.resendCountdown', { seconds: countdown })
                      : t('register.notReceived')}
                  </Typography>

                  <AppButton
                    intent="text"
                    size="small"
                    disabled={countdown > 0 || resendOtpMutation.isPending}
                    loading={resendOtpMutation.isPending}
                    onClick={handleResendOtp}
                    sx={{ fontWeight: 700, textTransform: 'none' }}
                  >
                    {t('register.resendOtp')}
                  </AppButton>
                </Stack>
              </Stack>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Register;
