// index.d.ts

// Structure for a single card
export interface PlayerCard {
  name: string;
  type: string;
  level: number;
  count: number;
  img?: string;
}

// Structure for player cards result
export interface PlayerCardsResult {
  cards: PlayerCard[];
}

// Structure for player profile
export interface PlayerProfile {
  playername: string;
  trophies: number;
  bestTrophies: number;
  clan?: string;
  wins: number;
  losses: number;
  tcw: number;
}

// Fetches player profile details
export function fetchPlayerData(
  tag: string,
  apiToken: string
): Promise<PlayerProfile>;

// Fetches player cards
export function fetchPlayerCards(
  tag: string,
  apiToken: string
): Promise<PlayerCardsResult>;
