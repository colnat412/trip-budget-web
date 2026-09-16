'use client';

import { useTripContext } from '@/features/trip/context/TripContext';
import AppLoadingOverlay from '../ui/AppLoadingOverlay';

const GlobalLoadingHost = () => {
  const { isLoading } = useTripContext();

  return <AppLoadingOverlay open={isLoading} />;
};

export default GlobalLoadingHost;
