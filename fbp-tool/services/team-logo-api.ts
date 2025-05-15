import { Platform } from 'react-native';

export interface TeamLogo {
  id: string;
  teamName: string;
  logoUrl: string;
  createdAt: string;
}

// SheetDB API endpoint
const SHEETDB_API_URL = 'https://sheetdb.io/api/v1/dbmzejtty48zb';

/**
 * Fetches team logos from SheetDB
 */
export async function fetchTeamLogos(): Promise<TeamLogo[]> {
  try {
    console.log('Fetching team logos from SheetDB...');
    const response = await fetch(SHEETDB_API_URL);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('SheetDB data received:', data);
    
    // Transform the data to match our TeamLogo interface
    // Assuming the SheetDB has columns: id, teamName, logoUrl
    return data.map((item: any) => ({
      id: item.id?.toString() || Math.random().toString(36).substring(2, 9),
      teamName: item.teamName || item.team_name || '',
      logoUrl: item.logoUrl || item.logo_url || '',
      createdAt: item.createdAt || item.created_at || new Date().toISOString()
    })).filter((logo: TeamLogo) => logo.teamName && logo.logoUrl);
  } catch (error) {
    console.error('Error fetching team logos from SheetDB:', error);
    throw new Error(`Failed to fetch team logos: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Adds a new team logo to SheetDB
 */
export async function addTeamLogo(teamName: string, logoUrl: string): Promise<TeamLogo> {
  try {
    const newLogo = {
      id: Math.random().toString(36).substring(2, 9),
      teamName,
      logoUrl,
      createdAt: new Date().toISOString()
    };
    
    const response = await fetch(SHEETDB_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: [newLogo] }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return newLogo;
  } catch (error) {
    console.error('Error adding team logo to SheetDB:', error);
    throw new Error(`Failed to add team logo: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Updates an existing team logo in SheetDB
 */
export async function updateTeamLogo(id: string, teamName: string, logoUrl: string): Promise<TeamLogo> {
  try {
    const updatedLogo = {
      teamName,
      logoUrl,
      updatedAt: new Date().toISOString()
    };
    
    const response = await fetch(`${SHEETDB_API_URL}/id/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: updatedLogo }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return {
      id,
      teamName,
      logoUrl,
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error updating team logo in SheetDB:', error);
    throw new Error(`Failed to update team logo: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Deletes a team logo from SheetDB
 */
export async function deleteTeamLogo(id: string): Promise<void> {
  try {
    const response = await fetch(`${SHEETDB_API_URL}/id/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting team logo from SheetDB:', error);
    throw new Error(`Failed to delete team logo: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}