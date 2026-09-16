import { ButtonBase, Stack, Typography } from "@mui/material";
import Link from "next/link";

import type { SidebarMenuItem } from "./types";
import { useTranslations } from "next-intl";

export interface SidebarMenuProps {
  items: SidebarMenuItem[];
  selectedId: string;
  onChange?: (id: string) => void;
}

const SidebarMenu = ({
  items,
  selectedId,
  onChange,
}: SidebarMenuProps) => {
  const t = useTranslations("sidebar");

  return (
    <Stack spacing={0.5}>
      {items.map((item) => {
        const selected = item.id === selectedId;

        return (
          <ButtonBase
            component={Link}
            href={item.href}
            key={item.id}
            onClick={() => onChange?.(item.id)}
            aria-current={selected ? "page" : undefined}
            sx={{
              width: "100%",
              minHeight: 48,
              justifyContent: "flex-start",
              gap: 2,
              px: 2,
              borderRadius: "12px",
              color: selected ? "primary.main" : "text.secondary",
              bgcolor: selected ? "action.selected" : "transparent",
              transition:
                "background-color 0.15s, color 0.15s, border-color 0.15s",
              "&:hover": {
                color: "primary.main",
                bgcolor: selected ? "action.selected" : "action.hover",
              },
              "& svg": { fontSize: 16 },
            }}
          >
            {item.icon}
            <Typography
              variant="body2"
              sx={{
                // flex: 1,
                textAlign: "left",
                fontWeight: selected ? 800 : 600,
              }}
            >
              {item.messageKey ? t(item.messageKey) : item.label}
            </Typography>
          </ButtonBase>
        );
      })}
    </Stack>
  );
};

export default SidebarMenu;
