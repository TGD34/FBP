import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RefreshState {
  lastUpdated: Record<string, number>; // leagueKey -> timestamp
  setLastUpdated: (leagueKey: string) => void;
  needsRefresh: (leagueKey: string) => boolean;
}

// 24 hours in milliseconds
const REFRESH_INTERVAL = 24 * 60 * 60 * 1000;

export const useRefreshStore = create<RefreshState>()(
  persist(
    (set, get) => ({
      lastUpdated: {},
      setLastUpdated: (leagueKey) => {
        set((state) => ({
          lastUpdated: {
            ...state.lastUpdated,
            [leagueKey]: Date.now()
          }
        }));
      },
      needsRefresh: (leagueKey) => {
        const lastUpdate = get().lastUpdated[leagueKey];
        if (!lastUpdate) return true;
        
        const now = Date.now();
        const timeSinceLastUpdate = now - lastUpdate;
        
        return timeSinceLastUpdate >= REFRESH_INTERVAL;
      }
    }),
    {
      name: 'refresh-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);