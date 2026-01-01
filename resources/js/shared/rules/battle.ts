import { Card, Hand, JudgeResult } from '../../types';

// Triangular distribution random number generator
// Returns a random number between min and max with peak at the center
const triangularRandom = (min: number, max: number): number => {
  const u = Math.random();
  const range = max - min;
  
  if (u < 0.5) {
    return min + Math.sqrt(u * 0.5) * range;
  } else {
    return max - Math.sqrt((1 - u) * 0.5) * range;
  }
};

// Soft clamp function to prevent extreme values
const softClamp = (value: number, min: number, max: number, softness: number = 0.1): number => {
  if (value < min) {
    const diff = min - value;
    return min - diff * softness;
  }
  if (value > max) {
    const diff = value - max;
    return max + diff * softness;
  }
  return value;
};

// HP ratio scaling to give advantage to stronger fighters
const hpRatioScale = (attackerHp: number, defenderHp: number): number => {
  if (defenderHp <= 0) return 3.0;
  const ratio = attackerHp / defenderHp;
  // Use a very aggressive exponent (0.5) for extreme scaling in one-sided battles
  const scaled = Math.pow(ratio, 0.5);
  return Math.max(0.4, Math.min(3.0, scaled));
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
  // Apply soft clamp to atk/def to prevent extreme values (upper limit 650)
  const effectiveAtk = softClamp(attacker.atk, 0, 650, 0.1);
  const effectiveDef = softClamp(defender.def, 0, 650, 0.1);
  
  // Calculate base damage with triangular distribution
  // Use a fixed base plus the scaled difference
  const baseDiff = effectiveAtk - effectiveDef;
  const fixedBase = 80; // Fixed base damage
  const scaledDamage = Math.max(0, baseDiff * 2.0); // 2x multiplier for atk-def difference
  const minDamage = fixedBase + scaledDamage * 0.7;
  const maxDamage = fixedBase + scaledDamage * 1.3;
  let damage = triangularRandom(minDamage, maxDamage);
  
  // Apply element advantage bonus (50% more damage)
  if (hasElementAdvantage(attacker, defender)) {
    damage = damage * 1.5;
  }
  
  // Apply HP ratio scaling
  const hpScale = hpRatioScale(attackerHp, defenderHp);
  damage = damage * hpScale;
  
  // Ensure minimum damage (no 0 damage)
  return Math.max(10, Math.floor(damage));
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
    // Both take small damage with DRAW multiplier (0.55)
    const playerBaseDamage = calculateDamage(cpuCard, playerCard, cpuHp, playerHp);
    const cpuBaseDamage = calculateDamage(playerCard, cpuCard, playerHp, cpuHp);
    const playerDamage = Math.floor(playerBaseDamage * 0.55);
    const cpuDamage = Math.floor(cpuBaseDamage * 0.55);
    return {
      winner: 'DRAW',
      playerDamage,
      cpuDamage,
      message: `引き分け！ 両者とも${playerHand}を出した。お互いに小ダメージ`,
    };
  }
  
  if (handResult === 'WIN') {
    // Player wins with WIN multiplier (1.25)
    const baseDamage = calculateDamage(playerCard, cpuCard, playerHp, cpuHp);
    const damage = Math.floor(baseDamage * 1.25);
    const elementBonus = hasElementAdvantage(playerCard, cpuCard) ? ' (属性有利!)' : '';
    return {
      winner: 'PLAYER',
      playerDamage: 0,
      cpuDamage: damage,
      message: `プレイヤーの勝利！ ${playerHand} > ${cpuHand} で${damage}ダメージを与えた${elementBonus}`,
    };
  }
  
  // handResult === 'LOSE'
  // CPU wins with WIN multiplier (1.25)
  const baseDamage = calculateDamage(cpuCard, playerCard, cpuHp, playerHp);
  const damage = Math.floor(baseDamage * 1.25);
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
