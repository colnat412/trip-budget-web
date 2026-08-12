"use client";

import { Box } from "@mui/material";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import AppSidebar from "./AppSidebar";

export interface AppShellProps {
  children: ReactNode;
  sidebarDisabledPaths?: readonly string[];
}

export default function AppShell({
  children,
  sidebarDisabledPaths = [],
}: AppShellProps) {
  const pathname = usePathname();
  const showSidebar = !sidebarDisabledPaths.includes(pathname);

  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "background.default",
      }}
    >
      {showSidebar && <AppSidebar />}
      <Box component="main" sx={{ minWidth: 0, flex: 1, overflow: "auto" }}>
        {children}
      </Box>
    </Box>
  );
}
