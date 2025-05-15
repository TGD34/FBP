import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { soccerLeagues } from '@/mocks/leagues';

interface LeagueState {
  selectedLeague: string;
  setSelectedLeague: (leagueKey: string) => void;
  getLeagueTitle: () => string;
}

export const useLeagueStore = create<LeagueState>()(
  persist(
    (set, get) => ({
      selectedLeague: 'soccer_epl', // Default to Premier League
      setSelectedLeague: (leagueKey) => set({ selectedLeague: leagueKey }),
      getLeagueTitle: () => {
        const league = soccerLeagues.find(l => l.key === get().selectedLeague);
        return league ? league.title : 'Premier League';
      },
    }),
    {
      name: 'league-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);