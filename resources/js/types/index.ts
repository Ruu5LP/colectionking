// Card types
export type CardKind = 'NORMAL' | 'SPECIAL';
export type Hand = 'ROCK' | 'SCISSORS' | 'PAPER';
export type Element = 'FIRE' | 'WIND' | 'WATER' | null;

export interface Card {
  id: string;
  name: string;
  kind: CardKind;
  hand: Hand;
  atk: number;
  def: number;
  element: Element;
}

// Leader types
export interface Leader {
  id: string;
  name: string;
  hp: number;
}

// Deck types
export interface Deck {
  id?: number;
  user_id: string;
  leader_id: string;
  cards_json: string[];
  created_at?: string;
  updated_at?: string;
}

// Battle types
export interface BattleState {
  playerHp: number;
  cpuHp: number;
  turn: number;
  playerHand: Card[];
  cpuHand: Card[];
  playerDeck: Card[];
  cpuDeck: Card[];
  selectedCard: Card | null;
  cpuSelectedCard: Card | null;
  battleLog: string[];
  phase: 'SELECT' | 'JUDGE' | 'END';
  winner: 'PLAYER' | 'CPU' | null;
}

export interface JudgeResult {
  winner: 'PLAYER' | 'CPU' | 'DRAW';
  playerDamage: number;
  cpuDamage: number;
  message: string;
}
