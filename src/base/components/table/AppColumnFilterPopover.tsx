'use client';

import React, { useState } from 'react';
import {
  Box,
  Checkbox,
  IconButton,
  InputAdornment,
  Popover,
  Stack,
  Typography,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FilterAltOffRoundedIcon from '@mui/icons-material/FilterAltOffRounded';
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';

import { useTranslations } from 'next-intl';

import { AppButton, AppTextField } from '../ui';
import type { AppTableColumn, ColumnFilterValue } from './types';

interface AppColumnFilterPopoverProps<T> {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  column: AppTableColumn<T>;
  currentValue: ColumnFilterValue;
  onApply: (value: ColumnFilterValue) => void;
  onReset: () => void;
}

interface FilterPopoverFormProps<T> {
  column: AppTableColumn<T>;
  currentValue: ColumnFilterValue;
  onApply: (value: ColumnFilterValue) => void;
  onReset: () => void;
  onClose: () => void;
}

function FilterPopoverForm<T>({
  column,
  currentValue,
  onApply,
  onReset,
  onClose,
}: FilterPopoverFormProps<T>) {
  const t = useTranslations('table');
  const filterType = column.filterType || 'text';

  const [draftText, setDraftText] = useState<string>(() =>
    typeof currentValue === 'string' ? currentValue : '',
  );
  const [draftSelected, setDraftSelected] = useState<Array<string | number>>(
    () => {
      if (Array.isArray(currentValue)) return currentValue;
      if (
        currentValue !== undefined &&
        currentValue !== null &&
        currentValue !== ''
      ) {
        return [currentValue];
      }
      return [];
    },
  );

  const handleApply = () => {
    if (filterType === 'text') {
      onApply(draftText.trim() ? draftText.trim() : null);
    } else if (filterType === 'select') {
      onApply(draftSelected.length > 0 ? draftSelected : null);
    }
    onClose();
  };

  const handleReset = () => {
    setDraftText('');
    setDraftSelected([]);
    onReset();
    onClose();
  };

  const handleToggleSelectOption = (value: string | number) => {
    setDraftSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const handleSelectAll = () => {
    if (!column.filterOptions) return;
    if (draftSelected.length === column.filterOptions.length) {
      setDraftSelected([]);
    } else {
      setDraftSelected(column.filterOptions.map((opt) => opt.value));
    }
  };

  const isFiltered =
    filterType === 'text'
      ? Boolean(currentValue && String(currentValue).trim())
      : Boolean(Array.isArray(currentValue) && currentValue.length > 0);

  return (
    <Stack spacing={1.5}>
      <Stack
        direction="row"
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          sx={{
            fontSize: '12px',
            fontWeight: 800,
            textTransform: 'uppercase',
            color: 'text.secondary',
            letterSpacing: '0.5px',
          }}
        >
          {t('filterBy', { column: column.label })}
        </Typography>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            p: 0.5,
            color: 'text.secondary',
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          <CloseRoundedIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Stack>

      {filterType === 'text' && (
        <Box sx={{ pt: 0.5 }}>
          <AppTextField
            size="small"
            placeholder={
              column.filterPlaceholder ||
              t('filterPlaceholder', { column: column.label.toLowerCase() })
            }
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleApply();
              }
            }}
            autoFocus
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon
                      sx={{ fontSize: '18px', color: 'text.disabled' }}
                    />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
      )}

      {filterType === 'select' && column.filterOptions && (
        <Stack spacing={0.75}>
          {column.filterOptions.length > 3 && (
            <Box
              component="button"
              type="button"
              onClick={handleSelectAll}
              sx={{
                background: 'none',
                border: 'none',
                p: 0,
                fontSize: '12px',
                fontWeight: 600,
                color: 'primary.main',
                cursor: 'pointer',
                textAlign: 'left',
                width: 'fit-content',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              {draftSelected.length === column.filterOptions.length
                ? t('deselectAll')
                : t('selectAll')}
            </Box>
          )}

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0.25,
              maxHeight: 220,
              overflowY: 'auto',
              pr: 0.5,
              '&::-webkit-scrollbar': { width: '4px' },
              '&::-webkit-scrollbar-thumb': {
                bgcolor: 'divider',
                borderRadius: '4px',
              },
            }}
          >
            {column.filterOptions.map((option) => {
              const isChecked = draftSelected.includes(option.value);
              return (
                <Box
                  key={String(option.value)}
                  component="label"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    py: 0.5,
                    px: 0.75,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    userSelect: 'none',
                    bgcolor: isChecked ? 'action.hover' : 'transparent',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <Checkbox
                    size="small"
                    checked={isChecked}
                    onChange={() => handleToggleSelectOption(option.value)}
                    icon={
                      <CheckBoxOutlineBlankRoundedIcon
                        sx={{ fontSize: '18px', color: 'text.secondary' }}
                      />
                    }
                    checkedIcon={
                      <CheckBoxRoundedIcon
                        sx={{ fontSize: '18px', color: 'primary.main' }}
                      />
                    }
                    sx={{
                      p: 0,
                      color: 'text.secondary',
                      '&.Mui-checked': { color: 'primary.main' },
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: '13px',
                      fontWeight: isChecked ? 600 : 400,
                      color: 'text.primary',
                      lineHeight: 1.4,
                      flexGrow: 1,
                    }}
                  >
                    {option.label}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Stack>
      )}

      <Stack
        direction="row"
        spacing={1}
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          pt: 1,
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        {isFiltered ? (
          <AppButton
            size="small"
            intent="secondary"
            startIcon={<FilterAltOffRoundedIcon sx={{ fontSize: 14 }} />}
            onClick={handleReset}
            sx={{ fontSize: '11px', px: 1, py: 0.4, minHeight: 28 }}
          >
            {t('clearFilter')}
          </AppButton>
        ) : (
          <Box />
        )}

        <AppButton
          size="small"
          intent="primary"
          onClick={handleApply}
          sx={{ fontSize: '11px', px: 1.5, py: 0.4, minHeight: 28 }}
        >
          {t('apply')}
        </AppButton>
      </Stack>
    </Stack>
  );
}

export default function AppColumnFilterPopover<T>({
  anchorEl,
  open,
  onClose,
  column,
  currentValue,
  onApply,
  onReset,
}: AppColumnFilterPopoverProps<T>) {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      slotProps={{
        paper: {
          sx: {
            p: 2,
            width: 280,
            borderRadius: '14px',
            border: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
            boxShadow:
              '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          },
        },
      }}
    >
      {open && (
        <FilterPopoverForm
          column={column}
          currentValue={currentValue}
          onApply={onApply}
          onReset={onReset}
          onClose={onClose}
        />
      )}
    </Popover>
  );
}
