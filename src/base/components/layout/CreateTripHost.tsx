'use client';

import { useTripContext } from '@/features/trip/context/TripContext';
import CreateTripDialog from '@/features/trip/components/CreateTripDialog';

const CreateTripHost = () => {
  const { isCreateTripOpen, closeCreateTrip } = useTripContext();

  return <CreateTripDialog open={isCreateTripOpen} onClose={closeCreateTrip} />;
};

export default CreateTripHost;
