"use client";

import { Box, Stack } from "@mui/material";
import { usePathname } from "next/navigation";

import {
  DEFAULT_SIDEBAR_MENU,
  DEFAULT_SIDEBAR_TRIP,
  DEFAULT_SIDEBAR_USER,
} from "./sidebar/config";
import SidebarBrand from "./sidebar/SidebarBrand";
import SidebarMenu from "./sidebar/SidebarMenu";
import SidebarTripCard from "./sidebar/SidebarTripCard";
import SidebarUser from "./sidebar/SidebarUser";
import type { AppSidebarProps } from "./sidebar/types";
import AppPreferences from "../preferences/AppPreferences";
import { useTranslations } from "next-intl";

export type {
  AppSidebarProps,
  SidebarMenuItem as AppSidebarMenuItem,
  SidebarTrip,
  SidebarTripMember,
  SidebarUser,
} from "./sidebar/types";

export default function AppSidebar({
  activeMenuId,
  menuItems = DEFAULT_SIDEBAR_MENU,
  trip = DEFAULT_SIDEBAR_TRIP,
  currentUser = DEFAULT_SIDEBAR_USER,
  onMenuChange,
}: AppSidebarProps) {
  const t = useTranslations("sidebar");
  const pathname = usePathname();
  const routeMenuItem = menuItems.find(
    (item) =>
      (pathname === '/' && item.id === 'overview') ||
      pathname === item.href ||
      pathname.startsWith(`${item.href}/`),
  );
  const selectedMenuId = activeMenuId ?? routeMenuItem?.id ?? "";

  return (
    <Box
      component="aside"
      sx={{
        width: 240,
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        borderRight: 1,
        borderColor: "divider",
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: 2 }}>
        <SidebarBrand />
      </Box>

      <Box sx={{ p: 1 }}>
        <SidebarTripCard trip={trip} />
      </Box>

      <Box
        component="nav"
        aria-label={t("navigation")}
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 1,
        }}
      >
        <SidebarMenu
          items={menuItems}
          selectedId={selectedMenuId}
          onChange={onMenuChange}
        />
      </Box>

      <Stack
        spacing={2}
        sx={{
          borderTop: 1,
          borderColor: "divider",
          p: 2,
        }}
      >
        <SidebarUser user={currentUser} />
        <AppPreferences />
      </Stack>
    </Box>
  );
}
