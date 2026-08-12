import { Avatar, Box, Stack, Typography } from "@mui/material";

import type { SidebarUser as SidebarUserData } from "./types";

export interface SidebarUserProps {
  user: SidebarUserData;
}

export default function SidebarUser({ user }: SidebarUserProps) {
  return (
    <Stack
      direction="row"
      spacing={1.25}
      sx={{ height: "100%", alignItems: "center", px: 0.5, minWidth: 0 }}
    >
      <Avatar
        sx={{
          width: 34,
          height: 34,
          bgcolor: "#7C6CF2",
          fontSize: 12,
          fontWeight: 700,
          boxShadow: "0 4px 12px rgba(124, 108, 242, 0.28)",
        }}
      >
        {user.initials}
      </Avatar>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" noWrap sx={{ fontWeight: 700, color: "text.primary" }}>
          {user.name}
        </Typography>
        <Typography variant="caption" noWrap sx={{ display: "block", color: "text.secondary" }}>
          {user.role}
        </Typography>
      </Box>
    </Stack>
  );
}
