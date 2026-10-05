'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import { DEFAULT_AUTH_REDIRECT_PATH } from '@/base/constants';
import useGoogleLogin from '../hooks/useGoogleLogin';
import { AppButton, AppToast } from '@/base/components/ui';
import { GoogleIcon } from '@/base/components/icons';
import { useTranslations } from 'next-intl';

interface TokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  error?: string;
  error_description?: string;
  error_uri?: string;
}

interface TokenClient {
  requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
}

interface GoogleOAuth2 {
  initTokenClient: (config: {
    client_id: string;
    scope: string;
    callback: (response: TokenResponse) => void;
    error_callback?: (error: unknown) => void;
  }) => TokenClient;
}

declare global {
  interface Window {
    google?: {
      accounts?: {
        oauth2?: GoogleOAuth2;
      };
    };
  }
}

interface GoogleAuthButtonProps {
  text?: 'signin_with' | 'signup_with' | 'continue_with';
}

const GoogleAuthButton = ({ text = 'signin_with' }: GoogleAuthButtonProps) => {
  const router = useRouter();
  const t = useTranslations();
  const { googleLoginMutation } = useGoogleLogin();
  const [scriptLoaded, setScriptLoaded] = useState(
    () =>
      typeof window !== 'undefined' && Boolean(window.google?.accounts?.oauth2),
  );
  const tokenClientRef = useRef<TokenClient | null>(null);

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // Initialize or retrieve Google Token Client
  const getOrCreateTokenClient = useCallback(() => {
    if (tokenClientRef.current) {
      return tokenClientRef.current;
    }

    if (!window.google?.accounts?.oauth2 || !clientId) {
      return null;
    }

    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'openid email profile',
      callback: (response: TokenResponse) => {
        if (response.error) {
          console.error('Google OAuth error:', response.error);
          return;
        }

        if (response.access_token) {
          googleLoginMutation.mutate(
            { credential: response.access_token },
            {
              onSuccess: () => {
                router.push(DEFAULT_AUTH_REDIRECT_PATH);
                router.refresh();
              },
            },
          );
        }
      },
    });

    tokenClientRef.current = client;
    return client;
  }, [clientId, googleLoginMutation, router]);

  // Load Google Identity Services script once
  useEffect(() => {
    if (!clientId) return;

    if (window.google?.accounts?.oauth2) {
      getOrCreateTokenClient();
      return;
    }

    const scriptId = 'google-gsi-client';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    const handleLoad = () => {
      setScriptLoaded(true);
      getOrCreateTokenClient();
    };

    script.addEventListener('load', handleLoad);
    return () => {
      script?.removeEventListener('load', handleLoad);
    };
  }, [clientId, getOrCreateTokenClient]);

  const handleClick = () => {
    const client = getOrCreateTokenClient();
    if (client) {
      client.requestAccessToken();
    }
  };

  if (!clientId) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          minHeight: '54px',
          border: '1px dashed',
          borderColor: 'divider',
          borderRadius: '12px',
        }}
      >
        <Typography variant="caption" color="text.secondary">
          {t('register.googleMissingClientId')}
        </Typography>
      </Box>
    );
  }

  const buttonLabel =
    text === 'signup_with'
      ? t('register.googleSignUp')
      : t('login.googleSignIn');

  return (
    <>
      <AppToast
        open={Boolean(googleLoginMutation.error)}
        severity="error"
        message={
          googleLoginMutation.error?.message ?? t('login.googleLoginError')
        }
        onClose={googleLoginMutation.clearError}
      />

      <Box
        sx={{
          display: 'flex',
          width: '100%',
        }}
      >
        <AppButton
          intent="secondary"
          fullWidth
          disabled={!scriptLoaded || googleLoginMutation.isPending}
          loading={googleLoginMutation.isPending}
          startIcon={<GoogleIcon />}
          onClick={handleClick}
          sx={{
            minHeight: '54px',
            height: '54px',
            borderRadius: '12px',
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            color: 'text.primary',
            fontWeight: 600,
            fontSize: '15px',
            textTransform: 'none',
            '&:hover': {
              bgcolor: 'action.hover',
              borderColor: 'text.secondary',
            },
          }}
        >
          {buttonLabel}
        </AppButton>
      </Box>
    </>
  );
};

export default GoogleAuthButton;
