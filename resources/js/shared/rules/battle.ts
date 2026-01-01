import { Card, Hand, JudgeResult } from '../../types';

// Damage calculation constants
const DAMAGE_CONFIG = {
  // Base damage values
  BIG_DAMAGE_BASE: 230,
  SMALL_DAMAGE_BASE: 20,
  
  // Stat difference scaling factors
  BIG_DAMAGE_STAT_MULTIPLIER: 0.8,
  SMALL_DAMAGE_STAT_MULTIPLIER: 0.1,
  
  // Soft cap parameters
  BIG_DAMAGE_CAP: 520,
  BIG_DAMAGE_SOFTNESS: 80,
  SMALL_DAMAGE_CAP: 60,
  SMALL_DAMAGE_SOFTNESS: 15,
  
  // Stat limits
  STAT_INTERNAL_CAP: 700,
  
  // HP correction parameters
  HP_CORRECTION_EXPONENT: 0.10,
  HP_CORRECTION_MIN: 0.80,
  HP_CORRECTION_MAX: 1.25,
  
  // Element advantage bonuses
  ELEMENT_BONUS_BIG: 1.5,
  ELEMENT_BONUS_SMALL: 1.3,
};

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
  const atkCapped = Math.min(attacker.atk, DAMAGE_CONFIG.STAT_INTERNAL_CAP);
  const defCapped = Math.min(defender.def, DAMAGE_CONFIG.STAT_INTERNAL_CAP);
  
  // Calculate HP ratio correction (mild)
  // Note: Math.max(1, defenderHp) is defensive programming since HP should never be 0 during battle
  const hpRatio = attackerHp / Math.max(1, defenderHp);
  const hpCorrection = clamp(
    Math.pow(hpRatio, DAMAGE_CONFIG.HP_CORRECTION_EXPONENT),
    DAMAGE_CONFIG.HP_CORRECTION_MIN,
    DAMAGE_CONFIG.HP_CORRECTION_MAX
  );
  
  // Apply triangular random multiplier (centered at 1.0)
  const randomMultiplier = triangularRandom(0.7, 1.3, 1.0);
  
  if (isSmallDamage) {
    // Small damage calculation (for draws)
    const base = DAMAGE_CONFIG.SMALL_DAMAGE_BASE;
    const raw = (atkCapped - defCapped) * DAMAGE_CONFIG.SMALL_DAMAGE_STAT_MULTIPLIER;
    let damage = base + Math.max(0, raw);
    
    // Apply HP correction and randomness
    damage = damage * hpCorrection * randomMultiplier;
    
    // Apply element advantage bonus
    if (hasElementAdvantage(attacker, defender)) {
      damage = damage * DAMAGE_CONFIG.ELEMENT_BONUS_SMALL;
    }
    
    // Soft cap to prevent extreme values
    damage = softCap(damage, DAMAGE_CONFIG.SMALL_DAMAGE_CAP, DAMAGE_CONFIG.SMALL_DAMAGE_SOFTNESS);
    
    return Math.floor(damage);
  } else {
    // Big damage calculation (for wins)
    const base = DAMAGE_CONFIG.BIG_DAMAGE_BASE;
    const raw = (atkCapped - defCapped) * DAMAGE_CONFIG.BIG_DAMAGE_STAT_MULTIPLIER;
    let damage = base + Math.max(0, raw);
    
    // Apply HP correction and randomness
    damage = damage * hpCorrection * randomMultiplier;
    
    // Apply element advantage bonus
    if (hasElementAdvantage(attacker, defender)) {
      damage = damage * DAMAGE_CONFIG.ELEMENT_BONUS_BIG;
    }
    
    // Soft cap to prevent extreme upper values
    damage = softCap(damage, DAMAGE_CONFIG.BIG_DAMAGE_CAP, DAMAGE_CONFIG.BIG_DAMAGE_SOFTNESS);
    
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
