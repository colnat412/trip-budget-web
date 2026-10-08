'use client';

import { createTheme } from '@mui/material/styles';

const brandPalette = {
  primary: {
    main: '#1E3A8A',
    light: '#0EA5E9',
    dark: '#172554',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#F59E0B',
    light: '#FCD34D',
    dark: '#F97316',
    contrastText: '#1F2937',
  },
  success: {
    main: '#16A34A',
    light: '#DCFCE7',
    dark: '#166534',
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#DC2626',
    light: '#FEE2E2',
    dark: '#991B1B',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#F59E0B',
    light: '#FEF3C7',
    dark: '#D97706',
    contrastText: '#1F2937',
  },
  info: {
    main: '#0284C7',
    light: '#E0F2FE',
    dark: '#0369A1',
    contrastText: '#FFFFFF',
  },
} as const;

const appTheme = createTheme({
  cssVariables: { colorSchemeSelector: 'data' },
  colorSchemes: {
    light: {
      palette: {
        ...brandPalette,
        mode: 'light',
        background: { default: 'rgb(30, 58, 138)', paper: '#FFFFFF' },
        text: { primary: '#0F172A', secondary: '#475569' },
        divider: 'rgba(30, 58, 138, 0.12)',
      },
    },
    dark: {
      palette: {
        ...brandPalette,
        mode: 'dark',
        primary: {
          ...brandPalette.primary,
          main: '#60A5FA',
          light: '#38BDF8',
          dark: '#1E3A8A',
        },
        info: {
          main: '#38BDF8',
          light: '#7DD3FC',
          dark: '#0284C7',
          contrastText: '#0F172A',
        },
        warning: {
          main: '#FBBF24',
          light: '#FDE68A',
          dark: '#D97706',
          contrastText: '#1F2937',
        },
        background: { default: '#071225', paper: '#0F1D33' },
        text: { primary: '#F8FAFC', secondary: '#B6C2D2' },
        divider: 'rgba(148, 163, 184, 0.22)',
      },
    },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: 'var(--font-body)',
    h1: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      letterSpacing: '-0.5px',
    },
    h2: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      letterSpacing: '-0.5px',
    },
    h3: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      letterSpacing: '-0.25px',
    },
    h4: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      letterSpacing: '0px',
    },
    h5: { fontFamily: 'var(--font-display)', fontWeight: 600 },
    h6: { fontFamily: 'var(--font-display)', fontWeight: 600 },
    button: { fontFamily: 'var(--font-body)', fontWeight: 700 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { minHeight: '100%' },
        body: { minHeight: '100%', margin: 0, fontFamily: 'var(--font-body)' },
        '*': { boxSizing: 'border-box' },
        a: { color: 'inherit', textDecoration: 'none' },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          minHeight: 44,
          paddingInline: 20,
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 700,
        },
        sizeLarge: { minHeight: 50, fontSize: '16px' },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => {
          const palette = theme.vars?.palette ?? theme.palette;

          return {
            minHeight: 50,
            borderRadius: 12,
            backgroundColor: palette.background.paper,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: palette.primary.main,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderWidth: 2,
            },
            '&.Mui-error .MuiOutlinedInput-notchedOutline': {
              borderWidth: 1.5,
            },
          };
        },
        input: { padding: '14px 16px' },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme }) => {
          const palette = theme.vars?.palette ?? theme.palette;

          return {
            color: palette.text.secondary,
            fontWeight: 500,
            '&.Mui-focused': { color: palette.primary.main },
            '&.Mui-error': { color: palette.error.main },
            '&.Mui-disabled': { color: palette.text.disabled },
          };
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: { root: { marginLeft: 4, marginTop: 6 } },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => {
          const palette = theme.vars?.palette ?? theme.palette;

          return {
            borderRadius: 20,
            border: `1px solid ${palette.divider}`,
            boxShadow: '0 24px 70px rgba(0, 0, 0, 0.18)',
          };
        },
      },
    },
  },
});

export default appTheme;
