import { Card, Hand, JudgeResult } from '../../types';

// Helper: Triangular distribution centered at 1.0
// Returns a random number with peak at center (1.0)
const triangularRandom = (min = 0.7, max = 1.3, mode = 1.0): number => {
  const u = Math.random();
  const F = (mode - min) / (max - min);
  if (u < F) {
    return min + Math.sqrt(u * (max - min) * (mode - min));
  } else {
    return max - Math.sqrt((1 - u) * (max - min) * (max - mode));
  }
};

// Helper: Clamp value between min and max
const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

// Helper: Soft cap function - compresses values above cap
// Uses smooth transition instead of hard clamp
const softCap = (value: number, cap: number, softness: number): number => {
  if (value <= cap) return value;
  const excess = value - cap;
  // Logarithmic compression for smooth upper bound
  return cap + softness * Math.log(1 + excess / softness);
};

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

// Calculate battle damage with HP consideration
export const calculateDamage = (
  attacker: Card, 
  defender: Card, 
  attackerHp: number, 
  defenderHp: number,
  isSmallDamage = false
): number => {
  // Apply internal upper limit to atk/def
  const atkCapped = Math.min(attacker.atk, 700);
  const defCapped = Math.min(defender.def, 700);
  
  // Calculate HP ratio correction (mild)
  const hpRatio = attackerHp / Math.max(1, defenderHp);
  const hpCorrection = clamp(Math.pow(hpRatio, 0.10), 0.80, 1.25);
  
  // Apply triangular random multiplier (centered at 1.0)
  const randomMultiplier = triangularRandom(0.7, 1.3, 1.0);
  
  if (isSmallDamage) {
    // Small damage calculation (for draws)
    // Base around 20, making median ~30 after multipliers
    const base = 20;
    const raw = (atkCapped - defCapped) * 0.1;
    let damage = base + Math.max(0, raw);
    
    // Apply HP correction and randomness
    damage = damage * hpCorrection * randomMultiplier;
    
    // Apply element advantage bonus (30% for small damage)
    if (hasElementAdvantage(attacker, defender)) {
      damage = damage * 1.3;
    }
    
    // Soft cap to prevent extreme values (cap at 60, softness 15)
    damage = softCap(damage, 60, 15);
    
    return Math.floor(damage);
  } else {
    // Big damage calculation (for wins)
    // Base 230 to get median around 300 after multipliers
    const base = 230;
    const raw = (atkCapped - defCapped) * 0.8;
    let damage = base + Math.max(0, raw);
    
    // Apply HP correction and randomness
    damage = damage * hpCorrection * randomMultiplier;
    
    // Apply element advantage bonus (50% for big damage)
    if (hasElementAdvantage(attacker, defender)) {
      damage = damage * 1.5;
    }
    
    // Soft cap to prevent extreme upper values (cap at 520, softness 80)
    damage = softCap(damage, 520, 80);
    
    return Math.floor(damage);
  }
};

// Judge battle between two cards with player-chosen hands
export const judgeBattle = (
  playerCard: Card,
  cpuCard: Card,
  playerHand: Hand,
  cpuHand: Hand,
  playerHp: number,
  cpuHp: number
): JudgeResult => {
  const handResult = compareHands(playerHand, cpuHand);
  
  if (handResult === 'DRAW') {
    // Both take small damage
    const playerDamage = calculateDamage(cpuCard, playerCard, cpuHp, playerHp, true);
    const cpuDamage = calculateDamage(playerCard, cpuCard, playerHp, cpuHp, true);
    return {
      winner: 'DRAW',
      playerDamage,
      cpuDamage,
      message: `引き分け！ 両者とも${playerHand}を出した。お互いに小ダメージ`,
    };
  }
  
  if (handResult === 'WIN') {
    const damage = calculateDamage(playerCard, cpuCard, playerHp, cpuHp, false);
    const elementBonus = hasElementAdvantage(playerCard, cpuCard) ? ' (属性有利!)' : '';
    return {
      winner: 'PLAYER',
      playerDamage: 0,
      cpuDamage: damage,
      message: `プレイヤーの勝利！ ${playerHand} > ${cpuHand} で${damage}ダメージを与えた${elementBonus}`,
    };
  }
  
  // handResult === 'LOSE'
  const damage = calculateDamage(cpuCard, playerCard, cpuHp, playerHp, false);
  const elementBonus = hasElementAdvantage(cpuCard, playerCard) ? ' (属性有利!)' : '';
  return {
    winner: 'CPU',
    playerDamage: damage,
    cpuDamage: 0,
    message: `CPUの勝利！ ${cpuHand} > ${playerHand} で${damage}ダメージを受けた${elementBonus}`,
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
