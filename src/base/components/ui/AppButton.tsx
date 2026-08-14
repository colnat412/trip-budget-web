"use client";

import { Button, ButtonProps, CircularProgress } from "@mui/material";

import type { Theme } from "@mui/material/styles";
import type { SxProps } from "@mui/system";

export type AppButtonIntent =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "text";

export type AppButtonProps = Omit<ButtonProps, "color" | "variant"> & {
  intent?: AppButtonIntent;
  loading?: boolean;
  round?: boolean;
  selected?: boolean;
};

function getSelectedStyles(selected: boolean): SxProps<Theme> {
  if (!selected) return {};

  return (theme) => ({
    color: theme.palette.primary.contrastText,
    background: theme.palette.background.default,
    borderColor: theme.palette.background.default,

    "&:hover": {
      color: theme.palette.primary.contrastText,
      background: theme.palette.background.default,
      borderColor: theme.palette.background.default,
      filter: "brightness(0.92)",
    },

    "&:active": {
      background: theme.palette.background.default,
      filter: "brightness(0.85)",
    },
  });
}

function getButtonStyles(
  intent: AppButtonIntent,
  round: boolean,
): SxProps<Theme> {
  return (theme) => {
    const primaryGradient = `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`;
    const commonStyles = {
      // borderRadius: 1,
    };

    switch (intent) {
      case "primary":
        return {
          ...commonStyles,

          color: theme.palette.primary.contrastText,
          background: primaryGradient,

          "&:hover": {
            background: primaryGradient,
            filter: "brightness(0.92)",
          },

          "&:active": {
            background: primaryGradient,
            filter: "brightness(0.85)",
          },

          "&.Mui-disabled": {
            color: theme.palette.primary.contrastText,
            background: theme.palette.action.disabledBackground,
            filter: "none",
          },
        };

      case "secondary":
        return {
          ...commonStyles,

          color: theme.palette.primary.dark,
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.primary.main}`,

          "&:hover": {
            color: theme.palette.primary.dark,
            // backgroundColor: theme.palette.primary.light,
            borderColor: theme.palette.primary.light,
          },

          "&:active": {
            backgroundColor: theme.palette.primary.light,
          },

          "&.Mui-disabled": {
            color: theme.palette.action.disabled,
            backgroundColor: theme.palette.background.paper,
            borderColor: theme.palette.action.disabled,
          },
        };

      case "success":
        return {
          ...commonStyles,

          color: theme.palette.success.main,
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.success.main}`,

          "&:hover": {
            color: theme.palette.success.dark,
            backgroundColor: theme.palette.success.light,
            borderColor: theme.palette.success.dark,
          },

          "&:active": {
            backgroundColor: theme.palette.success.light,
          },

          "&.Mui-disabled": {
            color: theme.palette.action.disabled,
            backgroundColor: theme.palette.background.paper,
            borderColor: theme.palette.action.disabled,
          },
        };

      case "danger":
        return {
          ...commonStyles,

          color: theme.palette.error.main,
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.error.main}`,

          "&:hover": {
            color: theme.palette.error.dark,
            backgroundColor: theme.palette.error.light,
            borderColor: theme.palette.error.dark,
          },

          "&:active": {
            backgroundColor: theme.palette.error.light,
          },

          "&.Mui-disabled": {
            color: theme.palette.action.disabled,
            backgroundColor: theme.palette.background.paper,
            borderColor: theme.palette.action.disabled,
          },
        };

      case "text":
        return {
          ...commonStyles,

          color: theme.palette.primary.main,
          backgroundColor: "transparent",

          "&:hover": {
            color: theme.palette.primary.dark,
            backgroundColor: theme.palette.primary.light,
          },

          "&:active": {
            backgroundColor: theme.palette.primary.light,
          },

          "&.Mui-disabled": {
            color: theme.palette.action.disabled,
          },
        };
    }
  };
}

export default function AppButton({
  children,
  intent = "primary",
  loading = false,
  round = false,
  selected = false,
  disabled = false,
  size = "large",
  startIcon,
  sx,
  ...buttonProps
}: AppButtonProps) {
  const loadingIcon = (
    <CircularProgress
      size={size === "small" ? 14 : 18}
      thickness={5}
      color="inherit"
    />
  );

  return (
    <Button
      {...buttonProps}
      size={size}
      disabled={disabled || loading}
      aria-pressed={selected}
      startIcon={loading ? loadingIcon : startIcon}
      sx={[
        getButtonStyles(intent, round),
        getSelectedStyles(selected),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {!loading ? children : undefined}
    </Button>
  );
}
