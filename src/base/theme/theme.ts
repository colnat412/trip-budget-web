"use client";

import { createTheme } from "@mui/material/styles";

const appTheme = createTheme({
  cssVariables: true,

  palette: {
    mode: "light",

    primary: {
      main: "#1E3A8A",
      light: "#0EA5E9",
      dark: "#172554",
      contrastText: "#FFFFFF",
    },

    secondary: {
      main: "#F59E0B",
      light: "#FCD34D",
      dark: "#D97706",
      contrastText: "#1F2937",
    },

    success: {
      main: "#16A34A",
      light: "#DCFCE7",
      dark: "#166534",
      contrastText: "#FFFFFF",
    },

    error: {
      main: "#DC2626",
      light: "#FEE2E2",
      dark: "#991B1B",
      contrastText: "#FFFFFF",
    },

    background: {
      default: "rgb(30, 58, 138)",
      paper: "#FFFFFF",
    },

    text: {
      primary: "#0F172A",
      secondary: "#475569",
    },

    divider: "rgba(30, 58, 138, 0.12)",
  },

  shape: {
    borderRadius: 14,
  },

  typography: {
    fontFamily: "var(--font-body)",

    h1: {
      fontFamily: "var(--font-display)",
      fontWeight: 800,
      letterSpacing: "-0.04em",
    },

    h2: {
      fontFamily: "var(--font-display)",
      fontWeight: 800,
      letterSpacing: "-0.035em",
    },

    h3: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      letterSpacing: "-0.03em",
    },

    h4: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      letterSpacing: "-0.025em",
    },

    h5: {
      fontFamily: "var(--font-display)",
      fontWeight: 400,
    },

    h6: {
      fontFamily: "var(--font-display)",
      fontWeight: 400,
    },

    button: {
      fontWeight: 700,
    },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          minHeight: "100%",
        },

        body: {
          minHeight: "100%",
          margin: 0,
        },

        "*": {
          boxSizing: "border-box",
        },

        a: {
          color: "inherit",
          textDecoration: "none",
        },
      },
    },

    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },

      styleOverrides: {
        root: {
          minHeight: 44,
          paddingInline: 20,
          borderRadius: 12,
          textTransform: "none",
          fontWeight: 700,
        },

        sizeLarge: {
          minHeight: 50,
          fontSize: "1rem",
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          minHeight: 50,
          borderRadius: 12,
          backgroundColor: "#FFFFFF",

          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1E3A8A",
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: 2,
          },

          "&.Mui-error .MuiOutlinedInput-notchedOutline": {
            borderWidth: 1.5,
          },
        },

        input: {
          padding: "14px 16px",
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },

    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: 4,
          marginTop: 6,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: "1px solid rgba(30, 58, 138, 0.10)",
          boxShadow: "0 24px 70px rgba(15, 23, 42, 0.10)",
        },
      },
    },
  },
});

export default appTheme;
