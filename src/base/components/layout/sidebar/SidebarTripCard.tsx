import { Avatar, Box, Stack, Typography } from "@mui/material";

import { AppLinearProgress } from "../../ui";
import type { SidebarTrip } from "./types";

export interface SidebarTripCardProps {
  trip: SidebarTrip;
}

export default function SidebarTripCard({ trip }: SidebarTripCardProps) {
  return (
    <Box
      sx={{
        overflow: "hidden",
        borderRadius: "14px",
        bgcolor: "#f1f4f7",
      }}
    >
      <Box
        sx={{
          // minHeight: 120,
          p: "12px",
          overflow: "hidden",
          color: "common.white",
          background: (theme) =>
            `linear-gradient(
            135deg,
            ${theme.palette.primary.main},
            ${theme.palette.primary.light}
          )`,
        }}
      >
        <Box>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            Đang đi
          </Typography>
          <Typography
            sx={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              lineHeight: 1,
            }}
          >
            {trip.title}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            {trip.dateRange} · {trip.companionCount} khoản chi
          </Typography>

          <Stack direction="row">
            {trip.members.map((member, index) => (
              <Avatar
                key={`${member.initials}-${index}`}
                sx={{
                  width: 24,
                  height: 24,
                  ml: index === 0 ? 0 : "-5px",
                  border: "1.5px solid white",
                  bgcolor: member.color,
                  fontSize: 8,
                  fontWeight: 700,
                }}
              >
                {member.initials}
              </Avatar>
            ))}
          </Stack>
        </Box>
      </Box>

      <Box sx={{ p: "12px" }}>
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", mb: 0.75 }}
        >
          <Typography variant="caption" sx={{ color: "text.primary" }}>
            Ngân sách
          </Typography>
          <Typography variant="caption" sx={{ color: "secondary.dark" }}>
            {trip.budgetProgress}%
          </Typography>
        </Stack>
        <AppLinearProgress
          value={trip.budgetProgress}
          barColor="secondary.dark"
        />
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", mt: 0.6 }}
        >
          <Typography
            variant="caption"
            sx={{ color: "#94A3B8", fontFamily: "var(--font-mono)" }}
          >
            {trip.spentLabel}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "#94A3B8", fontFamily: "var(--font-mono)" }}
          >
            {trip.budgetLabel}
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}
