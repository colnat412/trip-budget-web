'use client';

import { Backdrop, Box, CircularProgress, Typography } from '@mui/material';

export interface AppLoadingOverlayProps {
  open: boolean;
  message?: string;
}

const AppLoadingOverlay = ({
  open,
  message,
}: AppLoadingOverlayProps) => {
  return (
    <Backdrop
      open={open}
      transitionDuration={250}
      sx={{
        zIndex: (theme) => theme.zIndex.modal + 20,
        bgcolor: 'rgba(15, 23, 42, 0.35)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          p: { xs: 2.5, sm: 3.5 },
          borderRadius: '20px',
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
          border: 1,
          borderColor: 'divider',
          minWidth: 160,
          textAlign: 'center',
        }}
      >
        <CircularProgress
          size={44}
          thickness={4.5}
          sx={{
            color: 'primary.main',
          }}
        />
        {message && (
          <Typography
            sx={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'text.secondary',
            }}
          >
            {message}
          </Typography>
        )}
      </Box>
    </Backdrop>
  );
};

export default AppLoadingOverlay;
