import { createContext, useContext, useEffect, useState } from 'react';
import { PinnedEventData } from '../../../../schemas/schemas';
import { AuthContext, AuthContextProvider } from './AuthContext';

// Environment variables.
const PINS_API_URL: string = import.meta.env.VITE_BACKEND_PINS_API_URL;

export interface PinsContextProvider {
  pinnedEvents?: Array<PinnedEventData>,
  fetchPinnedEvents: () => Promise<void>
};

export const PinsContext = createContext<PinsContextProvider | undefined>(undefined);

// Tracks and updates pinned events for the current user. 
export const PinsProvider = ({ children }: { children: React.ReactNode }) => {
  const authContext: AuthContextProvider | undefined = useContext<AuthContextProvider | undefined>(AuthContext);
  const [pinnedEvents, setPinnedEvents] = useState<Array<PinnedEventData>>();

  // Update pinned events when auth changes.
  useEffect(() => {
    fetchPinnedEvents();
  }, [authContext]);

  const fetchPinnedEvents = async (): Promise<void> => {
    try {
      if (!authContext || !authContext.loggedIn) {
        throw new Error('Must be logged in to view pinned events.');
      }

      const res: globalThis.Response = await fetch(PINS_API_URL, {
        method: 'GET',
        credentials: 'include'
      });

      const jsonRes: {message?: string, pinnedEvents?: Array<PinnedEventData>} = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          authContext.logout;
        }
        throw new Error(jsonRes.message);
      }

      const sortedPinnedEvents: Array<PinnedEventData> | undefined = jsonRes?.pinnedEvents?.sort(
        (a, b) => new Date(`${a.event_date}T${a.event_time}`).getTime() - new Date(`${b.event_date}T${b.event_time}`).getTime());
      setPinnedEvents(sortedPinnedEvents);
    } catch (error) {
        setPinnedEvents(undefined);
    }
  };

  return <PinsContext.Provider value={{pinnedEvents, fetchPinnedEvents}}>{children}</PinsContext.Provider>;
};
