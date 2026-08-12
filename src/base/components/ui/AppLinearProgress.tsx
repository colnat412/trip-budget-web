"use client";

import { LinearProgress, type LinearProgressProps } from "@mui/material";

export interface AppLinearProgressProps
  extends Omit<LinearProgressProps, "variant" | "value"> {
  value: number;
  height?: number | string;
  trackColor?: string;
  barColor?: string;
}

export default function AppLinearProgress({
  value,
  height = 4,
  trackColor = "#E2E8F0",
  barColor = "primary.main",
  sx,
  ...progressProps
}: AppLinearProgressProps) {
  const normalizedValue = Math.min(Math.max(value, 0), 100);

  return (
    <LinearProgress
      {...progressProps}
      variant="determinate"
      value={normalizedValue}
      sx={[
        {
          height,
          borderRadius: 999,
          bgcolor: trackColor,
          "& .MuiLinearProgress-bar": {
            borderRadius: 999,
            bgcolor: barColor,
          },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    />
  );
}
