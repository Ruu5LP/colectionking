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
          {/* Magatama (勾玉) pattern - three comma-shaped jewels rotating in a circle */}
          <svg
            className="absolute inset-0 w-full h-full opacity-25"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Three magatama (comma jewels) in a circular pattern showing the win cycle */}
            <g fill="currentColor" stroke="none" className="text-gray-500">
              {/* Sun magatama (top) - beats Star */}
              <path 
                d="M 100 50 C 100 50, 85 55, 80 65 C 75 75, 75 85, 80 90 C 85 95, 95 95, 100 90 C 105 85, 108 75, 100 60 C 95 50, 100 50, 100 50 Z" 
                transform="rotate(-90 100 100)"
                opacity="0.8"
              />
              {/* Moon magatama (bottom-left) - beats Sun */}
              <path 
                d="M 100 50 C 100 50, 85 55, 80 65 C 75 75, 75 85, 80 90 C 85 95, 95 95, 100 90 C 105 85, 108 75, 100 60 C 95 50, 100 50, 100 50 Z" 
                transform="rotate(150 100 100)"
                opacity="0.8"
              />
              {/* Star magatama (bottom-right) - beats Moon */}
              <path 
                d="M 100 50 C 100 50, 85 55, 80 65 C 75 75, 75 85, 80 90 C 85 95, 95 95, 100 90 C 105 85, 108 75, 100 60 C 95 50, 100 50, 100 50 Z" 
                transform="rotate(30 100 100)"
                opacity="0.8"
              />
              
              {/* Central circle connecting the three */}
              <circle cx="100" cy="100" r="20" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
              
              {/* Small dots at the tail of each magatama to emphasize rotation */}
              <circle cx="100" cy="50" r="3" transform="rotate(-90 100 100)" opacity="0.6" />
              <circle cx="100" cy="50" r="3" transform="rotate(150 100 100)" opacity="0.6" />
              <circle cx="100" cy="50" r="3" transform="rotate(30 100 100)" opacity="0.6" />
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
