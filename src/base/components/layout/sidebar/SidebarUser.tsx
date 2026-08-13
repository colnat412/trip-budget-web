import { Avatar, Box, Stack, Typography } from "@mui/material";

import type { SidebarUser as SidebarUserData } from "./types";

export interface SidebarUserProps {
  user: Partial<SidebarUserData>;
}

export default function SidebarUser({ user }: SidebarUserProps) {
  return (
    <Stack
      direction="row"
      spacing={1.25}
      sx={{ height: "100%", alignItems: "center", px: 0.5, minWidth: 0 }}
    >
      <Avatar
        src="/avatar.jpg"
        sx={{
          width: 34,
          height: 34,
          bgcolor: "primary.light",
          fontSize: 12,
          fontWeight: 400,
        }}
      />
      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="body2"
          noWrap
          sx={{ fontWeight: 800, color: "primary.dark" }}
        >
          {user.name}
        </Typography>
        <Typography
          variant="caption"
          noWrap
          sx={{ display: "block", color: "text.secondary" }}
        >
          {user.role}
        </Typography>
      </Box>
    </Stack>
  );
}
