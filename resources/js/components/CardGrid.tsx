import React from 'react';
import { Card } from '../types';

interface CardGridProps {
  cards: Card[];
  selectedCards?: string[];
  onCardClick?: (card: Card) => void;
  maxSelection?: number;
}

const CardGrid: React.FC<CardGridProps> = ({ cards, selectedCards = [], onCardClick, maxSelection }) => {
  const isSelected = (cardId: string) => selectedCards.includes(cardId);
  const canSelect = !maxSelection || selectedCards.length < maxSelection;

  const getElementColor = (element: string | null) => {
    switch (element) {
      case 'FIRE': return 'border-red-500 bg-red-50';
      case 'WIND': return 'border-green-500 bg-green-50';
      case 'WATER': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-300 bg-white';
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {cards.map((card) => {
        const selected = isSelected(card.id);
        const clickable = onCardClick && (canSelect || selected);
        
        return (
          <div
            key={card.id}
            onClick={() => clickable && onCardClick(card)}
            className={`
              border-2 rounded-lg p-4 transition-all
              ${getElementColor(card.element)}
              ${selected ? 'ring-4 ring-blue-500 scale-105' : ''}
              ${clickable ? 'cursor-pointer hover:shadow-lg' : 'cursor-default'}
            `}
          >
            <div className="text-sm font-bold mb-2 truncate" title={card.name}>
              {card.name}
            </div>
            <div className="text-xs text-gray-600 mb-2">
              <span className={`inline-block px-2 py-1 rounded ${card.kind === 'SPECIAL' ? 'bg-purple-200' : 'bg-gray-200'}`}>
                {card.kind}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="text-left">
                <div className="text-red-600">ATK: {card.atk}</div>
                <div className="text-blue-600">DEF: {card.def}</div>
              </div>
            </div>
            {card.element && (
              <div className="mt-2 text-xs text-center font-semibold">
                {card.element}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CardGrid;
