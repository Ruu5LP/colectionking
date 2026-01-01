import React from 'react';
import type { Element, ElementValues, UserElementValues } from '../types';

interface ElementBarProps {
  elements: {
    [K in Element]: ElementValues | UserElementValues;
  };
  showCurrent?: boolean;
}

const ElementBar: React.FC<ElementBarProps> = ({ elements, showCurrent = false }) => {
  const elementOrder: Element[] = ['fire', 'water', 'wind', 'earth', 'mech'];
  
  const elementColors: Record<Element, { bg: string; text: string }> = {
    fire: { bg: 'bg-red-200', text: 'text-red-700' },
    water: { bg: 'bg-blue-200', text: 'text-blue-700' },
    wind: { bg: 'bg-green-200', text: 'text-green-700' },
    earth: { bg: 'bg-yellow-200', text: 'text-yellow-700' },
    mech: { bg: 'bg-orange-200', text: 'text-orange-700' },
  };

  const elementLabels: Record<Element, string> = {
    fire: '火',
    water: '水',
    wind: '風',
    earth: '土',
    mech: '機',
  };

  const hasCurrentValue = (el: ElementValues | UserElementValues): el is UserElementValues => {
    return 'current' in el;
  };

  return (
    <div className="space-y-1">
      {elementOrder.map((element) => {
        const elementValue = elements[element];
        const current = hasCurrentValue(elementValue) ? elementValue.current : elementValue.base;
        const cap = elementValue.cap;
        const percentage = cap > 0 ? (current / cap) * 100 : 0;

        // Only show bars where cap > 0
        if (cap === 0 && current === 0) {
          return null;
        }

        return (
          <div key={element} className="flex items-center gap-2 text-xs">
            <span className={`w-4 ${elementColors[element].text} font-semibold`}>
              {elementLabels[element]}
            </span>
            <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full ${elementColors[element].bg} transition-all duration-300`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="w-10 text-right text-gray-600">
              {current}/{cap}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default ElementBar;
