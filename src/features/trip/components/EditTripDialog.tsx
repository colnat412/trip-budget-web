'use client';

import EditCalendarRoundedIcon from '@mui/icons-material/EditCalendarRounded';
import { useTranslations } from 'next-intl';

import { AppDialog } from '@/base/components/ui';
import EditTripForm from './EditTripForm';
import type { Trip } from '../types';

export interface EditTripDialogProps {
  open: boolean;
  onClose: () => void;
  trip: Trip | null;
  onSuccess?: (updatedTrip: Trip) => void;
}

export default function EditTripDialog({
  open,
  onClose,
  trip,
  onSuccess,
}: EditTripDialogProps) {
  const t = useTranslations('myTrips');

  return (
    <AppDialog
      open={open && Boolean(trip)}
      onClose={onClose}
      title={t('editTitle')}
      description={t('editDescription')}
      icon={<EditCalendarRoundedIcon />}
      maxWidth="sm"
    >
      {trip && (
        <EditTripForm trip={trip} onClose={onClose} onSuccess={onSuccess} />
      )}
    </AppDialog>
  );
}
