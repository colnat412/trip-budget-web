"use client";

import { ReactNode } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import appTheme from "../theme/theme";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";

type AppThemeProviderProps = {
  children: ReactNode;
};

const AppThemeProvider = ({ children }: AppThemeProviderProps) => {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={appTheme} defaultMode="light">
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
};

export default AppThemeProvider;
