import type { Metadata } from 'next';
import { Comfortaa, DM_Mono } from 'next/font/google';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';

import { AppShell } from '@/base/components/layout';
import AppThemeProvider from '@/base/providers/AppThemProvider';

import './globals.css';

const comfortaa = Comfortaa({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  variable: '--font-comfortaa',
  display: 'swap',
});

const monoFont = DM_Mono({
  weight: ['400', '500'],
  subsets: ['latin', 'latin-ext'],
  variable: '--font-dm-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Trip Budget Plan',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/apple-icon.png',
  },
};

export const viewport: import('next').Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// add path name to hide sidebar here
const sidebarDisabledPaths: readonly string[] = ['/login'];

const RootLayout = async ({ children }: LayoutProps<'/'>) => {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${comfortaa.variable} ${monoFont.variable}`}
    >
      <body>
        <InitColorSchemeScript attribute="data" defaultMode="light" />
        <NextIntlClientProvider>
          <AppThemeProvider>
            <AppShell sidebarDisabledPaths={sidebarDisabledPaths}>
              {children}
            </AppShell>
          </AppThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
