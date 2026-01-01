// Card types
export type CardKind = 'NORMAL' | 'SPECIAL';
export type Hand = 'ROCK' | 'SCISSORS' | 'PAPER';
export type Element = 'FIRE' | 'WIND' | 'WATER' | null;

export interface Card {
  id: string;
  name: string;
  kind: CardKind;
  atk: number;
  def: number;
  hp: number;
  element: Element;
}

// Deck types
export interface Deck {
  id?: number;
  user_id: string;
  leader_card_id: string;
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
  selectedHand: Hand | null;
  cpuSelectedCard: Card | null;
  cpuSelectedHand: Hand | null;
  battleLog: string[];
  phase: 'SELECT_CARD' | 'SELECT_HAND' | 'JUDGE' | 'END';
  winner: 'PLAYER' | 'CPU' | 'DRAW' | null;
}

export interface JudgeResult {
  winner: 'PLAYER' | 'CPU' | 'DRAW';
  playerDamage: number;
  cpuDamage: number;
  message: string;
}
