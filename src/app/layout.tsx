import type { Metadata } from "next";
import { DM_Mono, DM_Serif_Display, Outfit } from "next/font/google";

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
const sidebarDisabledPaths: readonly string[] = [];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${bodyFont.variable} ${displayFont.variable} ${monoFont.variable}`}
    >
      <body>
        <AppThemeProvider>
          <AppShell sidebarDisabledPaths={sidebarDisabledPaths}>
            {children}
          </AppShell>
        </AppThemeProvider>
      </body>
    </html>
  );
}
