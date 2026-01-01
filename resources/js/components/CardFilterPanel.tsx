import React from 'react';
import { CardKind, Hand, Element } from '../types';

interface CardFilterPanelProps {
  kindFilter: CardKind | 'ALL';
  handFilter: Hand | 'ALL';
  elementFilter: Element | 'ALL';
  onKindChange: (kind: CardKind | 'ALL') => void;
  onHandChange: (hand: Hand | 'ALL') => void;
  onElementChange: (element: Element | 'ALL') => void;
}

const CardFilterPanel: React.FC<CardFilterPanelProps> = ({
  kindFilter,
  handFilter,
  elementFilter,
  onKindChange,
  onHandChange,
  onElementChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <h3 className="text-lg font-semibold mb-4">フィルター</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            種類 (Kind)
          </label>
          <select
            value={kindFilter}
            onChange={(e) => onKindChange(e.target.value as CardKind | 'ALL')}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="ALL">すべて</option>
            <option value="NORMAL">NORMAL</option>
            <option value="SPECIAL">SPECIAL</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            手 (Hand)
          </label>
          <select
            value={handFilter}
            onChange={(e) => onHandChange(e.target.value as Hand | 'ALL')}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="ALL">すべて</option>
            <option value="ROCK">✊ ROCK</option>
            <option value="SCISSORS">✌️ SCISSORS</option>
            <option value="PAPER">✋ PAPER</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            属性 (Element)
          </label>
          <select
            value={elementFilter || 'ALL'}
            onChange={(e) => {
              const value = e.target.value;
              onElementChange(value === 'ALL' ? 'ALL' : value as Element);
            }}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="ALL">すべて</option>
            <option value="FIRE">🔥 FIRE</option>
            <option value="WIND">💨 WIND</option>
            <option value="WATER">💧 WATER</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default CardFilterPanel;
