import React from 'react';
import { Card } from '../types';
import CardGrid from './CardGrid';

interface DeckSelectorProps {
  availableCards: Card[];
  selectedCardIds?: string[];
  onCardSelect: (card: Card) => void;
  maxCards: number;
}

const DeckSelector: React.FC<DeckSelectorProps> = ({
  availableCards,
  selectedCardIds = [],
  onCardSelect,
  maxCards,
}) => {
  const selectedCards = availableCards.filter(card => selectedCardIds?.includes(card.id));
  
  return (
    <div className="mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">
          選択中のカード ({selectedCardIds.length}/{maxCards})
        </h3>
        {selectedCardIds.length > 0 && (
          <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex flex-wrap gap-2">
              {selectedCards.map((card) => (
                <div
                  key={card.id}
                  className="bg-white border border-gray-300 rounded px-3 py-1 text-sm flex items-center gap-2"
                >
                  <span className="truncate max-w-[120px]" title={card.name}>
                    {card.name}
                  </span>
                  <button
                    onClick={() => onCardSelect(card)}
                    className="text-red-500 hover:text-red-700 font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <h3 className="text-lg font-semibold mb-4">利用可能なカード</h3>
      <CardGrid
        cards={availableCards}
        selectedCards={selectedCardIds}
        onCardClick={onCardSelect}
        maxSelection={maxCards}
      />
    </div>
  );
};

export default DeckSelector;
