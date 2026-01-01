import React from 'react';

interface RarityDisplayProps {
  rarity: number; // 1-6
  className?: string;
}

const RarityDisplay: React.FC<RarityDisplayProps> = ({ rarity, className = '' }) => {
  const clampedRarity = Math.max(1, Math.min(6, rarity));
  
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {Array.from({ length: 6 }, (_, i) => (
        <span 
          key={i} 
          className={`text-sm ${i < clampedRarity ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default RarityDisplay;
