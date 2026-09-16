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

  return (theme) => {
    const palette = theme.vars?.palette ?? theme.palette;

    return {
      color: palette.primary.contrastText,
      background: palette.background.default,
      borderColor: palette.background.default,

      "&:hover": {
        color: palette.primary.contrastText,
        background: palette.background.default,
        borderColor: palette.background.default,
        filter: "brightness(0.92)",
      },

      "&:active": {
        background: palette.background.default,
        filter: "brightness(0.85)",
      },
    };
  };
}

function getButtonStyles(
  intent: AppButtonIntent,
  round: boolean,
): SxProps<Theme> {
  return (theme) => {
    const palette = theme.vars?.palette ?? theme.palette;
    const primaryGradient = `linear-gradient(135deg, ${palette.primary.main}, ${palette.primary.light})`;
    const commonStyles = {
      ...(round && { borderRadius: "999px" }),
    };

    switch (intent) {
      case "primary":
        return {
          ...commonStyles,

          color: palette.primary.contrastText,
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
            color: palette.primary.contrastText,
            background: palette.action.disabledBackground,
            filter: "none",
          },
        };

      case "secondary":
        return {
          ...commonStyles,

          color: palette.primary.main,
          backgroundColor: palette.background.paper,
          border: `1px solid ${palette.primary.main}`,

          "&:hover": {
            color: palette.primary.main,
            borderColor: palette.primary.light,
          },

          "&:active": {
            backgroundColor: `color-mix(in srgb, ${palette.primary.main} 12%, transparent)`,
          },

          "&.Mui-disabled": {
            color: palette.action.disabled,
            backgroundColor: palette.background.paper,
            borderColor: palette.action.disabled,
          },
        };

      case "success":
        return {
          ...commonStyles,

          color: palette.success.main,
          backgroundColor: palette.background.paper,
          border: `1px solid ${palette.success.main}`,

          "&:hover": {
            color: palette.success.dark,
            backgroundColor: `color-mix(in srgb, ${palette.success.main} 12%, transparent)`,
            borderColor: palette.success.dark,
          },

          "&:active": {
            backgroundColor: `color-mix(in srgb, ${palette.success.main} 18%, transparent)`,
          },

          "&.Mui-disabled": {
            color: palette.action.disabled,
            backgroundColor: palette.background.paper,
            borderColor: palette.action.disabled,
          },
        };

      case "danger":
        return {
          ...commonStyles,

          color: palette.error.main,
          backgroundColor: palette.background.paper,
          border: `1px solid ${palette.error.main}`,

          "&:hover": {
            color: palette.error.dark,
            backgroundColor: `color-mix(in srgb, ${palette.error.main} 12%, transparent)`,
            borderColor: palette.error.dark,
          },

          "&:active": {
            backgroundColor: `color-mix(in srgb, ${palette.error.main} 18%, transparent)`,
          },

          "&.Mui-disabled": {
            color: palette.action.disabled,
            backgroundColor: palette.background.paper,
            borderColor: palette.action.disabled,
          },
        };

      case "text":
        return {
          ...commonStyles,

          color: palette.primary.main,
          backgroundColor: "transparent",

          "&:hover": {
            color: palette.primary.main,
            backgroundColor: `color-mix(in srgb, ${palette.primary.main} 12%, transparent)`,
          },

          "&:active": {
            backgroundColor: `color-mix(in srgb, ${palette.primary.main} 18%, transparent)`,
          },

          "&.Mui-disabled": {
            color: palette.action.disabled,
          },
        };
    }
  };
}

const AppButton = ({
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
}: AppButtonProps) => {
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
};

export default AppButton;
