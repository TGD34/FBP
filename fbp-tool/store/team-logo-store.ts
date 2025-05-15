import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Admin API key - in a real app, this would be handled more securely
const ADMIN_API_KEY = 'FBPTOOLADMIN2137';

// Initialize with an empty object instead of default logos
const DEFAULT_LOGOS: Record<string, string> = {};

interface TeamLogoState {
  logos: Record<string, string>; // teamName -> logoUrl
  isAdmin: boolean;
  getLogo: (teamName: string) => string | null;
  addLogo: (teamName: string, logoUrl: string) => void;
  updateLogo: (oldTeamName: string, newTeamName: string, logoUrl: string) => void;
  removeLogo: (teamName: string) => void;
  checkAdminStatus: (apiKey: string) => boolean;
}

export const useTeamLogoStore = create<TeamLogoState>()(
  persist(
    (set, get) => ({
      logos: DEFAULT_LOGOS,
      isAdmin: false,
      getLogo: (teamName) => get().logos[teamName] || null,
      addLogo: (teamName, logoUrl) => {
        console.log(`Adding logo for ${teamName}: ${logoUrl}`);
        set((state) => ({
          logos: {
            ...state.logos,
            [teamName]: logoUrl
          }
        }));
      },
      updateLogo: (oldTeamName, newTeamName, logoUrl) => {
        console.log(`Updating logo: ${oldTeamName} -> ${newTeamName}: ${logoUrl}`);
        const currentLogos = get().logos;
        
        // Create a new logos object without the old team name
        const newLogos = { ...currentLogos };
        
        // If the team name changed, remove the old entry
        if (oldTeamName !== newTeamName) {
          delete newLogos[oldTeamName];
        }
        
        // Add the new or updated entry
        newLogos[newTeamName] = logoUrl;
        
        // Update the state with the new logos object
        set({ logos: newLogos });
      },
      removeLogo: (teamName) => {
        console.log(`Removing logo for ${teamName}`);
        // Create a new logos object without the specified team
        const currentLogos = get().logos;
        const newLogos = Object.entries(currentLogos)
          .filter(([name]) => name !== teamName)
          .reduce((obj, [name, url]) => {
            obj[name] = url;
            return obj;
          }, {} as Record<string, string>);
        
        console.log(`Before removal: ${Object.keys(currentLogos).length} logos`);
        console.log(`After removal: ${Object.keys(newLogos).length} logos`);
        
        // Update the state with the new logos object
        set({ logos: newLogos });
      },
      checkAdminStatus: (apiKey) => {
        const isAdmin = apiKey === ADMIN_API_KEY;
        console.log(`Checking admin status: ${isAdmin}`);
        set({ isAdmin });
        return isAdmin;
      }
    }),
    {
      name: 'team-logos-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);