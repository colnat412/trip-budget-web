import { Avatar, Box, Stack, Typography } from "@mui/material";

import { AppLinearProgress } from "../../ui";
import type { SidebarTrip } from "./types";
import { useTranslations } from "next-intl";

export interface SidebarTripCardProps {
  trip: SidebarTrip;
}

export default function SidebarTripCard({ trip }: SidebarTripCardProps) {
  const t = useTranslations("sidebar");

  return (
    <Box
      sx={{
        overflow: "hidden",
        borderRadius: "14px",
        bgcolor: "action.hover",
      }}
    >
      <Box
        sx={{
          // minHeight: 120,
          p: "12px",
          overflow: "hidden",
          color: "common.white",
          background: (theme) => {
            const palette = theme.vars?.palette ?? theme.palette;
            return `linear-gradient(135deg, ${palette.primary.main}, ${palette.primary.light})`;
          },
        }}
      >
        <Box>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            {t("currentTrip")}
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
            {trip.dateRange} · {trip.companionCount} {t("expenseCount")}
          </Typography>

          <Stack direction="row" spacing={0.5}>
            {trip.members.map((member) => (
              <Avatar
                key={member.initials}
                sx={{
                  width: 24,
                  height: 24,
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
          sx={{ justifyContent: "space-between", pb: 0.75 }}
        >
          <Typography variant="caption" sx={{ color: "text.primary" }}>
            {t("budget")}
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
          sx={{ justifyContent: "space-between", pt: 0.6 }}
        >
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", fontFamily: "var(--font-mono)" }}
          >
            {trip.spentLabel}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", fontFamily: "var(--font-mono)" }}
          >
            {trip.budgetLabel}
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}
