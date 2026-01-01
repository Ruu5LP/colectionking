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

// Element advantage: FIRE > WIND > WATER > FIRE (only for SPECIAL cards)
export const getElementExtra = (attacker: Card, defender: Card): number => {
  // NORMAL cards have no element advantage
  if (attacker.kind !== 'SPECIAL' || defender.kind !== 'SPECIAL') {
    return 0;
  }
  
  // Both must have elements
  if (!attacker.element || !defender.element) {
    return 0;
  }
  
  // Same element = 0
  if (attacker.element === defender.element) {
    return 0;
  }
  
  // Check advantage: FIRE > WIND > WATER > FIRE
  if (
    (attacker.element === 'FIRE' && defender.element === 'WIND') ||
    (attacker.element === 'WIND' && defender.element === 'WATER') ||
    (attacker.element === 'WATER' && defender.element === 'FIRE')
  ) {
    return 40; // Advantage
  }
  
  return -40; // Disadvantage
};

// Calculate battle damage with proper formula
// damage = max(1, floor((atk - enemyDef*0.5 + bonus + extra) * rand))
export const calculateDamage = (attacker: Card, defender: Card, bonus: number): number => {
  const extra = getElementExtra(attacker, defender);
  
  // rand: 0.85 ~ 1.15
  const rand = 0.85 + Math.random() * 0.3;
  
  const baseDamage = attacker.atk - defender.def * 0.5 + bonus + extra;
  const damage = Math.max(1, Math.floor(baseDamage * rand));
  
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
    const bonus = 30; // Win bonus
    const extra = getElementExtra(playerCard, cpuCard);
    const damage = calculateDamage(playerCard, cpuCard, bonus);
    
    let elementInfo = '';
    if (extra > 0) {
      elementInfo = ' (属性有利!)';
    } else if (extra < 0) {
      elementInfo = ' (属性不利!)';
    }
    
    return {
      winner: 'PLAYER',
      playerDamage: 0,
      cpuDamage: damage,
      message: `プレイヤーの勝利！ ${damage}ダメージを与えた${elementInfo}`,
    };
  }
  
  // handResult === 'LOSE'
  const bonus = -30; // Lose penalty
  const extra = getElementExtra(cpuCard, playerCard);
  const damage = calculateDamage(cpuCard, playerCard, bonus);
  
  let elementInfo = '';
  if (extra > 0) {
    elementInfo = ' (属性有利!)';
  } else if (extra < 0) {
    elementInfo = ' (属性不利!)';
  }
  
  return {
    winner: 'CPU',
    playerDamage: damage,
    cpuDamage: 0,
    message: `CPUの勝利！ ${damage}ダメージを受けた${elementInfo}`,
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
