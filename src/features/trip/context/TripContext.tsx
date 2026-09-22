'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { ApiError } from '@/base/api';
import useMyTrips from '../hooks/useMyTrips';
import type { Trip } from '../types';

export type TripMutationEvent = 'created' | 'updated' | 'deleted' | 'general';

interface TripContextValue {
  trips: Trip[];
  activeTrip: Trip | null;
  selectedTripId: string | number | null;
  selectTrip: (tripId: string | number) => void;
  isLoading: boolean;
  isFetching: boolean;
  error: ApiError | null;
  refetchTrips: (event?: TripMutationEvent) => Promise<unknown>;
  subscribeTrips: (listener: (event?: TripMutationEvent) => void) => () => void;
  tripsVersion: number;
  isCreateTripOpen: boolean;
  openCreateTrip: () => void;
  closeCreateTrip: () => void;
  isMembersOpen: boolean;
  isInviteInitial: boolean;
  openMembers: (initialInvite?: boolean) => void;
  closeMembers: () => void;
}

const TripContext = createContext<TripContextValue | null>(null);

const TripProvider = ({ children }: { children: ReactNode }) => {
  const { trips, isLoading, isFetching, error, refetch } = useMyTrips({
    size: 100,
  });
  const [tripsVersion, setTripsVersion] = useState(0);
  const listenersRef = useRef<Set<(event?: TripMutationEvent) => void>>(
    new Set(),
  );

  const [selectedTripId, setSelectedTripId] = useState<string | number | null>(
    null,
  );
  const [isCreateTripOpen, setIsCreateTripOpen] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [isInviteInitial, setIsInviteInitial] = useState(false);

  const subscribeTrips = useCallback(
    (listener: (event?: TripMutationEvent) => void) => {
      listenersRef.current.add(listener);
      return () => {
        listenersRef.current.delete(listener);
      };
    },
    [],
  );

  const refetchTrips = useCallback(
    async (event: TripMutationEvent = 'general') => {
      setTripsVersion((v) => v + 1);
      listenersRef.current.forEach((listener) => {
        try {
          listener(event);
        } catch (err) {
          console.error('Trip listener error:', err);
        }
      });
      return refetch();
    },
    [refetch],
  );

  const activeTrip = useMemo(() => {
    if (!trips || trips.length === 0) return null;

    if (selectedTripId !== null) {
      const found = trips.find((t) => String(t.id) === String(selectedTripId));
      if (found) return found;
    }

    const inProgressTrip = trips.find((t) => t.status === 'IN_PROGRESS');
    if (inProgressTrip) return inProgressTrip;

    return trips[0];
  }, [trips, selectedTripId]);

  const selectTrip = useCallback((tripId: string | number) => {
    setSelectedTripId(tripId);
  }, []);

  const openCreateTrip = useCallback(() => {
    setIsCreateTripOpen(true);
  }, []);

  const closeCreateTrip = useCallback(() => {
    setIsCreateTripOpen(false);
  }, []);

  const openMembers = useCallback(
    (initialInvite: boolean | unknown = false) => {
      setIsInviteInitial(initialInvite === true);
      setIsMembersOpen(true);
    },
    [],
  );

  const closeMembers = useCallback(() => {
    setIsMembersOpen(false);
    setIsInviteInitial(false);
  }, []);

  const value = useMemo<TripContextValue>(
    () => ({
      trips,
      activeTrip,
      selectedTripId,
      selectTrip,
      isLoading,
      isFetching,
      error,
      refetchTrips,
      subscribeTrips,
      tripsVersion,
      isCreateTripOpen,
      openCreateTrip,
      closeCreateTrip,
      isMembersOpen,
      isInviteInitial,
      openMembers,
      closeMembers,
    }),
    [
      trips,
      activeTrip,
      selectedTripId,
      selectTrip,
      isLoading,
      isFetching,
      error,
      refetchTrips,
      subscribeTrips,
      tripsVersion,
      isCreateTripOpen,
      openCreateTrip,
      closeCreateTrip,
      isMembersOpen,
      isInviteInitial,
      openMembers,
      closeMembers,
    ],
  );

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
};

const useTripContext = (): TripContextValue => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTripContext must be used within a TripProvider');
  }
  return context;
};

export { TripProvider, useTripContext };
export default TripProvider;
