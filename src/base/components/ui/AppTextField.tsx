'use client';

import { TextField, TextFieldProps } from '@mui/material';

export type AppTextFieldProps = TextFieldProps;

const AppTextField = ({
  fullWidth = true,
  size = 'medium',
  variant = 'outlined',
  ...textFieldProps
}: AppTextFieldProps) => {
  return (
    <TextField
      {...textFieldProps}
      fullWidth={fullWidth}
      size={size}
      variant={variant}
    />
  );
};

export default AppTextField;
