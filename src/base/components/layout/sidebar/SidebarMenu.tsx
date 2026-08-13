import { ButtonBase, Stack, Typography } from "@mui/material";

import type { SidebarMenuItem } from "./types";

export interface SidebarMenuProps {
  items: SidebarMenuItem[];
  selectedId: string;
  onChange: (id: string) => void;
}

export default function SidebarMenu({
  items,
  selectedId,
  onChange,
}: SidebarMenuProps) {
  return (
    <Stack component="nav" aria-label="Main navigation" spacing={0.5}>
      {items.map((item) => {
        const selected = item.id === selectedId;

        return (
          <ButtonBase
            key={item.id}
            onClick={() => onChange(item.id)}
            aria-current={selected ? "page" : undefined}
            sx={{
              width: "100%",
              minHeight: 48,
              justifyContent: "flex-start",
              gap: 2,
              px: 2,
              borderRadius: "12px",
              color: selected ? "primary.main" : "text.secondary",
              bgcolor: selected ? "#EFF6FF" : "transparent",
              transition:
                "background-color 0.15s, color 0.15s, border-color 0.15s",
              "&:hover": {
                color: "primary.main",
                bgcolor: selected ? "#EFF6FF" : "action.hover",
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
              {item.label}
            </Typography>
            {/* {selected && (
              <Box
                sx={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                }}
              />
            )} */}
          </ButtonBase>
        );
      })}
    </Stack>
  );
}
