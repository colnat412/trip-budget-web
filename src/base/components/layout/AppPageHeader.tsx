'use client';

import React from 'react';
import {
  Box,
  Stack,
  Typography,
  type SxProps,
  type Theme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';

export interface AppPageHeaderProps {
  title: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  sx?: SxProps<Theme>;
}

const AppPageHeader = ({
  title,
  icon,
  badge,
  subtitle,
  actions,
  sx,
}: AppPageHeaderProps) => {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'center' },
        gap: 2,
        ...sx,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
          minWidth: 0,
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: 'center', flexWrap: 'wrap' }}
        >
          {icon && (
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                color: 'primary.main',
                fontSize: '24px',
              }}
            >
              {icon}
            </Box>
          )}

          {typeof title === 'string' ? (
            <Typography
              component="h1"
              sx={{
                fontFamily: 'var(--font-display)',
                fontSize: { xs: '24px', sm: '28px' },
                fontWeight: 800,
                color: 'text.primary',
                letterSpacing: '-0.5px',
              }}
            >
              {title}
            </Typography>
          ) : (
            title
          )}

          {badge !== undefined &&
            badge !== null &&
            badge !== '' &&
            (typeof badge === 'string' || typeof badge === 'number' ? (
              <Box
                sx={{
                  px: 1,
                  py: 0.2,
                  borderRadius: '999px',
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                  border: 1,
                  borderColor: (theme) =>
                    alpha(theme.palette.primary.main, 0.2),
                  fontSize: '12px',
                  fontWeight: 700,
                  color: 'primary.main',
                  display: 'inline-flex',
                  alignItems: 'center',
                  lineHeight: 1.2,
                }}
              >
                {badge}
              </Box>
            ) : (
              badge
            ))}
        </Stack>

        {subtitle &&
          (typeof subtitle === 'string' ? (
            <Typography sx={{ color: 'text.secondary', fontSize: '14px' }}>
              {subtitle}
            </Typography>
          ) : (
            <Box sx={{ minWidth: 0 }}>{subtitle}</Box>
          ))}
      </Box>

      {actions && (
        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            alignItems: 'center',
            flexShrink: 0,
            flexWrap: 'wrap',
            gap: 1,
            alignSelf: { xs: 'stretch', sm: 'auto' },
          }}
        >
          {actions}
        </Stack>
      )}
    </Box>
  );
};

export default AppPageHeader;
