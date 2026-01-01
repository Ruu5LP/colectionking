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
      jankenHand: 'STAR' as JankenHand,
      icon: '⭐',
      label: '星',
      bgColor: 'bg-emerald-50',
      ringColor: 'ring-emerald-300',
      textColor: 'text-emerald-700',
      position: 'bottom-4 left-4', // Bottom left
    },
    {
      jankenHand: 'MOON' as JankenHand,
      icon: '🌙',
      label: '月',
      bgColor: 'bg-blue-50',
      ringColor: 'ring-blue-300',
      textColor: 'text-blue-600',
      position: 'bottom-4 right-4', // Bottom right
    },
  ];

  return (
    <div className="flex justify-center items-center py-6">
      <div className="relative w-80 h-80 sm:w-[360px] sm:h-[360px]">
        {/* Background plate with rune pattern */}
        <div className="absolute inset-0 bg-gray-200 rounded-full shadow-inner flex items-center justify-center overflow-hidden">
          {/* Triquetra-like rune pattern (SVG) */}
          <svg
            className="absolute inset-0 w-full h-full opacity-25"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Three interlocking curves forming a triquetra pattern */}
            <g fill="none" stroke="currentColor" strokeWidth="3" className="text-gray-500">
              {/* Top curve */}
              <path d="M 100 40 Q 60 60, 80 90 Q 100 110, 120 90 Q 140 60, 100 40 Z" />
              {/* Bottom left curve */}
              <path d="M 60 140 Q 40 100, 70 80 Q 90 70, 100 90 Q 90 120, 60 140 Z" />
              {/* Bottom right curve */}
              <path d="M 140 140 Q 160 100, 130 80 Q 110 70, 100 90 Q 110 120, 140 140 Z" />
              {/* Central circle */}
              <circle cx="100" cy="95" r="15" strokeWidth="2" />
              {/* Connecting arcs */}
              <path d="M 100 40 Q 70 50, 70 80" strokeWidth="2" />
              <path d="M 100 40 Q 130 50, 130 80" strokeWidth="2" />
              <path d="M 60 140 Q 80 120, 100 110" strokeWidth="2" />
              <path d="M 140 140 Q 120 120, 100 110" strokeWidth="2" />
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
