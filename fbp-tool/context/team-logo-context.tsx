import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useApiKeyStore } from '@/store/api-key-store';
import { useTeamLogoStore } from '@/store/team-logo-store';
import { fetchTeamLogos, addTeamLogo as apiAddLogo, updateTeamLogo as apiUpdateLogo, deleteTeamLogo as apiDeleteLogo, TeamLogo } from '@/services/team-logo-api';

interface TeamLogoContextType {
  logos: TeamLogo[];
  isLoading: boolean;
  error: Error | null;
  isAdmin: boolean;
  refreshLogos: () => Promise<void>;
  getLogo: (teamName: string) => string | null;
  addLogo: (teamName: string, logoUrl: string) => Promise<void>;
  updateLogo: (oldTeamName: string, newTeamName: string, logoUrl: string) => Promise<void>;
  deleteLogo: (teamName: string) => Promise<void>;
}

const TeamLogoContext = createContext<TeamLogoContextType | undefined>(undefined);

// Mock data for fallback
const mockLogos: TeamLogo[] = [
  {
    id: '1',
    teamName: 'Arsenal',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    teamName: 'Chelsea',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    teamName: 'Manchester City',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg',
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    teamName: 'Liverpool',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg',
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    teamName: 'Barcelona',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg',
    createdAt: new Date().toISOString()
  },
  {
    id: '6',
    teamName: 'Real Madrid',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg',
    createdAt: new Date().toISOString()
  },
  {
    id: '7',
    teamName: 'Bayern Munich',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg',
    createdAt: new Date().toISOString()
  }
];

// Admin API key - in a real app, this would be handled more securely
const ADMIN_API_KEY = 'FBPTOOLADMIN2137';

export const TeamLogoProvider = ({ children }: { children: ReactNode }) => {
  const { apiKey, isAdmin: apiKeyIsAdmin } = useApiKeyStore();
  const { 
    logos: storedLogos, 
    addLogo: addStoredLogo, 
    updateLogo: updateStoredLogo, 
    removeLogo: removeStoredLogo, 
    isAdmin: logoStoreIsAdmin,
    checkAdminStatus
  } = useTeamLogoStore();
  
  const [logos, setLogos] = useState<TeamLogo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Check admin status whenever the API key changes
  useEffect(() => {
    if (apiKey) {
      checkAdminStatus(apiKey);
    }
  }, [apiKey, checkAdminStatus]);
  
  const isAdmin = apiKeyIsAdmin || logoStoreIsAdmin || apiKey === ADMIN_API_KEY;
  
  // Load logos from API and fallback to storage on initial load
  useEffect(() => {
    const loadLogos = async () => {
      if (isInitialized) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // First try to fetch from SheetDB API
        const apiLogos = await fetchTeamLogos();
        
        if (apiLogos && apiLogos.length > 0) {
          console.log('Using SheetDB logos:', apiLogos.length);
          setLogos(apiLogos);
          
          // Also store in local storage for offline access
          apiLogos.forEach(logo => {
            addStoredLogo(logo.teamName, logo.logoUrl);
          });
        } else {
          // If API fails or returns empty, use stored logos
          const formattedLogos: TeamLogo[] = Object.entries(storedLogos).map(([teamName, logoUrl]) => ({
            id: teamName,
            teamName,
            logoUrl,
            createdAt: new Date().toISOString()
          }));
          
          if (formattedLogos.length > 0) {
            console.log('Using stored logos:', formattedLogos.length);
            setLogos(formattedLogos);
          } else {
            // If no stored logos, use mock data
            console.log('Using mock logos');
            
            // Also store mock logos in local storage
            mockLogos.forEach(logo => {
              addStoredLogo(logo.teamName, logo.logoUrl);
            });
            
            // Set logos from mock data
            setLogos(mockLogos);
          }
        }
      } catch (err) {
        console.error('Error loading logos:', err);
        setError(err instanceof Error ? err : new Error('Failed to load logos'));
        
        // Try to use stored logos as fallback
        const formattedLogos: TeamLogo[] = Object.entries(storedLogos).map(([teamName, logoUrl]) => ({
          id: teamName,
          teamName,
          logoUrl,
          createdAt: new Date().toISOString()
        }));
        
        if (formattedLogos.length > 0) {
          console.log('Fallback to stored logos:', formattedLogos.length);
          setLogos(formattedLogos);
        } else {
          // Final fallback to mock data
          console.log('Fallback to mock logos');
          setLogos(mockLogos);
        }
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };
    
    loadLogos();
  }, [storedLogos, isInitialized, addStoredLogo]);
  
  const refreshLogos = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Try to fetch fresh data from SheetDB API
      const apiLogos = await fetchTeamLogos();
      
      if (apiLogos && apiLogos.length > 0) {
        console.log('Refreshed from SheetDB API:', apiLogos.length);
        setLogos(apiLogos);
        
        // Update local storage
        apiLogos.forEach(logo => {
          addStoredLogo(logo.teamName, logo.logoUrl);
        });
      } else {
        throw new Error('No logos returned from API');
      }
    } catch (err) {
      console.error('Error refreshing logos:', err);
      setError(err instanceof Error ? err : new Error('Failed to refresh logos'));
      
      // Fallback to local storage
      const formattedLogos: TeamLogo[] = Object.entries(storedLogos).map(([teamName, logoUrl]) => ({
        id: teamName,
        teamName,
        logoUrl,
        createdAt: new Date().toISOString()
      }));
      
      if (formattedLogos.length > 0) {
        console.log('Fallback to stored logos on refresh:', formattedLogos.length);
        setLogos(formattedLogos);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const getLogo = (teamName: string): string | null => {
    // First check in-memory logos
    const logo = logos.find(l => l.teamName === teamName);
    if (logo) return logo.logoUrl;
    
    // Then check stored logos
    return storedLogos[teamName] || null;
  };
  
  const addLogo = async (teamName: string, logoUrl: string): Promise<void> => {
    if (!isAdmin) throw new Error('Admin access required');
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if team already exists
      if (logos.some(logo => logo.teamName === teamName)) {
        throw new Error(`Team logo for "${teamName}" already exists`);
      }
      
      // Try to add to SheetDB API first
      const newLogo = await apiAddLogo(teamName, logoUrl);
      
      // Add to local state
      setLogos(prev => [...prev, newLogo]);
      
      // Add to local storage
      addStoredLogo(teamName, logoUrl);
      
      console.log('Added logo:', teamName);
    } catch (err) {
      console.error('Error adding logo:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to add logo';
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateLogo = async (
    oldTeamName: string, 
    newTeamName: string, 
    logoUrl: string
  ): Promise<void> => {
    if (!isAdmin) throw new Error('Admin access required');
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if old team exists
      const existingLogo = logos.find(logo => logo.teamName === oldTeamName);
      if (!existingLogo) {
        throw new Error(`Team logo for "${oldTeamName}" not found`);
      }
      
      // If team name is changing, check if new name already exists
      if (oldTeamName !== newTeamName && logos.some(logo => logo.teamName === newTeamName)) {
        throw new Error(`Team logo for "${newTeamName}" already exists`);
      }
      
      // Try to update in SheetDB API first
      await apiUpdateLogo(existingLogo.id, newTeamName, logoUrl);
      
      // Update in local state
      setLogos(prev => 
        prev.map(logo => 
          logo.teamName === oldTeamName 
            ? { ...logo, teamName: newTeamName, logoUrl } 
            : logo
        )
      );
      
      // Update in local storage
      updateStoredLogo(oldTeamName, newTeamName, logoUrl);
      
      console.log('Updated logo:', oldTeamName, '->', newTeamName);
    } catch (err) {
      console.error('Error updating logo:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update logo';
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteLogo = async (teamName: string): Promise<void> => {
    if (!isAdmin) throw new Error('Admin access required');
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if team exists
      const existingLogo = logos.find(logo => logo.teamName === teamName);
      if (!existingLogo) {
        throw new Error(`Team logo for "${teamName}" not found`);
      }
      
      // Try to delete from SheetDB API first
      await apiDeleteLogo(existingLogo.id);
      
      // Delete from local state
      setLogos(prev => prev.filter(logo => logo.teamName !== teamName));
      
      // Delete from local storage
      removeStoredLogo(teamName);
      
      console.log('Deleted logo:', teamName);
    } catch (err) {
      console.error('Error deleting logo:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete logo';
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  const value = {
    logos,
    isLoading,
    error,
    isAdmin,
    refreshLogos,
    getLogo,
    addLogo,
    updateLogo,
    deleteLogo,
  };
  
  return (
    <TeamLogoContext.Provider value={value}>
      {children}
    </TeamLogoContext.Provider>
  );
};

export const useTeamLogos = () => {
  const context = useContext(TeamLogoContext);
  if (context === undefined) {
    throw new Error('useTeamLogos must be used within a TeamLogoProvider');
  }
  return context;
};