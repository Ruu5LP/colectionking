import { Card, Hand, JudgeResult } from '../../types';

// Hand comparison: ROCK > SCISSORS > PAPER > ROCK
export const compareHands = (hand1: Hand, hand2: Hand): 'WIN' | 'LOSE' | 'DRAW' => {
  if (hand1 === hand2) return 'DRAW';
  
  if (
    (hand1 === 'ROCK' && hand2 === 'SCISSORS') ||
    (hand1 === 'SCISSORS' && hand2 === 'PAPER') ||
    (hand1 === 'PAPER' && hand2 === 'ROCK')
  ) {
    return 'WIN';
  }
  
  return 'LOSE';
};

// Element advantage: FIRE > WIND > WATER > FIRE
export const hasElementAdvantage = (attacker: Card, defender: Card): boolean => {
  if (!attacker.element || !defender.element) return false;
  
  return (
    (attacker.element === 'FIRE' && defender.element === 'WIND') ||
    (attacker.element === 'WIND' && defender.element === 'WATER') ||
    (attacker.element === 'WATER' && defender.element === 'FIRE')
  );
};

// Calculate battle damage
export const calculateDamage = (attacker: Card, defender: Card): number => {
  let damage = Math.max(0, attacker.atk - defender.def);
  
  // Apply element advantage bonus (50% more damage)
  if (hasElementAdvantage(attacker, defender)) {
    damage = Math.floor(damage * 1.5);
  }
  
  return damage;
};

// Judge battle between two cards
export const judgeBattle = (playerCard: Card, cpuCard: Card): JudgeResult => {
  const handResult = compareHands(playerCard.hand, cpuCard.hand);
  
  if (handResult === 'DRAW') {
    return {
      winner: 'DRAW',
      playerDamage: 0,
      cpuDamage: 0,
      message: `引き分け！ 両者とも${playerCard.hand}を出した`,
    };
  }
  
  if (handResult === 'WIN') {
    const damage = calculateDamage(playerCard, cpuCard);
    const elementBonus = hasElementAdvantage(playerCard, cpuCard) ? ' (属性有利!)' : '';
    return {
      winner: 'PLAYER',
      playerDamage: 0,
      cpuDamage: damage,
      message: `プレイヤーの勝利！ ${damage}ダメージを与えた${elementBonus}`,
    };
  }
  
  // handResult === 'LOSE'
  const damage = calculateDamage(cpuCard, playerCard);
  const elementBonus = hasElementAdvantage(cpuCard, playerCard) ? ' (属性有利!)' : '';
  return {
    winner: 'CPU',
    playerDamage: damage,
    cpuDamage: 0,
    message: `CPUの勝利！ ${damage}ダメージを受けた${elementBonus}`,
  };
};

// Shuffle deck
export const shuffleDeck = <T,>(deck: T[]): T[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Draw cards from deck
export const drawCards = <T,>(deck: T[], count: number): { drawn: T[]; remaining: T[] } => {
  const drawn = deck.slice(0, count);
  const remaining = deck.slice(count);
  return { drawn, remaining };
};
