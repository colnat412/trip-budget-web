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
  fullWidth = true,
  size = 'medium',
  value,
  onChange,
  ...selectProps
}: AppSelectProps) => {
  const labelId = React.useId();

  return (
    <FormControl fullWidth={fullWidth} error={error} size={size}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        {...selectProps}
        labelId={labelId}
        label={label}
        value={value}
        onChange={onChange}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
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
