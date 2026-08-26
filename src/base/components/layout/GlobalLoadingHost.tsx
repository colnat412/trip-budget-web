'use client';

import { useTripContext } from '@/features/trip/context/TripContext';
import AppLoadingOverlay from '../ui/AppLoadingOverlay';

export default function GlobalLoadingHost() {
  const { isLoading } = useTripContext();

  return <AppLoadingOverlay open={isLoading} />;
}
