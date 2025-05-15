import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Admin API key - in a real app, this would be handled more securely
const ADMIN_API_KEY = 'FBPTOOLADMIN2137';

interface ApiKeyState {
  apiKey: string | null;
  isAdmin: boolean;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
  hasApiKey: () => boolean;
  checkAdminStatus: (key: string) => boolean;
}

export const useApiKeyStore = create<ApiKeyState>()(
  persist(
    (set, get) => ({
      apiKey: null,
      isAdmin: false,
      setApiKey: (key) => {
        const isAdmin = key === ADMIN_API_KEY;
        console.log('Setting API key, admin status:', isAdmin);
        set({ apiKey: key, isAdmin });
      },
      clearApiKey: () => {
        console.log('Clearing API key');
        set({ apiKey: null, isAdmin: false });
      },
      hasApiKey: () => !!get().apiKey,
      checkAdminStatus: (key) => {
        const isAdmin = key === ADMIN_API_KEY;
        if (isAdmin) {
          set({ isAdmin: true });
        }
        return isAdmin;
      },
    }),
    {
      name: 'api-key-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);