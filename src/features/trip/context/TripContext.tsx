'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { ApiError } from '@/base/api';
import useMyTrips from '../hooks/useMyTrips';
import type { Trip } from '../types';

interface TripContextValue {
  trips: Trip[];
  activeTrip: Trip | null;
  selectedTripId: number | null;
  selectTrip: (tripId: number) => void;
  isLoading: boolean;
  isFetching: boolean;
  error: ApiError | null;
  refetchTrips: () => Promise<unknown>;
  isCreateTripOpen: boolean;
  openCreateTrip: () => void;
  closeCreateTrip: () => void;
  isMembersOpen: boolean;
  isInviteInitial: boolean;
  openMembers: (initialInvite?: boolean) => void;
  closeMembers: () => void;
}

const TripContext = createContext<TripContextValue | null>(null);

export function TripProvider({ children }: { children: ReactNode }) {
  const { trips, isLoading, isFetching, error, refetch } = useMyTrips();
  const [selectedTripId, setSelectedTripId] = useState<number | null>(null);
  const [isCreateTripOpen, setIsCreateTripOpen] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [isInviteInitial, setIsInviteInitial] = useState(false);

  const activeTrip = useMemo(() => {
    if (!trips || trips.length === 0) return null;

    if (selectedTripId !== null) {
      const found = trips.find((t) => t.id === selectedTripId);
      if (found) return found;
    }

    const inProgressTrip = trips.find((t) => t.status === 'IN_PROGRESS');
    if (inProgressTrip) return inProgressTrip;

    return trips[0];
  }, [trips, selectedTripId]);

  const selectTrip = useCallback((tripId: number) => {
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
      refetchTrips: refetch,
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
      refetch,
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
}

export function useTripContext(): TripContextValue {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTripContext must be used within a TripProvider');
  }
  return context;
}
