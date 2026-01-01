import { Card, Hand, JudgeResult } from '../../types';

// Damage calculation constants
const FIXED_BASE_DAMAGE = 80;
const ATK_DEF_MULTIPLIER = 2.0;
const MIN_DAMAGE_FACTOR = 0.7;
const MAX_DAMAGE_FACTOR = 1.3;
const WIN_DAMAGE_MULTIPLIER = 1.25;
const DRAW_DAMAGE_MULTIPLIER = 0.55;
const MIN_DAMAGE = 10;
const ATK_DEF_SOFT_CLAMP_LIMIT = 650;
const ATK_DEF_SOFT_CLAMP_SOFTNESS = 0.1;
const HP_SCALE_MIN = 0.4;
const HP_SCALE_MAX = 3.0;
const HP_SCALE_EXPONENT = 0.5;

// Triangular distribution random number generator
// Returns a random number between min and max with peak at the center
const triangularRandom = (min: number, max: number): number => {
  // Handle edge case where min === max
  if (min === max) return min;
  
  const u = Math.random();
  const range = max - min;
  
  if (u < 0.5) {
    return min + Math.sqrt(u * 2) * range * 0.5;
  } else {
    return max - Math.sqrt((1 - u) * 2) * range * 0.5;
  }
};

// Soft clamp function to prevent extreme values
// Allows values to exceed limits but with diminishing returns
const softClamp = (value: number, min: number, max: number, softness: number = 0.1): number => {
  if (value < min) {
    const diff = min - value;
    return min - diff / (1 + diff * softness); // Asymptotically approaches min from below
  }
  if (value > max) {
    const diff = value - max;
    return max + diff / (1 + diff * softness); // Asymptotically approaches infinity above max
  }
  return value;
};

// HP ratio scaling to give advantage to stronger fighters
const hpRatioScale = (attackerHp: number, defenderHp: number): number => {
  // Handle edge cases
  if (attackerHp <= 0) return HP_SCALE_MIN;
  if (defenderHp <= 0) return HP_SCALE_MAX;
  
  const ratio = attackerHp / defenderHp;
  // Use square root scaling for balanced gameplay with significant impact in one-sided battles
  const scaled = Math.pow(ratio, HP_SCALE_EXPONENT);
  return Math.max(HP_SCALE_MIN, Math.min(HP_SCALE_MAX, scaled));
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

// Calculate battle damage with HP-aware scaling
export const calculateDamage = (
  attacker: Card,
  defender: Card,
  attackerHp: number,
  defenderHp: number
): number => {
  // Apply soft upper limit to atk/def to prevent extreme values
  // No lower limit needed as ATK/DEF are naturally non-negative from card data
  const effectiveAtk = attacker.atk > ATK_DEF_SOFT_CLAMP_LIMIT 
    ? softClamp(attacker.atk, 0, ATK_DEF_SOFT_CLAMP_LIMIT, ATK_DEF_SOFT_CLAMP_SOFTNESS)
    : attacker.atk;
  const effectiveDef = defender.def > ATK_DEF_SOFT_CLAMP_LIMIT
    ? softClamp(defender.def, 0, ATK_DEF_SOFT_CLAMP_LIMIT, ATK_DEF_SOFT_CLAMP_SOFTNESS)
    : defender.def;
  
  // Calculate base damage with triangular distribution
  // Use a fixed base plus the scaled difference
  const baseDiff = effectiveAtk - effectiveDef;
  const scaledDamage = Math.max(0, baseDiff * ATK_DEF_MULTIPLIER);
  const minDamage = FIXED_BASE_DAMAGE + scaledDamage * MIN_DAMAGE_FACTOR;
  const maxDamage = FIXED_BASE_DAMAGE + scaledDamage * MAX_DAMAGE_FACTOR;
  let damage = triangularRandom(minDamage, maxDamage);
  
  // Apply element advantage bonus (50% more damage)
  if (hasElementAdvantage(attacker, defender)) {
    damage = damage * 1.5;
  }
  
  // Apply HP ratio scaling
  const hpScale = hpRatioScale(attackerHp, defenderHp);
  damage = damage * hpScale;
  
  // Ensure minimum damage (no 0 damage)
  return Math.max(MIN_DAMAGE, Math.floor(damage));
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
    // Both take small damage with DRAW multiplier
    const playerBaseDamage = calculateDamage(cpuCard, playerCard, cpuHp, playerHp);
    const cpuBaseDamage = calculateDamage(playerCard, cpuCard, playerHp, cpuHp);
    const playerDamage = Math.floor(playerBaseDamage * DRAW_DAMAGE_MULTIPLIER);
    const cpuDamage = Math.floor(cpuBaseDamage * DRAW_DAMAGE_MULTIPLIER);
    return {
      winner: 'DRAW',
      playerDamage,
      cpuDamage,
      message: `引き分け！ 両者とも${playerHand}を出した。プレイヤー${playerDamage}ダメージ、CPU${cpuDamage}ダメージ`,
    };
  }
  
  if (handResult === 'WIN') {
    // Player wins with WIN multiplier
    const baseDamage = calculateDamage(playerCard, cpuCard, playerHp, cpuHp);
    const damage = Math.floor(baseDamage * WIN_DAMAGE_MULTIPLIER);
    const elementBonus = hasElementAdvantage(playerCard, cpuCard) ? ' (属性有利!)' : '';
    return {
      winner: 'PLAYER',
      playerDamage: 0,
      cpuDamage: damage,
      message: `プレイヤーの勝利！ ${playerHand} > ${cpuHand} で${damage}ダメージを与えた${elementBonus}`,
    };
  }
  
  // handResult === 'LOSE'
  // CPU wins with WIN multiplier
  const baseDamage = calculateDamage(cpuCard, playerCard, cpuHp, playerHp);
  const damage = Math.floor(baseDamage * WIN_DAMAGE_MULTIPLIER);
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
