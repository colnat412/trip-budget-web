'use client';

import type { ReactNode } from 'react';
import { Alert, Snackbar } from '@mui/material';

export type AppToastSeverity = 'success' | 'info' | 'warning' | 'error';

export interface AppToastPosition {
  vertical: 'top' | 'bottom';
  horizontal: 'left' | 'center' | 'right';
}

export interface AppToastProps {
  open: boolean;
  message: ReactNode;
  onClose: () => void;
  severity?: AppToastSeverity;
  autoHideDuration?: number | null;
  position?: AppToastPosition;
}

export default function AppToast({
  open,
  message,
  onClose,
  severity = 'info',
  autoHideDuration = 4_000,
  position = { vertical: 'top', horizontal: 'right' },
}: AppToastProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      anchorOrigin={position}
      onClose={(_event, reason) => {
        if (reason !== 'clickaway') {
          onClose();
        }
      }}
    >
      <Alert severity={severity} variant="filled" onClose={onClose}>
        {message}
      </Alert>
    </Snackbar>
  );
}
