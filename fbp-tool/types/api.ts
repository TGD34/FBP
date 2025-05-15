export interface Sport {
  key: string;
  group: string;
  title: string;
  description: string;
  active: boolean;
  has_outrights: boolean;
}

export interface Bookmaker {
  key: string;
  title: string;
  last_update: string;
  markets: Market[];
}

export interface Market {
  key: string;
  last_update: string;
  outcomes: Outcome[];
}

export interface Outcome {
  name: string;
  price: number;
  point?: number;
}

export interface Game {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Bookmaker[];
}

export interface ApiResponse {
  success: boolean;
  data: Game[];
}

export enum MarketType {
  H2H = "h2h",
  SPREADS = "spreads",
  TOTALS = "totals"
}

export interface PredictionResult {
  homeWinProbability: number;
  drawProbability: number;
  awayWinProbability: number;
  recommendedBets: RecommendedBet[];
}

export interface RecommendedBet {
  market: string;
  selection: string;
  odds: number;
  confidence: number;
}

export interface League {
  key: string;
  title: string;
  country: string;
  icon: string;
}

export interface ValueBet {
  matchId: string;
  market: string;
  selection: string;
  bookmakerName: string;
  bookmakerOdds: number;
  impliedProbability: number;
  fairProbability: number;
  fairOdds: number;
  valuePercentage: number;
}