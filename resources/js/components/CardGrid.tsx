import React from 'react';
import { Card } from '../types';
import ElementBar from './ElementBar';
import { isValidImageUrl } from '../shared/utils';

interface CardGridProps {
  cards: Card[];
  selectedCards?: string[];
  onCardClick?: (card: Card) => void;
  maxSelection?: number;
}

const CardGrid: React.FC<CardGridProps> = ({ cards, selectedCards = [], onCardClick, maxSelection }) => {
  const isSelected = (cardId: string) => selectedCards.includes(cardId);
  const canSelect = !maxSelection || selectedCards.length < maxSelection;

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
              border-2 rounded-lg p-4 transition-all bg-white
              ${selected ? 'ring-4 ring-blue-500 scale-105 border-blue-500' : 'border-gray-300'}
              ${clickable ? 'cursor-pointer hover:shadow-lg hover:border-blue-400' : 'cursor-default'}
            `}
          >
            <div className="text-sm font-bold mb-3 truncate" title={card.name}>
              {card.name}
            </div>
            
            <div className="flex flex-col items-center">
              {isValidImageUrl(card.image_url) ? (
                <img 
                  src={card.image_url!} 
                  alt={card.name}
                  className="w-full aspect-[249/380] object-cover rounded mb-3"
                />
              ) : (
                <div className="w-full aspect-[249/380] bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs mb-3">
                  画像なし
                </div>
              )}
              
              <div className="w-full">
                <div className="space-y-1 text-sm mb-2">
                  <div className="text-green-600">HP: {card.hp}</div>
                  <div className="text-red-600">ATK: {card.atk}</div>
                  <div className="text-blue-600">DEF: {card.def}</div>
                </div>
                
                <div className="mt-2">
                  <ElementBar elements={card.elements} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CardGrid;
