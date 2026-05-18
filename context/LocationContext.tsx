import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type LocationContextType = {
  location: string;
  setLocation: (loc: string) => Promise<void>;
  isLoading: boolean;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const LOCATION_STORAGE_KEY = '@kaledash_user_location';
const DEFAULT_LOCATION = 'East Legon, Accra';

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocationState] = useState<string>(DEFAULT_LOCATION);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load saved location on startup
    const loadLocation = async () => {
      try {
        const savedLocation = await AsyncStorage.getItem(LOCATION_STORAGE_KEY);
        if (savedLocation) {
          setLocationState(savedLocation);
        }
      } catch (error) {
        console.error('Failed to load location from storage', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLocation();
  }, []);

  const setLocation = async (newLocation: string) => {
    try {
      await AsyncStorage.setItem(LOCATION_STORAGE_KEY, newLocation);
      setLocationState(newLocation);
    } catch (error) {
      console.error('Failed to save location to storage', error);
    }
  };

  return (
    <LocationContext.Provider value={{ location, setLocation, isLoading }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
