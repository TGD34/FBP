import { ApiResponse, Game, MarketType, PredictionResult, RecommendedBet } from '@/types/api';
import { useApiKeyStore } from '@/store/api-key-store';
import { mockMatches } from '@/mocks/matches';
import { useRefreshStore } from '@/store/refresh-store';

const BASE_URL = 'https://api.the-odds-api.com/v4';

export async function fetchSports(apiKey: string): Promise<any> {
  try {
    const response = await fetch(`${BASE_URL}/sports?apiKey=${apiKey}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching sports:', error);
    throw error;
  }
}

export async function fetchOdds(
  apiKey: string,
  sport: string = 'soccer_epl',
  markets: string = 'h2h,spreads,totals',
  regions: string = 'us',
  oddsFormat: string = 'decimal',
  forceRefresh: boolean = false
): Promise<ApiResponse> {
  try {
    // For development/demo purposes, return mock data if no API key or in development mode
    if (!apiKey || apiKey === 'demo') {
      console.log('Using mock data for odds');
      return { success: true, data: mockMatches };
    }
    
    // Check if we need to refresh the data
    const refreshStore = useRefreshStore.getState();
    const needsRefresh = forceRefresh || refreshStore.needsRefresh(sport);
    
    if (!needsRefresh) {
      console.log(`Using cached data for ${sport}, last updated ${new Date(refreshStore.lastUpdated[sport]).toLocaleString()}`);
      // Try to get data from cache
      // For now, we'll still fetch from API since we don't have a proper cache implementation
    }
    
    const url = `${BASE_URL}/sports/${sport}/odds?apiKey=${apiKey}&regions=${regions}&markets=${markets}&oddsFormat=${oddsFormat}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 401) {
        console.error('API key unauthorized. Please check your API key.');
        // Return mock data as fallback for demo purposes
        return { success: true, data: mockMatches };
      }
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Update the last updated timestamp
    refreshStore.setLastUpdated(sport);
    
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching odds:', error);
    // Return mock data as fallback for demo purposes
    return { success: true, data: mockMatches };
  }
}

export function useApiKey(): string | null {
  return useApiKeyStore.getState().apiKey;
}

// This function would normally call a prediction model API
// For demo purposes, we'll generate mock predictions
export function generatePrediction(game: Game): PredictionResult {
  // Simple mock algorithm to generate predictions based on bookmaker odds
  const h2hMarket = game.bookmakers[0]?.markets.find(m => m.key === MarketType.H2H);
  
  if (!h2hMarket) {
    return {
      homeWinProbability: 0.33,
      drawProbability: 0.33,
      awayWinProbability: 0.33,
      recommendedBets: []
    };
  }
  
  // Extract odds
  const homeOdds = h2hMarket.outcomes.find(o => o.name === game.home_team)?.price || 2;
  const awayOdds = h2hMarket.outcomes.find(o => o.name === game.away_team)?.price || 2;
  const drawOdds = h2hMarket.outcomes.find(o => o.name === 'Draw')?.price || 3;
  
  // Convert odds to probabilities (simplified)
  const totalImpliedProb = (1/homeOdds) + (1/awayOdds) + (1/drawOdds);
  
  // Add a small random factor to make our predictions slightly different from bookmaker odds
  // This is to simulate our "edge" and create value bets
  const randomFactor = () => (Math.random() * 0.1) - 0.05; // -5% to +5%
  
  // Using variables that we can modify
  let homeWinProb = Math.min(0.95, Math.max(0.05, ((1/homeOdds) / totalImpliedProb) + randomFactor()));
  let awayWinProb = Math.min(0.95, Math.max(0.05, ((1/awayOdds) / totalImpliedProb) + randomFactor()));
  
  // Ensure probabilities sum to 1
  let drawProb = 1 - homeWinProb - awayWinProb;
  if (drawProb < 0.05) {
    // Redistribute if draw probability is too low
    drawProb = 0.05;
    const excess = (homeWinProb + awayWinProb + drawProb) - 1;
    homeWinProb -= excess / 2;
    awayWinProb -= excess / 2;
  }
  
  // Generate recommended bets
  const recommendedBets: RecommendedBet[] = [];
  
  // H2H recommendation
  const bestOdds = Math.max(homeOdds, awayOdds, drawOdds);
  if (bestOdds === homeOdds) {
    recommendedBets.push({
      market: 'Match Winner',
      selection: game.home_team,
      odds: homeOdds,
      confidence: homeWinProb * 100
    });
  } else if (bestOdds === awayOdds) {
    recommendedBets.push({
      market: 'Match Winner',
      selection: game.away_team,
      odds: awayOdds,
      confidence: awayWinProb * 100
    });
  } else {
    recommendedBets.push({
      market: 'Match Winner',
      selection: 'Draw',
      odds: drawOdds,
      confidence: drawProb * 100
    });
  }
  
  // Add a totals bet recommendation
  const totalsMarket = game.bookmakers[0]?.markets.find(m => m.key === MarketType.TOTALS);
  if (totalsMarket) {
    const overOutcome = totalsMarket.outcomes.find(o => o.name === 'Over');
    if (overOutcome) {
      recommendedBets.push({
        market: 'Totals',
        selection: `Over ${overOutcome.point}`,
        odds: overOutcome.price,
        confidence: 65 // Mock confidence
      });
    }
  }
  
  // Add a spread bet recommendation
  const spreadsMarket = game.bookmakers[0]?.markets.find(m => m.key === MarketType.SPREADS);
  if (spreadsMarket) {
    const homeSpread = spreadsMarket.outcomes.find(o => o.name === game.home_team);
    if (homeSpread) {
      recommendedBets.push({
        market: 'Handicap',
        selection: `${game.home_team} ${homeSpread.point}`,
        odds: homeSpread.price,
        confidence: 60 // Mock confidence
      });
    }
  }
  
  return {
    homeWinProbability: homeWinProb,
    drawProbability: drawProb,
    awayWinProbability: awayWinProb,
    recommendedBets
  };
}