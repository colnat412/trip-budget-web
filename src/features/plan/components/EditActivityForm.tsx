'use client';

import React, { useMemo, useState } from 'react';
import { Box, Stack } from '@mui/material';
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded';
import DirectionsSubwayRoundedIcon from '@mui/icons-material/DirectionsSubwayRounded';
import ConfirmationNumberRoundedIcon from '@mui/icons-material/ConfirmationNumberRounded';
import HotelRoundedIcon from '@mui/icons-material/HotelRounded';
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded';
import SportsEsportsRoundedIcon from '@mui/icons-material/SportsEsportsRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import { useTranslations } from 'next-intl';

import {
  AppButton,
  AppNumberInput,
  AppSelect,
  AppTextArea,
  AppTextField,
  type AppSelectOption,
} from '@/base/components/ui';
import type {
  ActivityCategory,
  ActivityStatus,
  PlanActivity,
  UpdateActivityPayload,
} from '../types';

export interface EditActivityFormProps {
  activity: PlanActivity;
  tripCurrency?: string;
  isLoading?: boolean;
  onSubmit: (payload: UpdateActivityPayload) => void;
  onCancel: () => void;
}

const EditActivityForm = ({
  activity,
  tripCurrency = 'VND',
  isLoading = false,
  onSubmit,
  onCancel,
}: EditActivityFormProps) => {
  const tCat = useTranslations('plan.categories');
  const tStatus = useTranslations('plan.statuses');
  const tDialog = useTranslations('plan.dialog');

  const [title, setTitle] = useState(activity.title || '');
  const [category, setCategory] = useState<ActivityCategory>(
    activity.category || 'FOOD_BEVERAGE',
  );
  const [status, setStatus] = useState<ActivityStatus>(
    activity.status || 'PLANNED',
  );
  const [startTime, setStartTime] = useState(
    activity.startTime ? activity.startTime.slice(0, 5) : '',
  );
  const [endTime, setEndTime] = useState(
    activity.endTime ? activity.endTime.slice(0, 5) : '',
  );
  const [location, setLocation] = useState(activity.location || '');
  const [estimatedCost, setEstimatedCost] = useState<number | undefined>(
    activity.estimatedCost > 0 ? activity.estimatedCost : undefined,
  );
  const [note, setNote] = useState(activity.note || '');
  const [titleError, setTitleError] = useState('');

  const categoryOptions: AppSelectOption[] = useMemo(
    () => [
      {
        value: 'FOOD_BEVERAGE',
        label: tCat('FOOD_BEVERAGE'),
        icon: <RestaurantRoundedIcon fontSize="small" />,
      },
      {
        value: 'TRANSPORTATION',
        label: tCat('TRANSPORTATION'),
        icon: <DirectionsSubwayRoundedIcon fontSize="small" />,
      },
      {
        value: 'SIGHTSEEING',
        label: tCat('SIGHTSEEING'),
        icon: <ConfirmationNumberRoundedIcon fontSize="small" />,
      },
      {
        value: 'ACCOMMODATION',
        label: tCat('ACCOMMODATION'),
        icon: <HotelRoundedIcon fontSize="small" />,
      },
      {
        value: 'SHOPPING',
        label: tCat('SHOPPING'),
        icon: <ShoppingBagRoundedIcon fontSize="small" />,
      },
      {
        value: 'ENTERTAINMENT',
        label: tCat('ENTERTAINMENT'),
        icon: <SportsEsportsRoundedIcon fontSize="small" />,
      },
      {
        value: 'OTHER',
        label: tCat('OTHER'),
        icon: <MoreHorizRoundedIcon fontSize="small" />,
      },
    ],
    [tCat],
  );

  const statusOptions: AppSelectOption[] = useMemo(
    () => [
      { value: 'PLANNED', label: tStatus('PLANNED') },
      { value: 'IN_PROGRESS', label: tStatus('IN_PROGRESS') },
      { value: 'COMPLETED', label: tStatus('COMPLETED') },
      { value: 'SKIPPED', label: tStatus('SKIPPED') },
    ],
    [tStatus],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setTitleError(tDialog('titleLabel'));
      return;
    }
    setTitleError('');

    onSubmit({
      title: title.trim(),
      category,
      status,
      startTime: startTime.trim() || undefined,
      endTime: endTime.trim() || undefined,
      location: location.trim() || undefined,
      estimatedCost: estimatedCost && estimatedCost > 0 ? estimatedCost : 0,
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
            <AppSelect
              label={tDialog('statusLabel')}
              value={status}
              onChange={(e) => setStatus(e.target.value as ActivityStatus)}
              options={statusOptions}
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
              onChange={(e) => setStartTime(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <AppTextField
              label={tDialog('endTimeLabel')}
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
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
              label={tDialog('locationLabel')}
              placeholder={tDialog('locationPlaceholder')}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
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

export default EditActivityForm;
