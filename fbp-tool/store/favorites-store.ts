import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FavoritesState {
  favoriteMatches: string[];
  addFavorite: (matchId: string) => void;
  removeFavorite: (matchId: string) => void;
  isFavorite: (matchId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteMatches: [],
      addFavorite: (matchId) => 
        set((state) => ({ 
          favoriteMatches: [...state.favoriteMatches, matchId] 
        })),
      removeFavorite: (matchId) => 
        set((state) => ({ 
          favoriteMatches: state.favoriteMatches.filter(id => id !== matchId) 
        })),
      isFavorite: (matchId) => 
        get().favoriteMatches.includes(matchId),
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);