'use client';

import { TextFieldProps } from '@mui/material';

import AppTextField from './AppTextField';

export type AppTextAreaProps = TextFieldProps & {
  minRows?: number;
  maxRows?: number;
};

export default function AppTextArea({
  minRows = 4,
  maxRows = 8,
  ...textAreaProps
}: AppTextAreaProps) {
  return (
    <AppTextField
      {...textAreaProps}
      multiline
      minRows={minRows}
      maxRows={maxRows}
    />
  );
}
