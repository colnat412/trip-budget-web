'use client';

import {
  CircularProgress,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import { useTranslations } from 'next-intl';

interface SidebarUserMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onOpenProfile: () => void;
  onLogout: () => void;
  isLoggingOut: boolean;
}

export default function SidebarUserMenu({
  anchorEl,
  open,
  onClose,
  onOpenProfile,
  onLogout,
  isLoggingOut,
}: SidebarUserMenuProps) {
  const t = useTranslations('userMenu');

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      slotProps={{
        paper: {
          sx: {
            minWidth: 200,
            borderRadius: '12px',
            p: 0.5,
            boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
            border: 1,
            borderColor: 'divider',
          },
        },
      }}
    >
      <MenuItem
        onClick={() => {
          onClose();
          onOpenProfile();
        }}
        sx={{
          borderRadius: '8px',
          py: 1,
          px: 1.5,
          gap: 1.5,
        }}
      >
        <ListItemIcon sx={{ minWidth: 0, color: 'text.secondary' }}>
          <PersonOutlineRoundedIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography
              sx={{ fontSize: '13px', fontWeight: 600, color: 'text.primary' }}
            >
              {t('profile')}
            </Typography>
          }
        />
      </MenuItem>

      <Divider sx={{ my: 0.5 }} />

      <MenuItem
        onClick={onLogout}
        disabled={isLoggingOut}
        sx={{
          borderRadius: '8px',
          py: 1,
          px: 1.5,
          gap: 1.5,
          '&:hover': {
            bgcolor: (theme) => {
              const palette = theme.vars?.palette ?? theme.palette;
              return palette.error.light
                ? 'rgba(220, 38, 38, 0.08)'
                : 'action.hover';
            },
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            color: (theme) => {
              const palette = theme.vars?.palette ?? theme.palette;
              return palette.error.main;
            },
          }}
        >
          {isLoggingOut ? (
            <CircularProgress size={18} color="inherit" />
          ) : (
            <LogoutRoundedIcon fontSize="small" />
          )}
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography
              sx={{
                fontSize: '13px',
                fontWeight: 700,
                color: (theme) => {
                  const palette = theme.vars?.palette ?? theme.palette;
                  return palette.error.main;
                },
              }}
            >
              {isLoggingOut ? t('loggingOut') : t('logout')}
            </Typography>
          }
        />
      </MenuItem>
    </Menu>
  );
}
