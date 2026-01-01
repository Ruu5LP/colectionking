import { Hand } from '../types';

// Icon mapping for each hand
export const HAND_ICONS: Record<Hand, string> = {
  ROCK: '☀️',
  SCISSORS: '⭐',
  PAPER: '🌙',
};

// Label mapping for each hand
export const HAND_LABELS: Record<Hand, string> = {
  ROCK: '太陽',
  SCISSORS: '星',
  PAPER: '月',
};

// Style mapping for each hand (base state)
export const HAND_STYLES: Record<Hand, string> = {
  ROCK: 'bg-red-50 border-red-200 text-red-700',
  SCISSORS: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  PAPER: 'bg-blue-50 border-blue-200 text-blue-700',
};

// Style mapping for selected state
export const HAND_SELECTED_STYLES: Record<Hand, string> = {
  ROCK: 'bg-red-100 border-red-200 text-red-700 ring-2 ring-red-200',
  SCISSORS: 'bg-emerald-100 border-emerald-200 text-emerald-700 ring-2 ring-emerald-200',
  PAPER: 'bg-blue-100 border-blue-200 text-blue-700 ring-2 ring-blue-200',
};

// Format hand for display (icon + label)
export const formatHand = (hand: Hand): string => {
  return `${HAND_ICONS[hand]} ${HAND_LABELS[hand]}`;
};
