import FlightTakeoffRoundedIcon from "@mui/icons-material/FlightTakeoffRounded";
import { Box, Stack, Typography } from "@mui/material";

export default function SidebarBrand() {
  return (
    <Stack direction="row" spacing={1.25} sx={{ alignItems: "center", px: 1 }}>
      <Box
        sx={{
          width: 38,
          height: 38,
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
          borderRadius: "11px",
          color: "common.white",
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
          boxShadow: "0 7px 16px rgba(14, 165, 233, 0.3)",
        }}
      >
        <FlightTakeoffRoundedIcon sx={{ fontSize: 21, transform: "rotate(-18deg)" }} />
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ color: "text.primary", fontWeight: 800, lineHeight: 1.2 }}>
          TripBudget
        </Typography>
        <Typography variant="caption" sx={{ color: "primary.light", lineHeight: 1 }}>
          AI
        </Typography>
      </Box>
    </Stack>
  );
}
