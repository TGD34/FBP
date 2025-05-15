import { Game, MarketType } from '@/types/api';

export const mockMatches: Game[] = [
  {
    id: "1",
    sport_key: "soccer_epl",
    sport_title: "Premier League",
    commence_time: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    home_team: "Arsenal",
    away_team: "Chelsea",
    bookmakers: [
      {
        key: "betfair",
        title: "Betfair",
        last_update: new Date().toISOString(),
        markets: [
          {
            key: MarketType.H2H,
            last_update: new Date().toISOString(),
            outcomes: [
              {
                name: "Arsenal",
                price: 2.1
              },
              {
                name: "Chelsea",
                price: 3.5
              },
              {
                name: "Draw",
                price: 3.2
              }
            ]
          },
          {
            key: MarketType.SPREADS,
            last_update: new Date().toISOString(),
            outcomes: [
              {
                name: "Arsenal",
                price: 1.9,
                point: -0.5
              },
              {
                name: "Chelsea",
                price: 1.9,
                point: 0.5
              }
            ]
          },
          {
            key: MarketType.TOTALS,
            last_update: new Date().toISOString(),
            outcomes: [
              {
                name: "Over",
                price: 1.85,
                point: 2.5
              },
              {
                name: "Under",
                price: 1.95,
                point: 2.5
              }
            ]
          }
        ]
      },
      {
        key: "williamhill",
        title: "William Hill",
        last_update: new Date().toISOString(),
        markets: [
          {
            key: MarketType.H2H,
            last_update: new Date().toISOString(),
            outcomes: [
              {
                name: "Arsenal",
                price: 2.0
              },
              {
                name: "Chelsea",
                price: 3.6
              },
              {
                name: "Draw",
                price: 3.25
              }
            ]
          },
          {
            key: MarketType.SPREADS,
            last_update: new Date().toISOString(),
            outcomes: [
              {
                name: "Arsenal",
                price: 1.85,
                point: -0.5
              },
              {
                name: "Chelsea",
                price: 1.95,
                point: 0.5
              }
            ]
          },
          {
            key: MarketType.TOTALS,
            last_update: new Date().toISOString(),
            outcomes: [
              {
                name: "Over",
                price: 1.9,
                point: 2.5
              },
              {
                name: "Under",
                price: 1.9,
                point: 2.5
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "2",
    sport_key: "soccer_epl",
    sport_title: "Premier League",
    commence_time: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
    home_team: "Manchester City",
    away_team: "Liverpool",
    bookmakers: [
      {
        key: "betfair",
        title: "Betfair",
        last_update: new Date().toISOString(),
        markets: [
          {
            key: MarketType.H2H,
            last_update: new Date().toISOString(),
            outcomes: [
              {
                name: "Manchester City",
                price: 1.8
              },
              {
                name: "Liverpool",
                price: 4.0
              },
              {
                name: "Draw",
                price: 3.5
              }
            ]
          },
          {
            key: MarketType.SPREADS,
            last_update: new Date().toISOString(),
            outcomes: [
              {
                name: "Manchester City",
                price: 1.9,
                point: -1.0
              },
              {
                name: "Liverpool",
                price: 1.9,
                point: 1.0
              }
            ]
          },
          {
            key: MarketType.TOTALS,
            last_update: new Date().toISOString(),
            outcomes: [
              {
                name: "Over",
                price: 1.75,
                point: 2.5
              },
              {
                name: "Under",
                price: 2.05,
                point: 2.5
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "3",
    sport_key: "soccer_epl",
    sport_title: "Premier League",
    commence_time: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
    home_team: "Tottenham",
    away_team: "Manchester United",
    bookmakers: [
      {
        key: "betfair",
        title: "Betfair",
        last_update: new Date().toISOString(),
        markets: [
          {
            key: MarketType.H2H,
            last_update: new Date().toISOString(),
            outcomes: [
              {
                name: "Tottenham",
                price: 2.4
              },
              {
                name: "Manchester United",
                price: 2.9
              },
              {
                name: "Draw",
                price: 3.3
              }
            ]
          },
          {
            key: MarketType.SPREADS,
            last_update: new Date().toISOString(),
            outcomes: [
              {
                name: "Tottenham",
                price: 1.9,
                point: -0.25
              },
              {
                name: "Manchester United",
                price: 1.9,
                point: 0.25
              }
            ]
          },
          {
            key: MarketType.TOTALS,
            last_update: new Date().toISOString(),
            outcomes: [
              {
                name: "Over",
                price: 1.8,
                point: 2.5
              },
              {
                name: "Under",
                price: 2.0,
                point: 2.5
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "4",
    sport_key: "soccer_spain_la_liga",
    sport_title: "La Liga",
    commence_time: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    home_team: "Barcelona",
    away_team: "Real Madrid",
    bookmakers: [
      {
        key: "betfair",
        title: "Betfair",
        last_update: new Date().toISOString(),
        markets: [
          {
            key: MarketType.H2H,
            last_update: new Date().toISOString(),
            outcomes: [
              {
                name: "Barcelona",
                price: 2.2
              },
              {
                name: "Real Madrid",
                price: 3.1
              },
              {
                name: "Draw",
                price: 3.4
              }
            ]
          },
          {
            key: MarketType.SPREADS,
            last_update: new Date().toISOString(),
            outcomes: [
              {
                name: "Barcelona",
                price: 1.9,
                point: -0.5
              },
              {
                name: "Real Madrid",
                price: 1.9,
                point: 0.5
              }
            ]
          },
          {
            key: MarketType.TOTALS,
            last_update: new Date().toISOString(),
            outcomes: [
              {
                name: "Over",
                price: 1.8,
                point: 2.5
              },
              {
                name: "Under",
                price: 2.0,
                point: 2.5
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "5",
    sport_key: "soccer_germany_bundesliga",
    sport_title: "Bundesliga",
    commence_time: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
    home_team: "Bayern Munich",
    away_team: "Borussia Dortmund",
    bookmakers: [
      {
        key: "betfair",
        title: "Betfair",
        last_update: new Date().toISOString(),
        markets: [
          {
            key: MarketType.H2H,
            last_update: new Date().toISOString(),
            outcomes: [
              {
                name: "Bayern Munich",
                price: 1.7
              },
              {
                name: "Borussia Dortmund",
                price: 4.5
              },
              {
                name: "Draw",
                price: 3.8
              }
            ]
          },
          {
            key: MarketType.SPREADS,
            last_update: new Date().toISOString(),
            outcomes: [
              {
                name: "Bayern Munich",
                price: 1.9,
                point: -1.0
              },
              {
                name: "Borussia Dortmund",
                price: 1.9,
                point: 1.0
              }
            ]
          },
          {
            key: MarketType.TOTALS,
            last_update: new Date().toISOString(),
            outcomes: [
              {
                name: "Over",
                price: 1.7,
                point: 3.5
              },
              {
                name: "Under",
                price: 2.1,
                point: 3.5
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "6",
    sport_key: "soccer_italy_serie_a",
    sport_title: "Serie A",
    commence_time: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
    home_team: "Juventus",
    away_team: "AC Milan",
    bookmakers: [
      {
        key: "betfair",
        title: "Betfair",
        last_update: new Date().toISOString(),
        markets: [
          {
            key: MarketType.H2H,
            last_update: new Date().toISOString(),
            outcomes: [
              {
                name: "Juventus",
                price: 2.3
              },
              {
                name: "AC Milan",
                price: 3.0
              },
              {
                name: "Draw",
                price: 3.2
              }
            ]
          },
          {
            key: MarketType.SPREADS,
            last_update: new Date().toISOString(),
            outcomes: [
              {
                name: "Juventus",
                price: 1.9,
                point: -0.5
              },
              {
                name: "AC Milan",
                price: 1.9,
                point: 0.5
              }
            ]
          },
          {
            key: MarketType.TOTALS,
            last_update: new Date().toISOString(),
            outcomes: [
              {
                name: "Over",
                price: 1.85,
                point: 2.5
              },
              {
                name: "Under",
                price: 1.95,
                point: 2.5
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "7",
    sport_key: "soccer_france_ligue_one",
    sport_title: "Ligue 1",
    commence_time: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    home_team: "PSG",
    away_team: "Marseille",
    bookmakers: [
      {
        key: "betfair",
        title: "Betfair",
        last_update: new Date().toISOString(),
        markets: [
          {
            key: MarketType.H2H,
            last_update: new Date().toISOString(),
            outcomes: [
              {
                name: "PSG",
                price: 1.6
              },
              {
                name: "Marseille",
                price: 5.0
              },
              {
                name: "Draw",
                price: 4.0
              }
            ]
          },
          {
            key: MarketType.SPREADS,
            last_update: new Date().toISOString(),
            outcomes: [
              {
                name: "PSG",
                price: 1.9,
                point: -1.5
              },
              {
                name: "Marseille",
                price: 1.9,
                point: 1.5
              }
            ]
          },
          {
            key: MarketType.TOTALS,
            last_update: new Date().toISOString(),
            outcomes: [
              {
                name: "Over",
                price: 1.75,
                point: 2.5
              },
              {
                name: "Under",
                price: 2.05,
                point: 2.5
              }
            ]
          }
        ]
      }
    ]
  }
];