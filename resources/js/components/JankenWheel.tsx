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
        {/* Background plate with rune pattern */}
        <div className="absolute inset-0 bg-gray-200 rounded-full shadow-inner flex items-center justify-center overflow-hidden">
          {/* Magatama (勾玉) pattern - three comma-shaped jewels extending to buttons */}
          <svg
            className="absolute inset-0 w-full h-full opacity-30"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Three magatama (comma jewels) extending outward to button positions */}
            <g fill="currentColor" stroke="none" className="text-gray-500">
              {/* Sun magatama (top) - extending upward to Sun button */}
              <path 
                d="M 100 100 C 95 100, 90 95, 88 88 C 86 82, 85 75, 88 68 C 90 63, 95 58, 100 55 C 108 50, 115 48, 120 52 C 125 56, 128 63, 128 70 C 128 78, 124 85, 118 90 C 112 95, 105 100, 100 100 Z" 
                opacity="0.9"
              />
              {/* Moon magatama (bottom-left) - extending to Moon button */}
              <path 
                d="M 100 100 C 100 105, 95 110, 88 112 C 82 114, 75 115, 68 112 C 63 110, 58 105, 55 100 C 50 92, 48 85, 52 80 C 56 75, 63 72, 70 72 C 78 72, 85 76, 90 82 C 95 88, 100 95, 100 100 Z" 
                opacity="0.9"
              />
              {/* Star magatama (bottom-right) - extending to Star button */}
              <path 
                d="M 100 100 C 100 105, 105 110, 112 112 C 118 114, 125 115, 132 112 C 137 110, 142 105, 145 100 C 150 92, 152 85, 148 80 C 144 75, 137 72, 130 72 C 122 72, 115 76, 110 82 C 105 88, 100 95, 100 100 Z" 
                opacity="0.9"
              />
              
              {/* Central circle connecting the three */}
              <circle cx="100" cy="100" r="18" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.6" />
              
              {/* Small decorative dots at the tips of each magatama */}
              <circle cx="120" cy="52" r="4" opacity="0.7" />
              <circle cx="52" cy="80" r="4" opacity="0.7" />
              <circle cx="148" cy="80" r="4" opacity="0.7" />
            </g>
          </svg>

          {/* Central small circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gray-300 rounded-full shadow-inner" />
        </div>

        {/* Three hand buttons positioned in triangle */}
        {buttons.map(({ jankenHand, icon, label, bgColor, ringColor, textColor, position }) => {
          const isSelected = selectedJanken === jankenHand;
          const baseClasses = `absolute w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-inner transition-all duration-200`;
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
              <div className="text-3xl mb-1">{icon}</div>
              <div className="text-xs font-semibold">{label}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default JankenWheel;
