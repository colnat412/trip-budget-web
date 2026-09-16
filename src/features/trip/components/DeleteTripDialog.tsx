'use client';

import { useTranslations } from 'next-intl';

import { AppConfirmDialog } from '@/base/components/ui';
import { useDeleteTrip } from '../hooks/useTripMutation';
import type { Trip } from '../types';

export interface DeleteTripDialogProps {
  open: boolean;
  onClose: () => void;
  trip: Trip | null;
  onSuccess?: () => void;
}

const DeleteTripDialog = ({
  open,
  onClose,
  trip,
  onSuccess,
}: DeleteTripDialogProps) => {
  const t = useTranslations('myTrips');
  const tTrip = useTranslations('trip');

  const { deleteTrip, isPending } = useDeleteTrip({
    tripId: trip?.id ?? '',
  });

  const handleConfirm = () => {
    if (!trip) return;

    deleteTrip(
      {},
      {
        onSuccess: () => {
          onSuccess?.();
          onClose();
        },
      },
    );
  };

  return (
    <AppConfirmDialog
      open={open && Boolean(trip)}
      onClose={onClose}
      onConfirm={handleConfirm}
      title={t('deleteTitle')}
      description={t('deleteConfirm', { name: trip?.name ?? '' })}
      confirmText={t('delete')}
      cancelText={tTrip('cancelButton')}
      intent="danger"
      loading={isPending}
    />
  );
};

export default DeleteTripDialog;
