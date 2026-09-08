'use client';

import type { ReactNode } from 'react';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

export interface AppDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
}

export default function AppDialog({
  open,
  onClose,
  title,
  description,
  icon,
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = true,
}: AppDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      slotProps={{
        paper: {
          sx: {
            borderRadius: '20px',
            p: { xs: 1, sm: 2 },
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: { xs: 2, sm: 2.5 },
          pb: 1.5,
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          {icon && (
            <Box
              sx={{
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '12px',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                flexShrink: 0,
              }}
            >
              {icon}
            </Box>
          )}
          <Box>
            <Typography
              component="h2"
              sx={{
                fontFamily: 'var(--font-display)',
                fontSize: { xs: '18px', sm: '20px' },
                fontWeight: 700,
                color: 'text.primary',
              }}
            >
              {title}
            </Typography>
            {description && (
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', display: 'block' }}
              >
                {description}
              </Typography>
            )}
          </Box>
        </Stack>

        <IconButton onClick={onClose} size="small" aria-label="Close dialog">
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          p: { xs: 2, sm: 2.5 },
          pt: '20px !important',
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
        }}
      >
        {children}
      </DialogContent>

      {actions && (
        <DialogActions sx={{ p: 2, gap: 1.5 }}>{actions}</DialogActions>
      )}
    </Dialog>
  );
}
