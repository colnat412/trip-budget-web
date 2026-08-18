import type { ReactNode } from "react";

export type SidebarMessageKey =
  | "overview"
  | "expenses"
  | "scan"
  | "settlement";

export interface SidebarMenuItem {
  id: string;
  label: string;
  messageKey?: SidebarMessageKey;
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
  currentUser?: Partial<SidebarUser>;
  onMenuChange?: (menuId: string) => void;
}
