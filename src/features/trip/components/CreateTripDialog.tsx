'use client';

import { type FormEvent, useState } from 'react';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import FlightTakeoffRoundedIcon from '@mui/icons-material/FlightTakeoffRounded';
import { useTranslations } from 'next-intl';

import {
  AppButton,
  AppTextArea,
  AppTextField,
  AppToast,
} from '@/base/components/ui';
import { useTripContext } from '../context/TripContext';
import { useCreateTrip } from '../hooks/useTripMutation';

interface CreateTripDialogProps {
  open: boolean;
  onClose: () => void;
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
  // { value: 'EUR', label: 'EUR' },
  // { value: 'JPY', label: 'JPY' },
  // { value: 'THB', label: 'THB' },
];

const CreateTripDialog = ({
  open,
  onClose,
}: CreateTripDialogProps) => {
  const t = useTranslations('trip');
  const { refetchTrips, selectTrip } = useTripContext();
  const { createMutation } = useCreateTrip();

  const [name, setName] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [baseCurrency, setBaseCurrency] = useState('VND');
  const [description, setDescription] = useState('');
  const [formErrors, setFormErrors] = useState<TripFormErrors>({});
  const [successToastOpen, setSuccessToastOpen] = useState(false);

  const resetForm = () => {
    setName('');
    setDestination('');
    setStartDate('');
    setEndDate('');
    setBaseCurrency('VND');
    setDescription('');
    setFormErrors({});
  };

  const handleClose = () => {
    if (!createMutation.isPending) {
      resetForm();
      onClose();
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: TripFormErrors = {};
    const trimmedName = name.trim();
    const trimmedDestination = destination.trim();

    if (!trimmedName) {
      nextErrors.name = t('nameRequired');
    }

    if (!trimmedDestination) {
      nextErrors.destination = t('destinationRequired');
    }

    if (!startDate) {
      nextErrors.startDate = t('startDateRequired');
    }

    if (!endDate) {
      nextErrors.endDate = t('endDateRequired');
    } else if (startDate && endDate < startDate) {
      nextErrors.endDate = t('endDateInvalid');
    }

    setFormErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    createMutation.mutate(
      {
        name: trimmedName,
        destination: trimmedDestination,
        startDate,
        endDate,
        baseCurrency,
        description: description.trim() || undefined,
      },
      {
        onSuccess: (response) => {
          setSuccessToastOpen(true);
          resetForm();
          onClose();
          void refetchTrips();
          if (response?.data?.id) {
            selectTrip(response.data.id);
          }
        },
      },
    );
  };

  return (
    <>
      <AppToast
        open={successToastOpen}
        severity="success"
        message={t('createSuccess')}
        onClose={() => setSuccessToastOpen(false)}
      />

      <AppToast
        open={Boolean(createMutation.error)}
        severity="error"
        message={createMutation.error?.message ?? ''}
        onClose={createMutation.clearError}
      />

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: {
              borderRadius: '20px',
              p: { xs: 1, sm: 2 },
            },
          },
        }}
      >
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column' }}
        >
          <DialogTitle
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
            }}
          >
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '12px',
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                }}
              >
                <FlightTakeoffRoundedIcon />
              </Box>
              <Box>
                <Typography
                  component="h2"
                  sx={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '20px',
                    fontWeight: 700,
                    color: 'text.primary',
                  }}
                >
                  {t('createTitle')}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {t('createDescription')}
                </Typography>
              </Box>
            </Stack>

            <IconButton
              onClick={handleClose}
              disabled={createMutation.isPending}
              size="small"
            >
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </DialogTitle>

          <DialogContent
            sx={{
              p: { xs: 2, sm: 2.5 },
              pt: '20px !important',
              display: 'flex',
              flexDirection: 'column',
              gap: 2.5,
            }}
          >
            <AppTextField
              label={t('name')}
              placeholder={t('namePlaceholder')}
              required
              value={name}
              error={Boolean(formErrors.name)}
              helperText={formErrors.name}
              disabled={createMutation.isPending}
              // slotProps={{
              //   inputLabel: { shrink: true },
              // }}
              onChange={(e) => {
                setName(e.target.value);
                setFormErrors((prev) => ({ ...prev, name: undefined }));
                createMutation.clearError();
              }}
            />

            <AppTextField
              label={t('destination')}
              placeholder={t('destinationPlaceholder')}
              required
              value={destination}
              error={Boolean(formErrors.destination)}
              helperText={formErrors.destination}
              disabled={createMutation.isPending}
              // slotProps={{
              //   inputLabel: { shrink: true },
              // }}
              onChange={(e) => {
                setDestination(e.target.value);
                setFormErrors((prev) => ({ ...prev, destination: undefined }));
                createMutation.clearError();
              }}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <AppTextField
                label={t('startDate')}
                type="date"
                required
                value={startDate}
                error={Boolean(formErrors.startDate)}
                helperText={formErrors.startDate}
                disabled={createMutation.isPending}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setFormErrors((prev) => ({ ...prev, startDate: undefined }));
                  createMutation.clearError();
                }}
              />

              <AppTextField
                label={t('endDate')}
                type="date"
                required
                value={endDate}
                error={Boolean(formErrors.endDate)}
                helperText={formErrors.endDate}
                disabled={createMutation.isPending}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setFormErrors((prev) => ({ ...prev, endDate: undefined }));
                  createMutation.clearError();
                }}
              />
            </Stack>

            <AppTextField
              select
              label={t('baseCurrency')}
              value={baseCurrency}
              disabled={createMutation.isPending}
              onChange={(e) => setBaseCurrency(e.target.value)}
            >
              {CURRENCY_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </AppTextField>

            <AppTextArea
              label={t('description')}
              placeholder={t('descriptionPlaceholder')}
              value={description}
              disabled={createMutation.isPending}
              minRows={3}
              maxRows={5}
              // slotProps={{
              //   inputLabel: { shrink: true },
              // }}
              onChange={(e) => setDescription(e.target.value)}
            />
          </DialogContent>

          <DialogActions sx={{ p: 2, gap: 1.5 }}>
            <AppButton
              intent="secondary"
              size="medium"
              onClick={handleClose}
              disabled={createMutation.isPending}
            >
              {t('cancelButton')}
            </AppButton>
            <AppButton
              type="submit"
              intent="primary"
              size="medium"
              loading={createMutation.isPending}
            >
              {t('createButton')}
            </AppButton>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default CreateTripDialog;
