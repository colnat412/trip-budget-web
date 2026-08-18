"use client";

import { Box, Card, CardProps } from "@mui/material";

import type { Theme } from "@mui/material/styles";
import type { SxProps } from "@mui/system";
import type { ReactNode } from "react";

export type AppCardVariant =
  | "elevated"
  | "primary"
  | "transparent"
  | "outlined"
  | "flat"
  | "danger";

export interface AppCardProps extends Omit<CardProps, "variant"> {
  variant?: AppCardVariant;
  interactive?: boolean;
  icon?: ReactNode;
  iconSize?: number | string;
  contentSx?: SxProps<Theme>;
}

function getCardStyles(
  variant: AppCardVariant,
  interactive: boolean,
  hasIcon: boolean,
): SxProps<Theme> {
  return (theme) => {
    const palette = theme.vars?.palette ?? theme.palette;
    const variantStyles = {
      elevated: {
        backgroundColor: palette.background.paper,
        color: palette.text.primary,
        border: "none",
        boxShadow:
          "rgba(0, 0, 0, 0.05) 0px 1px 3px, rgba(0, 0, 0, 0.04) 0px 0px 0px 1px",
      },

      primary: {
        color: palette.primary.contrastText,
        background: `linear-gradient(135deg, ${palette.primary.main}, ${palette.primary.light})`,
        border: "none",
        boxShadow: `0 8px 24px color-mix(in srgb, ${palette.primary.main} 18%, transparent)`,
      },

      danger: {
        color: palette.primary.contrastText,
        background: `linear-gradient(135deg, ${palette.secondary.dark}, ${palette.secondary.main})`,
        border: "none",
        boxShadow: `0 8px 24px color-mix(in srgb, ${palette.primary.main} 18%, transparent)`,
      },

      transparent: {
        color: "inherit",
        backgroundColor: "transparent",
        border: "none",
        boxShadow: "none",
      },

      outlined: {
        backgroundColor: palette.background.paper,
        border: `1px solid ${palette.divider}`,
        boxShadow: "none",
      },

      flat: {
        backgroundColor: `color-mix(in srgb, ${palette.primary.light} 8%, transparent)`,
        border: "none",
        boxShadow: "none",
      },
    };

    return {
      display: "grid",
      gridTemplateColumns: hasIcon ? "auto minmax(0, 1fr)" : "minmax(0, 1fr)",
      alignItems: "center",
      columnGap: 2,
      padding: {
        xs: "12px 16px",
        sm: "14px 20px",
      },
      borderRadius: "14px",
      overflow: "hidden",
      cursor: "default",
      transition: "box-shadow 0.15s",

      ...variantStyles[variant],

      ...(interactive && {
        cursor: "pointer",
        transition: theme.transitions.create(
          ["transform", "box-shadow", "border-color"],
          {
            duration: 150,
          },
        ),

        "&:hover": {
          transform: "translateY(-1px)",
          borderColor: palette.primary.main,
          boxShadow: `0 8px 24px color-mix(in srgb, ${palette.primary.main} 14%, transparent)`,
        },

        "&:active": {
          transform: "translateY(0)",
        },

        "&:focus-visible": {
          outline: `3px solid color-mix(in srgb, ${palette.primary.light} 35%, transparent)`,
          outlineOffset: 2,
        },
      }),
    };
  };
}

export default function AppCard({
  children,
  variant = "elevated",
  interactive = false,
  icon,
  iconSize = 16,
  contentSx,
  sx,
  ...cardProps
}: AppCardProps) {
  const resolvedIconSize =
    typeof iconSize === "number" ? `${iconSize}px` : iconSize;

  return (
    <Card
      {...cardProps}
      sx={[
        getCardStyles(variant, interactive, Boolean(icon)),
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {icon && (
        <Box
          component="span"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            width: resolvedIconSize,
            height: resolvedIconSize,
            fontSize: resolvedIconSize,
            color: "inherit",
            "& svg": {
              width: resolvedIconSize,
              height: resolvedIconSize,
              fontSize: "inherit",
            },
          }}
        >
          {icon}
        </Box>
      )}

      <Box
        sx={[
          {
            display: "grid",
            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              md: "minmax(0, 2fr) repeat(3, minmax(0, 1fr)) 120px",
            },
            alignItems: "center",
            columnGap: 2,
            rowGap: 1.5,
            minWidth: 0,
          },
          ...(Array.isArray(contentSx)
            ? contentSx
            : contentSx
              ? [contentSx]
              : []),
        ]}
      >
        {children}
      </Box>
    </Card>
  );
}
