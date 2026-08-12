import type { ReactNode } from "react";

export interface SidebarMenuItem {
  id: string;
  label: string;
  icon: ReactNode;
}

export interface SidebarTripMember {
  initials: string;
  color: string;
}

export interface SidebarTrip {
  title: string;
  dateRange: string;
  companionCount: number;
  budgetProgress: number;
  spentLabel: string;
  budgetLabel: string;
  members: SidebarTripMember[];
}

export interface SidebarUser {
  name: string;
  role: string;
  initials: string;
}

export interface AppSidebarProps {
  activeMenuId?: string;
  menuItems?: SidebarMenuItem[];
  trip?: SidebarTrip;
  currentUser?: SidebarUser;
  onMenuChange?: (menuId: string) => void;
}
