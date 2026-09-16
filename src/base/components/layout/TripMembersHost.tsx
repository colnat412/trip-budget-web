'use client';

import { useTripContext } from '@/features/trip/context/TripContext';
import TripMembersDialog from '@/features/trip/components/members/TripMembersDialog';

const TripMembersHost = () => {
  const { activeTrip, isMembersOpen, isInviteInitial, closeMembers } =
    useTripContext();

  if (!activeTrip || !isMembersOpen) return null;

  return (
    <TripMembersDialog
      key={`${activeTrip.id}-${isInviteInitial}`}
      open={isMembersOpen}
      onClose={closeMembers}
      tripId={activeTrip.id}
      tripName={activeTrip.name}
      tripOwnerId={activeTrip.ownerId}
      initialShowInvite={isInviteInitial}
    />
  );
};

export default TripMembersHost;
