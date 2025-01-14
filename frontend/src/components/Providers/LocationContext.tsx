import { createContext, useState } from 'react';
import { Coordinates } from '@/schemas/schemas';


export interface LocationContextProvider {
  location?: Coordinates,
  error?: string,
  requestLocation: () => Promise<Coordinates>
};

// Tracks and updates location data.
export const LocationContext = createContext<LocationContextProvider | undefined>(undefined);

export const LocationProvider = ({children}: {children: React.ReactNode}) => {
  const [location, setLocation] = useState<Coordinates>();
  const [error, setError] = useState<string>();

  const requestLocation = async (): Promise<Coordinates> => {
    return new Promise((resolve, reject): void => {
      const handleSuccess = (position: GeolocationPosition): void => {
        const { latitude, longitude }: Coordinates = position.coords;
        setLocation({ latitude, longitude });
        resolve({ latitude, longitude });
      };

      const handleError = (error: GeolocationPositionError): void => {
        setError(error.message);
        reject(error);
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
      } else {
        setError('Geolocation is not supported by this browser.');
        reject(new Error('Geolocation is not supported by this browser.'));
      }
    });
  };

  return (
    <LocationContext.Provider value={{ location, error, requestLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
