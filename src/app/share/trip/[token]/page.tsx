import type { Metadata } from 'next';

import PublicTripView from '@/features/trip/components/PublicTripView';
import { getPublicTripSnapshot } from '@/features/trip/api/public-trip.server';

interface PageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { token } = await params;
  const { snapshot } = await getPublicTripSnapshot(token);
  if (!snapshot) return { title: 'TripBudget' };

  return {
    title: `${snapshot.trip.name} · TripBudget`,
    description: snapshot.trip.description ?? snapshot.trip.destination,
  };
}

const PublicTripPage = async ({ params }: PageProps) => {
  const { token } = await params;
  const { snapshot, errorStatus } = await getPublicTripSnapshot(token);

  return (
    <PublicTripView
      token={token}
      snapshot={snapshot}
      errorStatus={errorStatus}
    />
  );
};

export default PublicTripPage;
