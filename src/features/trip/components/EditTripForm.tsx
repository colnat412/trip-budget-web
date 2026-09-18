'use client';

import { type FormEvent, useState } from 'react';
import { Box, DialogActions, MenuItem, Stack } from '@mui/material';
import { useTranslations } from 'next-intl';

import {
  AppButton,
  AppTextArea,
  AppTextField,
  AppToast,
} from '@/base/components/ui';
import DestinationAutocomplete from './DestinationAutocomplete';
import { useUpdateTrip } from '../hooks/useTripMutation';
import type { Trip, TripStatus } from '../types';

interface EditTripFormProps {
  trip: Trip;
  onClose: () => void;
  onSuccess?: (updatedTrip: Trip) => void;
}

interface TripFormErrors {
  name?: string;
  destination?: string;
  startDate?: string;
  endDate?: string;
}

const CURRENCY_OPTIONS = [
  { value: 'VND', label: 'VND' },
  { value: 'USD', label: 'USD' },
];

const EditTripForm = ({ trip, onClose, onSuccess }: EditTripFormProps) => {
  const t = useTranslations('trip');
  const tMyTrips = useTranslations('myTrips');

  const [name, setName] = useState(trip.name);
  const [destination, setDestination] = useState(trip.destination);
  const [startDate, setStartDate] = useState(trip.startDate);
  const [endDate, setEndDate] = useState(trip.endDate);
  const [baseCurrency, setBaseCurrency] = useState(trip.baseCurrency || 'VND');
  const [status, setStatus] = useState<TripStatus>(trip.status || 'DRAFT');
  const [description, setDescription] = useState(trip.description || '');
  const [errors, setErrors] = useState<TripFormErrors>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const STATUS_OPTIONS: Array<{ value: TripStatus; label: string }> = [
    { value: 'DRAFT', label: t('draft') },
    { value: 'PLANNING', label: t('planning') },
    { value: 'CONFIRMED', label: t('confirmed') },
    { value: 'IN_PROGRESS', label: t('inProgress') },
    { value: 'COMPLETED', label: t('completed') },
    { value: 'ARCHIVED', label: t('archived') },
    { value: 'CANCELLED', label: t('cancelled') },
  ];

  const { updateTrip, isPending } = useUpdateTrip({
    tripId: trip.id,
  });

  const validate = (): boolean => {
    const newErrors: TripFormErrors = {};

    if (!name.trim()) {
      newErrors.name = t('nameRequired');
    }

    if (!destination.trim()) {
      newErrors.destination = t('destinationRequired');
    }

    if (!startDate) {
      newErrors.startDate = t('startDateRequired');
    }

    if (!endDate) {
      newErrors.endDate = t('endDateRequired');
    } else if (startDate && endDate < startDate) {
      newErrors.endDate = t('endDateInvalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    updateTrip(
      {
        name: name.trim(),
        destination: destination.trim(),
        description: description.trim() ? description.trim() : undefined,
        startDate,
        endDate,
        baseCurrency,
        status,
      },
      {
        onSuccess: (response) => {
          setToastMessage(tMyTrips('updateSuccess'));
          const updated = response.data;
          setTimeout(() => {
            if (updated) {
              onSuccess?.(updated);
            }
            onClose();
          }, 800);
        },
        onError: (err) => {
          setToastMessage(err.message || 'Error updating trip');
        },
      },
    );
  };

  return (
    <>
      <AppToast
        open={Boolean(toastMessage)}
        severity="success"
        message={toastMessage || ''}
        onClose={() => setToastMessage(null)}
      />

      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
      >
        <AppTextField
          label={t('name')}
          placeholder={t('namePlaceholder')}
          required
          value={name}
          error={Boolean(errors.name)}
          helperText={errors.name}
          slotProps={{ inputLabel: { shrink: true } }}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) {
              setErrors((prev) => ({ ...prev, name: undefined }));
            }
          }}
        />

        <DestinationAutocomplete
          required
          value={destination}
          error={Boolean(errors.destination)}
          helperText={errors.destination}
          onChange={(val) => {
            setDestination(val);
            if (errors.destination) {
              setErrors((prev) => ({ ...prev, destination: undefined }));
            }
          }}
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <AppTextField
            label={t('startDate')}
            type="date"
            required
            value={startDate}
            error={Boolean(errors.startDate)}
            helperText={errors.startDate}
            slotProps={{ inputLabel: { shrink: true } }}
            onChange={(e) => {
              setStartDate(e.target.value);
              if (errors.startDate) {
                setErrors((prev) => ({ ...prev, startDate: undefined }));
              }
            }}
          />

          <AppTextField
            label={t('endDate')}
            type="date"
            required
            value={endDate}
            error={Boolean(errors.endDate)}
            helperText={errors.endDate}
            slotProps={{ inputLabel: { shrink: true } }}
            onChange={(e) => {
              setEndDate(e.target.value);
              if (errors.endDate) {
                setErrors((prev) => ({ ...prev, endDate: undefined }));
              }
            }}
          />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <AppTextField
              select
              label={t('baseCurrency')}
              value={baseCurrency}
              slotProps={{ inputLabel: { shrink: true } }}
              onChange={(e) => setBaseCurrency(e.target.value)}
            >
              {CURRENCY_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </AppTextField>
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <AppTextField
              select
              label={t('statusLabel')}
              value={status}
              slotProps={{ inputLabel: { shrink: true } }}
              onChange={(e) => setStatus(e.target.value as TripStatus)}
            >
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </AppTextField>
          </Box>
        </Stack>

        <AppTextArea
          label={t('description')}
          placeholder={t('descriptionPlaceholder')}
          value={description}
          minRows={3}
          maxRows={5}
          slotProps={{ inputLabel: { shrink: true } }}
          onChange={(e) => setDescription(e.target.value)}
        />

        <DialogActions sx={{ px: 0, pt: 1, gap: 1.5 }}>
          <AppButton
            intent="secondary"
            size="medium"
            disabled={isPending}
            onClick={onClose}
          >
            {t('cancelButton')}
          </AppButton>
          <AppButton
            type="submit"
            intent="primary"
            size="medium"
            loading={isPending}
          >
            {tMyTrips('saveChanges')}
          </AppButton>
        </DialogActions>
      </Box>
    </>
  );
};

export default EditTripForm;
