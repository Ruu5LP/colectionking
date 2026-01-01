import React from 'react';
import { Card } from '../types';

interface LeaderSelectorProps {
  cards: Card[];
  selectedLeaderCardId: string | null;
  onSelect: (card: Card) => void;
}

const LeaderSelector: React.FC<LeaderSelectorProps> = ({ cards, selectedLeaderCardId, onSelect }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">リーダーを選択（リーダーとして使用するカードを選択）</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => onSelect(card)}
            className={`
              border-2 rounded-lg p-4 cursor-pointer transition-all
              ${selectedLeaderCardId === card.id 
                ? 'border-blue-500 bg-blue-50 ring-4 ring-blue-300 scale-105' 
                : 'border-gray-300 bg-white hover:border-blue-300 hover:shadow-md'
              }
            `}
          >
            <div className="text-sm font-bold mb-2 truncate" title={card.name}>
              {card.name}
            </div>
            <div className="flex items-center justify-center">
              <span className="text-3xl">👑</span>
            </div>
            <div className="text-center mt-2">
              <div className="text-green-600 font-semibold">HP: {card.hp}</div>
              <div className="text-xs text-gray-500 mt-1">
                ATK: {card.atk} / DEF: {card.def}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderSelector;
