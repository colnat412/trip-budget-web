'use client';

import type { ReactNode } from 'react';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';

import AppButton, { type AppButtonIntent } from './AppButton';

export interface AppConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  intent?: 'danger' | 'primary' | 'success';
  loading?: boolean;
  icon?: ReactNode;
}

export default function AppConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  intent = 'danger',
  loading = false,
  icon,
}: AppConfirmDialogProps) {
  const getDefaultIcon = () => {
    switch (intent) {
      case 'danger':
        return <WarningRoundedIcon sx={{ fontSize: 32 }} />;
      case 'success':
        return <CheckCircleOutlineRoundedIcon sx={{ fontSize: 32 }} />;
      default:
        return <HelpOutlineRoundedIcon sx={{ fontSize: 32 }} />;
    }
  };

  const getIconContainerStyles = () => {
    return (theme: {
      palette: {
        error: { main: string };
        success: { main: string };
        primary: { main: string };
      };
      vars?: {
        palette: {
          error: { main: string };
          success: { main: string };
          primary: { main: string };
        };
      };
    }) => {
      const palette = theme.vars?.palette ?? theme.palette;
      switch (intent) {
        case 'danger':
          return {
            color: palette.error.main,
            bgcolor: 'rgba(239, 68, 68, 0.12)',
          };
        case 'success':
          return {
            color: palette.success.main,
            bgcolor: 'rgba(34, 197, 94, 0.12)',
          };
        default:
          return {
            color: palette.primary.main,
            bgcolor: 'rgba(59, 130, 246, 0.12)',
          };
      }
    };
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          sx: {
            borderRadius: '20px',
            p: { xs: 1.5, sm: 2.5 },
            textAlign: 'center',
          },
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: 1.5,
        }}
      >
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
            ...getIconContainerStyles(),
          }}
        >
          {icon ?? getDefaultIcon()}
        </Box>

        <DialogTitle
          sx={{
            p: 0,
            mb: 1,
            fontSize: '18px',
            fontWeight: 800,
            color: 'text.primary',
            fontFamily: 'var(--font-display)',
          }}
        >
          {title}
        </DialogTitle>

        <DialogContent sx={{ p: 0, mb: 3 }}>
          {typeof description === 'string' ? (
            <Typography
              sx={{
                color: 'text.secondary',
                fontSize: '14px',
                lineHeight: 1.6,
              }}
            >
              {description}
            </Typography>
          ) : (
            description
          )}
        </DialogContent>

        <DialogActions sx={{ p: 0, width: '100%', gap: 1.5 }}>
          <Stack direction="row" spacing={1.5} sx={{ width: '100%' }}>
            <AppButton
              intent="secondary"
              fullWidth
              size="medium"
              disabled={loading}
              onClick={onClose}
            >
              {cancelText}
            </AppButton>
            <AppButton
              intent={intent as AppButtonIntent}
              fullWidth
              size="medium"
              loading={loading}
              onClick={onConfirm}
            >
              {confirmText}
            </AppButton>
          </Stack>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
