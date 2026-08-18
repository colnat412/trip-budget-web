import type { Metadata } from "next";
import { DM_Mono, DM_Serif_Display, Outfit } from "next/font/google";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";

import { AppShell } from "@/base/components/layout";
import AppThemeProvider from "@/base/providers/AppThemProvider";

import "./globals.css";

const bodyFont = Outfit({
  subsets: ["latin", "latin-ext"],
  variable: "--font-outfit",
  display: "swap",
});

const displayFont = DM_Serif_Display({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  variable: "--font-dm-serif-display",
  display: "swap",
});

const monoFont = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Trip Budget",
};

// add path name to hide sidebar here
const sidebarDisabledPaths: readonly string[] = ["/login"];

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${bodyFont.variable} ${displayFont.variable} ${monoFont.variable}`}
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
}
