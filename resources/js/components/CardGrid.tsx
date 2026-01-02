import React from 'react';
import { Card, UserCard } from '../types';
import ElementBar from './ElementBar';
import RarityDisplay from './RarityDisplay';

interface CardGridProps {
  cards: (Card | UserCard)[];
  selectedCards?: string[];
  onCardClick?: (card: Card | UserCard) => void;
  maxSelection?: number;
  showQuantity?: boolean;
}

const CardGrid: React.FC<CardGridProps> = ({ cards, selectedCards = [], onCardClick, maxSelection, showQuantity = false }) => {
  const isSelected = (cardId: string) => selectedCards.includes(cardId);
  const canSelect = !maxSelection || selectedCards.length < maxSelection;
  const getTimesUsed = (cardId: string) => selectedCards.filter(id => id === cardId).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {cards.map((card) => {
        const selected = isSelected(card.id);
        const quantity = 'quantity' in card ? card.quantity : undefined;
        const timesUsed = getTimesUsed(card.id);
        
        // Determine if card can be added or will be removed
        const canAdd = quantity !== undefined ? (timesUsed < quantity && canSelect) : canSelect;
        const willRemove = timesUsed > 0 && !canAdd;
        const clickable = onCardClick && (canAdd || willRemove);
        
        return (
          <div
            key={card.id}
            onClick={() => clickable && onCardClick(card)}
            className={`
              border-2 rounded-lg p-4 transition-all bg-white relative
              ${selected ? 'ring-4 ring-blue-500 scale-105 border-blue-500' : 'border-gray-300'}
              ${clickable ? 'cursor-pointer hover:shadow-lg hover:border-blue-400' : 'cursor-default'}
            `}
          >
            {showQuantity && quantity !== undefined && (
              <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                ×{quantity}
              </div>
            )}
            
            {!showQuantity && quantity !== undefined && timesUsed > 0 && (
              <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {timesUsed}/{quantity}
              </div>
            )}
            
            {/* Add/Remove indicator */}
            {!showQuantity && clickable && (
              <div className={`absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded-full ${
                canAdd ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}>
                {canAdd ? '+追加' : '−削除'}
              </div>
            )}
            
            <div className="text-sm font-bold mb-2 truncate" title={card.name}>
              {card.name}
            </div>
            
            <RarityDisplay rarity={card.rarity} className="mb-2" />
            
            <div className="flex items-center justify-between text-sm mb-3">
              <div className="text-left space-y-1">
                <div className="text-green-600">HP: {card.hp}</div>
                <div className="text-red-600">ATK: {card.atk}</div>
                <div className="text-blue-600">DEF: {card.def}</div>
              </div>
            </div>
            
            <div className="mt-2">
              <ElementBar elements={card.elements} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CardGrid;
