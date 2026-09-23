'use client';

import React from 'react';
import {
  Box,
  Stack,
  Typography,
  type SxProps,
  type Theme,
} from '@mui/material';

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

          {badge &&
            (typeof badge === 'string' || typeof badge === 'number' ? (
              <Box
                sx={{
                  px: 1,
                  py: 0.25,
                  borderRadius: '999px',
                  bgcolor: 'background.paper',
                  border: 1,
                  borderColor: 'divider',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: 'primary.main',
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
            subtitle
          ))}
      </Box>

      {actions && (
        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            alignItems: 'center',
            flexShrink: 0,
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
