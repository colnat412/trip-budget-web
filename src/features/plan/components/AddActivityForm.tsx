'use client';

import React, { useMemo, useState } from 'react';
import { Box, Stack } from '@mui/material';
import { useTranslations } from 'next-intl';

import {
  AppButton,
  AppNumberInput,
  AppSelect,
  AppTextArea,
  AppTextField,
  type AppSelectOption,
} from '@/base/components/ui';
import { getCategorySelectOptions } from '@/base/constants';
import type { ActivityCategory, CreateActivityPayload } from '../types';
import LocationAutocompleteInput from './LocationAutocompleteInput';

export interface AddActivityFormProps {
  tripCurrency?: string;
  isLoading?: boolean;
  onSubmit: (payload: CreateActivityPayload) => void;
  onCancel: () => void;
}

const AddActivityForm = ({
  tripCurrency = 'VND',
  isLoading = false,
  onSubmit,
  onCancel,
}: AddActivityFormProps) => {
  const tCat = useTranslations('plan.categories');
  const tDialog = useTranslations('plan.dialog');

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ActivityCategory>('FOOD_BEVERAGE');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [estimatedCost, setEstimatedCost] = useState<number | undefined>(
    undefined,
  );
  const [note, setNote] = useState('');
  const [titleError, setTitleError] = useState('');
  const [timeError, setTimeError] = useState('');

  const categoryOptions: AppSelectOption[] = useMemo(
    () => getCategorySelectOptions(tCat),
    [tCat],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setTitleError(tDialog('titleRequired'));
      return;
    }
    setTitleError('');

    if (startTime && endTime && endTime < startTime) {
      setTimeError(tDialog('timeOrderInvalid'));
      return;
    }
    setTimeError('');

    onSubmit({
      title: title.trim(),
      category,
      startTime: startTime.trim() || undefined,
      endTime: endTime.trim() || undefined,
      location: location.trim() || undefined,
      estimatedCost:
        estimatedCost && estimatedCost > 0 ? estimatedCost : undefined,
      note: note.trim() || undefined,
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <Stack spacing={2.5}>
        <AppTextField
          label={tDialog('titleLabel')}
          placeholder={tDialog('titlePlaceholder')}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (titleError) setTitleError('');
          }}
          error={!!titleError}
          helperText={titleError}
          fullWidth
          required
          autoFocus
        />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <AppSelect
              label={tDialog('categoryLabel')}
              value={category}
              onChange={(e) => setCategory(e.target.value as ActivityCategory)}
              options={categoryOptions}
              fullWidth
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <AppNumberInput
              label={tDialog('estimatedCostLabel')}
              value={estimatedCost}
              onValueChange={(val) => setEstimatedCost(val)}
              currencySuffix={tripCurrency}
              fullWidth
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <AppTextField
              label={tDialog('startTimeLabel')}
              type="time"
              value={startTime}
              onChange={(e) => {
                setStartTime(e.target.value);
                if (timeError) setTimeError('');
              }}
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <AppTextField
              label={tDialog('endTimeLabel')}
              type="time"
              value={endTime}
              onChange={(e) => {
                setEndTime(e.target.value);
                if (timeError) setTimeError('');
              }}
              error={!!timeError}
              helperText={timeError}
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
            />
          </Box>
        </Box>

        <LocationAutocompleteInput
          label={tDialog('locationLabel')}
          placeholder={tDialog('locationPlaceholder')}
          value={location}
          onChange={(newVal) => setLocation(newVal)}
          fullWidth
        />

        <AppTextArea
          label={tDialog('noteLabel')}
          placeholder={tDialog('notePlaceholder')}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          fullWidth
        />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1.5,
            pt: 1,
          }}
        >
          <AppButton intent="secondary" onClick={onCancel} disabled={isLoading}>
            {tDialog('cancelBtn')}
          </AppButton>
          <AppButton type="submit" intent="primary" loading={isLoading}>
            {tDialog('saveBtn')}
          </AppButton>
        </Box>
      </Stack>
    </Box>
  );
};

export default AddActivityForm;
