import React from 'react';
import { Hand } from '../types';

// JankenHand represents the display names for the hands
export type JankenHand = "SUN" | "STAR" | "MOON";

// Map JankenHand to internal Hand type
const JANKEN_TO_HAND: Record<JankenHand, Hand> = {
  SUN: 'ROCK',
  STAR: 'SCISSORS',
  MOON: 'PAPER',
};

const HAND_TO_JANKEN: Record<Hand, JankenHand> = {
  ROCK: 'SUN',
  SCISSORS: 'STAR',
  PAPER: 'MOON',
};

interface JankenWheelProps {
  value: Hand | null;
  onChange: (hand: Hand) => void;
  disabled?: boolean;
}

const JankenWheel: React.FC<JankenWheelProps> = ({ value, onChange, disabled = false }) => {
  const selectedJanken = value ? HAND_TO_JANKEN[value] : null;

  const handleClick = (jankenHand: JankenHand) => {
    if (disabled) return;
    onChange(JANKEN_TO_HAND[jankenHand]);
  };

  // Button configurations
  const buttons = [
    {
      jankenHand: 'SUN' as JankenHand,
      icon: '☀️',
      label: '太陽',
      bgColor: 'bg-red-50',
      ringColor: 'ring-red-300',
      textColor: 'text-red-600',
      position: 'top-0 left-1/2 -translate-x-1/2', // Top center
    },
    {
      jankenHand: 'MOON' as JankenHand,
      icon: '🌙',
      label: '月',
      bgColor: 'bg-blue-50',
      ringColor: 'ring-blue-300',
      textColor: 'text-blue-600',
      position: 'bottom-4 left-4', // Bottom left
    },
    {
      jankenHand: 'STAR' as JankenHand,
      icon: '⭐',
      label: '星',
      bgColor: 'bg-emerald-50',
      ringColor: 'ring-emerald-300',
      textColor: 'text-emerald-700',
      position: 'bottom-4 right-4', // Bottom right
    },
  ];

  return (
    <div className="flex justify-center items-center py-6">
      <div className="relative w-80 h-80 sm:w-[360px] sm:h-[360px]">
        {/* Smaller background plate with emblem pattern */}
        <div className="absolute inset-8 bg-gray-200 rounded-full shadow-inner flex items-center justify-center overflow-hidden">
          {/* Emblem pattern from emblem_exact_embedded.svg */}
          <img 
            src="/images/emblem_exact_embedded.svg" 
            alt="Magatama emblem pattern"
            className="absolute opacity-30"
            style={{ left: '-10%', top: '-10%', width: '120%', height: '120%', objectFit: 'contain' }}
          />

          {/* Central small circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gray-300 rounded-full shadow-inner" />
        </div>

        {/* Three larger hand buttons positioned in triangle */}
        {buttons.map(({ jankenHand, icon, label, bgColor, ringColor, textColor, position }) => {
          const isSelected = selectedJanken === jankenHand;
          const baseClasses = `absolute w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-inner transition-all duration-200`;
          const interactiveClasses = disabled
            ? 'opacity-60 cursor-not-allowed'
            : 'cursor-pointer hover:-translate-y-1 hover:shadow-md';
          const selectedClasses = isSelected
            ? `ring-4 ${ringColor} scale-110 shadow-lg`
            : 'ring-2 ring-gray-300';

          return (
            <button
              key={jankenHand}
              onClick={() => handleClick(jankenHand)}
              disabled={disabled}
              className={`${baseClasses} ${position} ${bgColor} ${textColor} ${interactiveClasses} ${selectedClasses}`}
              aria-label={label}
            >
              <div className="text-4xl mb-1">{icon}</div>
              <div className="text-sm font-semibold">{label}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default JankenWheel;
