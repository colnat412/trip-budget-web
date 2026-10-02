'use client';

import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  type SelectProps,
  type SelectChangeEvent,
  Box,
} from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

export interface AppSelectOption {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
}

export interface AppSelectProps extends Omit<SelectProps, 'onChange'> {
  label: string;
  options: AppSelectOption[];
  helperText?: string;
  error?: boolean;
  variantType?: 'form' | 'filter' | 'compact';
  onChange?: (
    event: SelectChangeEvent<unknown>,
    child: React.ReactNode,
  ) => void;
}

const AppSelect = ({
  label,
  options,
  helperText,
  error,
  fullWidth,
  size = 'medium',
  value,
  variantType = 'form',
  onChange,
  sx,
  ...selectProps
}: AppSelectProps) => {
  const labelId = React.useId();

  if (variantType === 'filter') {
    const isFiltered = Boolean(value && value !== 'ALL' && value !== '');
    const selectedOption = options.find(
      (opt) => String(opt.value) === String(value),
    );

    return (
      <Select
        {...selectProps}
        value={value ?? ''}
        onChange={onChange}
        displayEmpty
        size="small"
        fullWidth={fullWidth ?? false}
        IconComponent={KeyboardArrowDownRoundedIcon}
        renderValue={(selected) => {
          if (!selected || selected === 'ALL' || selected === '') {
            return (
              <Box
                component="span"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 600,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'block',
                }}
              >
                {label}
              </Box>
            );
          }
          return (
            <Box
              component="span"
              sx={{
                color: 'primary.main',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                minWidth: 0,
                overflow: 'hidden',
              }}
            >
              {selectedOption?.icon}
              <Box
                component="span"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: 'block',
                }}
              >
                {selectedOption?.label || String(selected)}
              </Box>
            </Box>
          );
        }}
        MenuProps={{
          slotProps: {
            paper: {
              sx: {
                mt: 0.75,
                borderRadius: '12px',
                boxShadow: '0 10px 28px rgba(0,0,0,0.12)',
                border: '1px solid',
                borderColor: 'divider',
                minWidth: 150,
                maxHeight: 300,
              },
            },
          },
        }}
        sx={{
          height: 38,
          minHeight: '38px !important',
          borderRadius: '10px',
          bgcolor: isFiltered ? 'action.selected' : 'background.paper',
          border: '1px solid',
          borderColor: isFiltered ? 'primary.main' : 'divider',
          fontSize: '13px',
          fontWeight: 600,
          transition: 'all 0.15s ease',
          '& fieldset': {
            border: 'none',
          },
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: isFiltered ? 'action.selected' : 'action.hover',
          },
          '& .MuiSelect-select': {
            py: '7px !important',
            px: '12px !important',
            pr: '34px !important',
            fontSize: '13px',
            minHeight: 'unset !important',
            display: 'flex',
            alignItems: 'center',
          },
          '& .MuiSelect-icon': {
            fontSize: 18,
            right: '8px',
            color: isFiltered ? 'primary.main' : 'text.secondary',
          },
          ...sx,
        }}
      >
        {options.map((option) => {
          const isSelected = String(option.value) === String(value);
          return (
            <MenuItem
              key={String(option.value)}
              value={option.value}
              selected={isSelected}
              sx={{
                fontSize: '13px',
                fontWeight: isSelected ? 700 : 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {option.icon}
                <span>{option.label}</span>
              </Box>
              {isSelected && (
                <CheckRoundedIcon
                  sx={{ fontSize: 16, color: 'primary.main' }}
                />
              )}
            </MenuItem>
          );
        })}
      </Select>
    );
  }

  if (variantType === 'compact') {
    const selectedOption = options.find(
      (opt) => String(opt.value) === String(value),
    );

    return (
      <Select
        {...selectProps}
        value={value ?? ''}
        onChange={onChange}
        size="small"
        fullWidth={fullWidth ?? false}
        IconComponent={KeyboardArrowDownRoundedIcon}
        renderValue={(selected) => (
          <Box
            component="span"
            sx={{
              fontWeight: 600,
              fontSize: '12px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'block',
            }}
          >
            {selectedOption?.label || String(selected)}
          </Box>
        )}
        MenuProps={{
          slotProps: {
            paper: {
              sx: {
                mt: 0.5,
                borderRadius: '10px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                border: '1px solid',
                borderColor: 'divider',
                minWidth: 120,
                maxHeight: 260,
              },
            },
          },
        }}
        sx={{
          height: 32,
          minHeight: '32px !important',
          borderRadius: '8px',
          bgcolor: 'background.paper',
          fontSize: '12px',
          fontWeight: 600,
          border: '1px solid',
          borderColor: 'divider',
          '& fieldset': {
            border: 'none',
          },
          '&:hover': {
            borderColor: 'primary.main',
          },
          '& .MuiSelect-select': {
            py: '5px !important',
            px: '10px !important',
            pr: '28px !important',
            fontSize: '12px',
            minHeight: 'unset !important',
            display: 'flex',
            alignItems: 'center',
          },
          '& .MuiSelect-icon': {
            fontSize: 16,
            right: '6px',
            color: 'text.secondary',
          },
          ...sx,
        }}
      >
        {options.map((option) => {
          const isSelected = String(option.value) === String(value);
          return (
            <MenuItem
              key={String(option.value)}
              value={option.value}
              selected={isSelected}
              sx={{
                fontSize: '12px',
                fontWeight: isSelected ? 700 : 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                {option.icon}
                <span>{option.label}</span>
              </Box>
              {isSelected && (
                <CheckRoundedIcon
                  sx={{ fontSize: 15, color: 'primary.main' }}
                />
              )}
            </MenuItem>
          );
        })}
      </Select>
    );
  }

  const isFullWidth = fullWidth ?? true;
  return (
    <FormControl fullWidth={isFullWidth} error={error} size={size}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        {...selectProps}
        labelId={labelId}
        label={label}
        value={value}
        onChange={onChange}
        sx={sx}
      >
        {options.map((option) => (
          <MenuItem key={String(option.value)} value={option.value}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {option.icon}
              <span>{option.label}</span>
            </Box>
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default AppSelect;
