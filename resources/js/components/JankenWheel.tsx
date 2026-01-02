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
        {/* Smaller background plate with magatama pattern */}
        <div className="absolute inset-8 bg-gray-200 rounded-full shadow-inner flex items-center justify-center overflow-hidden">
          {/* Magatama (勾玉) pattern - each tail connects to the button it beats */}
          <svg
            className="absolute w-full h-full opacity-35"
            viewBox="0 0 200 200"
            style={{ left: '-16%', top: '-16%', width: '132%', height: '132%' }}
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Three magatama with tails pointing to create win cycle */}
            <g fill="currentColor" stroke="none" className="text-gray-500">
              {/* Sun magatama - body at top (Sun position), tail curves toward bottom-right (Star position) */}
              <path 
                d="M 100 30 C 110 30, 118 35, 122 45 C 125 52, 125 60, 122 68 C 118 78, 110 85, 105 92 C 102 98, 105 105, 112 112 C 118 118, 125 120, 132 118 C 135 117, 137 114, 138 110 C 140 102, 136 95, 130 90 C 120 82, 108 78, 100 70 C 92 62, 88 52, 88 42 C 88 35, 92 30, 100 30 Z"
                opacity="0.85"
              />
              
              {/* Star magatama - body at bottom-right (Star position), tail curves toward bottom-left (Moon position) */}
              <path 
                d="M 155 135 C 162 130, 165 122, 165 113 C 165 105, 162 98, 155 93 C 148 88, 140 87, 132 88 C 122 90, 115 95, 110 103 C 105 110, 102 118, 95 122 C 88 126, 80 126, 73 123 C 68 121, 65 117, 64 112 C 62 105, 65 98, 70 93 C 78 85, 88 82, 98 82 C 110 82, 120 87, 128 95 C 138 105, 145 117, 148 128 C 150 135, 151 138, 155 135 Z"
                opacity="0.85"
              />
              
              {/* Moon magatama - body at bottom-left (Moon position), tail curves toward top (Sun position) */}
              <path 
                d="M 45 135 C 38 130, 35 122, 35 113 C 35 105, 38 98, 45 93 C 52 88, 60 87, 68 88 C 78 90, 85 95, 90 103 C 95 110, 98 118, 105 122 C 112 126, 120 126, 127 123 C 132 121, 135 117, 136 112 C 138 105, 135 98, 130 93 C 122 85, 112 82, 102 82 C 90 82, 80 87, 72 95 C 62 105, 55 117, 52 128 C 50 135, 49 138, 45 135 Z"
                transform="scale(-1, 1) translate(-200, 0)"
                opacity="0.85"
              />
              
              {/* Central circle - smaller */}
              <circle cx="100" cy="100" r="12" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
            </g>
          </svg>

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
