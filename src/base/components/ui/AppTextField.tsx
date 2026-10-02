'use client';

import { TextField, type TextFieldProps } from '@mui/material';

export interface AppTextFieldProps extends Omit<TextFieldProps, 'variant'> {
  variant?: 'outlined' | 'filled' | 'standard';
  variantType?: 'form' | 'search';
}

const AppTextField = ({
  fullWidth = true,
  size = 'medium',
  variant = 'outlined',
  variantType = 'form',
  sx,
  ...textFieldProps
}: AppTextFieldProps) => {
  const searchSx =
    variantType === 'search'
      ? {
          '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            bgcolor: 'background.paper',
            height: 38,
            minHeight: '38px !important',
            fontSize: '13px',
            '& fieldset': {
              borderColor: 'divider',
            },
            '&:hover fieldset': {
              borderColor: 'primary.main',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'primary.main',
              borderWidth: '1.5px',
            },
          },
          '& .MuiOutlinedInput-input': {
            py: '8px !important',
            px: '6px !important',
            fontSize: '13px',
          },
        }
      : undefined;

  return (
    <TextField
      {...textFieldProps}
      fullWidth={fullWidth}
      size={size}
      variant={variant}
      sx={{
        ...searchSx,
        ...sx,
      }}
    />
  );
};

export default AppTextField;
