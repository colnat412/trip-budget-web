'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Autocomplete,
  type AutocompleteInputChangeReason,
  Box,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import WhatshotRoundedIcon from '@mui/icons-material/WhatshotRounded';
import { useTranslations } from 'next-intl';

import { AppTextField } from '@/base/components/ui';
import type { DestinationItem } from '@/app/api/trip/destinations/route';

export interface DestinationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
}

const DestinationAutocomplete = ({
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  label,
  placeholder,
}: DestinationAutocompleteProps) => {
  const t = useTranslations('trip');
  const [options, setOptions] = useState<DestinationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchDestinations = useCallback(async (query: string) => {
    setLoading(true);
    try {
      const url = query
        ? `/api/trip/destinations?q=${encodeURIComponent(query)}`
        : '/api/trip/destinations';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.destinations)) {
          setOptions(data.destinations);
        }
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    const loadPopular = async () => {
      try {
        const res = await fetch('/api/trip/destinations');
        if (res.ok && !ignore) {
          const data = await res.json();
          if (Array.isArray(data?.destinations)) {
            setOptions(data.destinations);
          }
        }
      } catch {}
    };

    loadPopular();
    return () => {
      ignore = true;
    };
  }, []);

  const handleInputChange = (
    _event: React.SyntheticEvent,
    newInputValue: string,
    reason: AutocompleteInputChangeReason,
  ) => {
    setInputValue(newInputValue);

    if (reason === 'input') {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        fetchDestinations(newInputValue.trim());
      }, 300);
    } else if (reason === 'clear') {
      fetchDestinations('');
      onChange('');
    }
  };

  const currentOption = useMemo<DestinationItem | null>(() => {
    if (!value) return null;
    const found = options.find(
      (opt) => opt.label.toLowerCase() === value.toLowerCase(),
    );
    if (found) return found;
    return {
      id: 'custom-selected',
      name: value,
      country: '',
      label: value,
    };
  }, [value, options]);

  return (
    <Autocomplete<DestinationItem, false, false, false>
      disabled={disabled}
      options={options}
      loading={loading}
      value={currentOption}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onChange={(_event, selected) => {
        if (selected) {
          onChange(selected.label);
        } else {
          onChange('');
        }
      }}
      getOptionLabel={(option) =>
        typeof option === 'string' ? option : option.label
      }
      isOptionEqualToValue={(option, val) => option.label === val.label}
      noOptionsText={t('noDestinationsFound')}
      loadingText={t('searchingDestinations')}
      renderOption={(props, option) => {
        const { key, ...restProps } = props;
        return (
          <Box component="li" key={key} {...restProps}>
            <Stack
              direction="row"
              spacing={1.5}
              sx={{
                width: '100%',
                alignItems: 'center',
                py: 0.5,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  bgcolor: option.isPopular ? 'warning.light' : 'action.hover',
                  color: option.isPopular ? 'warning.dark' : 'primary.main',
                  flexShrink: 0,
                }}
              >
                {option.isPopular ? (
                  <WhatshotRoundedIcon sx={{ fontSize: 18 }} />
                ) : (
                  <PlaceRoundedIcon sx={{ fontSize: 18 }} />
                )}
              </Box>
              <Stack spacing={0.2} sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {option.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '11px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {[option.region, option.country].filter(Boolean).join(' · ')}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        );
      }}
      renderInput={(params) => {
        const { slotProps, ...restParams } = params;
        return (
          <AppTextField
            {...restParams}
            label={label || t('destination')}
            placeholder={placeholder || t('destinationPlaceholder')}
            required={required}
            error={error}
            helperText={helperText || t('destinationHelper')}
            slotProps={{
              ...slotProps,
              input: {
                ...slotProps.input,
                endAdornment: (
                  <>
                    {loading ? (
                      <CircularProgress
                        color="inherit"
                        size={18}
                        sx={{ mr: 1 }}
                      />
                    ) : null}
                    {slotProps.input.endAdornment}
                  </>
                ),
              },
            }}
          />
        );
      }}
    />
  );
};

export default DestinationAutocomplete;
