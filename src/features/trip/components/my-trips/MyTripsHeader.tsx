'use client';

import React from 'react';
import FlightTakeoffRoundedIcon from '@mui/icons-material/FlightTakeoffRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useTranslations } from 'next-intl';

import { AppButton, AppPageHeader } from '@/base/components/ui';

interface MyTripsHeaderProps {
  totalTrips: number;
  onCreateTrip: () => void;
}

const MyTripsHeader = ({ totalTrips, onCreateTrip }: MyTripsHeaderProps) => {
  const t = useTranslations('myTrips');

  return (
    <AppPageHeader
      icon={<FlightTakeoffRoundedIcon />}
      title={t('title')}
      badge={totalTrips}
      subtitle={t('description')}
      actions={
        <AppButton
          intent="primary"
          size="medium"
          startIcon={<AddRoundedIcon fontSize="small" />}
          onClick={onCreateTrip}
        >
          {t('createNew')}
        </AppButton>
      }
    />
  );
};

export default MyTripsHeader;
