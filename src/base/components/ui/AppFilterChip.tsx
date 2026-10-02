'use client';

import React from 'react';
import {
  Chip,
  type ChipProps,
  Box,
  Typography,
  Stack,
  type SxProps,
  type Theme,
} from '@mui/material';

export interface AppFilterChipOption<T = string> {
  value: T;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface AppFilterChipProps extends Omit<ChipProps, 'onClick'> {
  selected?: boolean;
  onClick?: () => void;
  count?: number;
}

export const AppFilterChip = ({
  selected = false,
  onClick,
  count,
  label,
  size = 'small',
  sx,
  ...chipProps
}: AppFilterChipProps) => {
  return (
    <Chip
      {...chipProps}
      size={size}
      onClick={onClick}
      label={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <span>{label}</span>
          {typeof count === 'number' && (
            <Box
              component="span"
              sx={{
                px: 0.6,
                py: 0.1,
                fontSize: '10.5px',
                fontWeight: 700,
                borderRadius: '99px',
                bgcolor: selected ? 'rgba(255, 255, 255, 0.25)' : 'action.selected',
                color: selected ? '#FFFFFF' : 'primary.main',
                lineHeight: 1.2,
              }}
            >
              {count}
            </Box>
          )}
        </Box>
      }
      sx={{
        height: size === 'small' ? 28 : 34,
        fontSize: size === 'small' ? '12px' : '13px',
        fontWeight: selected ? 700 : 500,
        borderRadius: '8px',
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'all 0.15s ease',
        border: '1px solid',
        borderColor: selected ? 'primary.main' : 'divider',
        bgcolor: selected ? 'primary.main' : 'background.paper',
        color: selected ? 'primary.contrastText' : 'text.primary',
        '&:hover': {
          bgcolor: selected ? 'primary.dark' : 'action.hover',
          borderColor: 'primary.main',
          color: selected ? 'primary.contrastText' : 'primary.main',
        },
        ...sx,
      }}
    />
  );
};

export interface AppFilterChipGroupProps<T = string> {
  label?: string;
  options: AppFilterChipOption<T>[];
  value: T;
  onChange: (value: T) => void;
  showAll?: boolean;
  allLabel?: string;
  allValue?: T;
  scrollable?: boolean;
  sx?: SxProps<Theme>;
}

export const AppFilterChipGroup = <T extends string | number>({
  label,
  options,
  value,
  onChange,
  showAll = true,
  allLabel = 'Tất cả',
  allValue = '' as unknown as T,
  scrollable = true,
  sx,
}: AppFilterChipGroupProps<T>) => {
  const isAllSelected = value === allValue;

  return (
    <Stack
      direction="row"
      spacing={0.75}
      sx={{
        alignItems: 'center',
        overflowX: scrollable ? 'auto' : 'visible',
        flexWrap: scrollable ? 'nowrap' : 'wrap',
        py: 0.25,
        WebkitOverflowScrolling: 'touch',
        '::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
        ...sx,
      }}
    >
      {label && (
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            fontSize: '11.5px',
            flexShrink: 0,
          }}
        >
          {label}
        </Typography>
      )}

      {showAll && (
        <AppFilterChip
          label={allLabel}
          selected={isAllSelected}
          onClick={() => onChange(allValue)}
        />
      )}

      {options.map((opt) => {
        const isSelected =
          typeof value === 'string' && typeof opt.value === 'string'
            ? opt.value.trim().toLowerCase() === value.trim().toLowerCase() && Boolean(value.trim())
            : opt.value === value;
        return (
          <AppFilterChip
            key={String(opt.value)}
            label={opt.label}
            count={opt.count}
            icon={opt.icon as React.ReactElement | undefined}
            selected={isSelected}
            onClick={() => onChange(isSelected ? allValue : opt.value)}
          />
        );
      })}
    </Stack>
  );
};

export default AppFilterChip;
