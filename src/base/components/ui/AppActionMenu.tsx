'use client';

import { useState, type MouseEvent, type ReactNode } from 'react';
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';

export interface AppActionMenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}

export interface AppActionMenuProps {
  items: AppActionMenuItem[];
  trigger?: ReactNode;
  size?: 'small' | 'medium';
  ariaLabel?: string;
}

export default function AppActionMenu({
  items,
  trigger,
  size = 'small',
  ariaLabel = 'Actions menu',
}: AppActionMenuProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event?: MouseEvent) => {
    event?.stopPropagation();
    setAnchorEl(null);
  };

  const handleItemClick = (item: AppActionMenuItem, event: MouseEvent) => {
    event.stopPropagation();
    handleClose();
    item.onClick();
  };

  return (
    <>
      {trigger ? (
        <span onClick={handleOpen} style={{ display: 'inline-flex' }}>
          {trigger}
        </span>
      ) : (
        <IconButton
          size={size}
          onClick={handleOpen}
          aria-label={ariaLabel}
          sx={{
            color: 'text.secondary',
            '&:hover': {
              color: 'text.primary',
              bgcolor: 'action.hover',
            },
          }}
        >
          <MoreVertRoundedIcon fontSize={size} />
        </IconButton>
      )}

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={(_e) => handleClose(_e as unknown as MouseEvent)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            sx: {
              minWidth: 160,
              borderRadius: '12px',
              p: 0.5,
              boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
              border: 1,
              borderColor: 'divider',
            },
          },
        }}
      >
        {items.map((item) => (
          <MenuItem
            key={item.id}
            disabled={item.disabled}
            onClick={(e) => handleItemClick(item, e)}
            sx={{
              borderRadius: '8px',
              py: 0.85,
              px: 1.5,
              gap: 1.25,
              color: (theme) => {
                const palette = theme.vars?.palette ?? theme.palette;
                return item.danger ? palette.error.main : 'text.primary';
              },
              '&:hover': {
                bgcolor: item.danger
                  ? 'rgba(239, 68, 68, 0.08)'
                  : 'action.hover',
              },
            }}
          >
            {item.icon && (
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  color: (theme) => {
                    const palette = theme.vars?.palette ?? theme.palette;
                    return item.danger ? palette.error.main : 'text.secondary';
                  },
                }}
              >
                {item.icon}
              </ListItemIcon>
            )}
            <ListItemText
              primary={
                <Typography
                  sx={{
                    fontSize: '13px',
                    fontWeight: item.danger ? 700 : 500,
                  }}
                >
                  {item.label}
                </Typography>
              }
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
