import { Game, PredictionResult, ValueBet, MarketType } from '@/types/api';

/**
 * Calculates the implied probability from decimal odds
 * @param odds Decimal odds
 * @returns Implied probability as a decimal (0-1)
 */
export function oddsToImpliedProbability(odds: number): number {
  return 1 / odds;
}

/**
 * Converts probability to fair decimal odds
 * @param probability Probability as a decimal (0-1)
 * @returns Fair decimal odds
 */
export function probabilityToOdds(probability: number): number {
  return 1 / probability;
}

/**
 * Finds value bets by comparing bookmaker odds with our prediction model
 * @param game The match data
 * @param prediction Our prediction for the match
 * @param valueThresholdPercent Minimum value percentage to consider (default: 5%)
 * @returns Array of value bets
 */
export function findValueBets(
  game: Game, 
  prediction: PredictionResult, 
  valueThresholdPercent: number = 5
): ValueBet[] {
  const valueBets: ValueBet[] = [];
  const valueThreshold = valueThresholdPercent / 100;
  
  // Check match winner (h2h) market
  game.bookmakers.forEach(bookmaker => {
    const h2hMarket = bookmaker.markets.find(m => m.key === MarketType.H2H);
    
    if (h2hMarket) {
      // Home win
      const homeOutcome = h2hMarket.outcomes.find(o => o.name === game.home_team);
      if (homeOutcome) {
        const bookmakerOdds = homeOutcome.price;
        const bookmakerProb = oddsToImpliedProbability(bookmakerOdds);
        const ourProb = prediction.homeWinProbability;
        
        // If our probability is higher than bookmaker's, it's a value bet
        if (ourProb > bookmakerProb) {
          const fairOdds = probabilityToOdds(ourProb);
          const valuePercentage = ((bookmakerOdds / fairOdds) - 1) * 100;
          
          if (valuePercentage >= valueThresholdPercent) {
            valueBets.push({
              matchId: game.id,
              market: 'Match Winner',
              selection: game.home_team,
              bookmakerName: bookmaker.title,
              bookmakerOdds: bookmakerOdds,
              impliedProbability: bookmakerProb,
              fairProbability: ourProb,
              fairOdds: fairOdds,
              valuePercentage: valuePercentage
            });
          }
        }
      }
      
      // Away win
      const awayOutcome = h2hMarket.outcomes.find(o => o.name === game.away_team);
      if (awayOutcome) {
        const bookmakerOdds = awayOutcome.price;
        const bookmakerProb = oddsToImpliedProbability(bookmakerOdds);
        const ourProb = prediction.awayWinProbability;
        
        if (ourProb > bookmakerProb) {
          const fairOdds = probabilityToOdds(ourProb);
          const valuePercentage = ((bookmakerOdds / fairOdds) - 1) * 100;
          
          if (valuePercentage >= valueThresholdPercent) {
            valueBets.push({
              matchId: game.id,
              market: 'Match Winner',
              selection: game.away_team,
              bookmakerName: bookmaker.title,
              bookmakerOdds: bookmakerOdds,
              impliedProbability: bookmakerProb,
              fairProbability: ourProb,
              fairOdds: fairOdds,
              valuePercentage: valuePercentage
            });
          }
        }
      }
      
      // Draw
      const drawOutcome = h2hMarket.outcomes.find(o => o.name === 'Draw');
      if (drawOutcome) {
        const bookmakerOdds = drawOutcome.price;
        const bookmakerProb = oddsToImpliedProbability(bookmakerOdds);
        const ourProb = prediction.drawProbability;
        
        if (ourProb > bookmakerProb) {
          const fairOdds = probabilityToOdds(ourProb);
          const valuePercentage = ((bookmakerOdds / fairOdds) - 1) * 100;
          
          if (valuePercentage >= valueThresholdPercent) {
            valueBets.push({
              matchId: game.id,
              market: 'Match Winner',
              selection: 'Draw',
              bookmakerName: bookmaker.title,
              bookmakerOdds: bookmakerOdds,
              impliedProbability: bookmakerProb,
              fairProbability: ourProb,
              fairOdds: fairOdds,
              valuePercentage: valuePercentage
            });
          }
        }
      }
    }
    
    // Add more market types here if needed (totals, spreads, etc.)
    // For simplicity, we're just checking match winner market for now
  });
  
  return valueBets;
}