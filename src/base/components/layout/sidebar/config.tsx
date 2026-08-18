import DocumentScannerOutlinedIcon from "@mui/icons-material/DocumentScannerOutlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";

import type { SidebarMenuItem, SidebarTrip, SidebarUser } from "./types";

export const DEFAULT_SIDEBAR_MENU: SidebarMenuItem[] = [
  { id: "overview", label: "Tổng quan", messageKey: "overview", icon: <HomeOutlinedIcon /> },
  { id: "expenses", label: "Chi tiêu", messageKey: "expenses", icon: <SavingsOutlinedIcon /> },
  { id: "scan", label: "Quét hóa đơn", messageKey: "scan", icon: <DocumentScannerOutlinedIcon /> },
  { id: "settlement", label: "Quyết toán", messageKey: "settlement", icon: <HandshakeOutlinedIcon /> },
  { id: "ai", label: "AI", icon: <SmartToyOutlinedIcon /> },
];

export const DEFAULT_SIDEBAR_TRIP: SidebarTrip = {
  title: "Sa Pa - Lào Cai",
  dateRange: "4–8/8/2025",
  companionCount: 9,
  budgetProgress: 80,
  spentLabel: "8.0tr",
  budgetLabel: "10tr",
  members: [
    { initials: "MA", color: "#6366F1" },
    { initials: "TN", color: "#F59E0B" },
    { initials: "LP", color: "#10B981" },
    { initials: "VH", color: "#EC4899" },
  ],
};

export const DEFAULT_SIDEBAR_USER: Partial<SidebarUser> = {
  name: "Tan Loc",
  role: "IT",
  initials: "TL",
};
