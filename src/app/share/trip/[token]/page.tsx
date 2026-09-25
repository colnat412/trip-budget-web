import PublicTripView from '@/features/trip/components/PublicTripView';

interface PageProps {
  params: Promise<{ token: string }>;
}

const PublicTripPage = async ({ params }: PageProps) => {
  const { token } = await params;
  return <PublicTripView token={token} />;
};

export default PublicTripPage;
