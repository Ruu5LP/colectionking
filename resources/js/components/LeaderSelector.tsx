import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardKind, Element } from '../types';

interface LeaderSelectorProps {
  cards: Card[];
  selectedLeaderCardId: string | null;
  onSelect: (card: Card) => void;
  searchTerm?: string;
  kindFilter?: CardKind | 'ALL';
  elementFilter?: Element | 'ALL';
  sortField?: 'hp' | 'atk' | 'def' | 'name' | 'kind';
  sortOrder?: 'asc' | 'desc';
}

const LeaderSelector: React.FC<LeaderSelectorProps> = ({ 
  cards, 
  selectedLeaderCardId, 
  onSelect,
  searchTerm = '',
  kindFilter = 'ALL',
  elementFilter = 'ALL',
  sortField = 'name',
  sortOrder = 'asc',
}) => {
  // Pagination state (independent from deck selector)
  const [leaderPage, setLeaderPage] = useState(1);
  const cardsPerPage = 15; // 5 columns × 3 rows
  
  // Reset page to 1 when filters/search/sort change
  useEffect(() => {
    setLeaderPage(1);
  }, [searchTerm, kindFilter, elementFilter, sortField, sortOrder]);
  
  // Filter and sort cards
  const filteredAndSortedCards = useMemo(() => {
    let filteredCards = [...cards];
    
    // Apply search filter
    if (searchTerm) {
      filteredCards = filteredCards.filter(card => 
        card.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply kind filter
    if (kindFilter !== 'ALL') {
      filteredCards = filteredCards.filter(card => card.kind === kindFilter);
    }
    
    // Apply element filter
    if (elementFilter !== 'ALL') {
      filteredCards = filteredCards.filter(card => card.element === elementFilter);
    }
    
    // Apply sorting
    filteredCards.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'hp':
          comparison = a.hp - b.hp;
          break;
        case 'atk':
          comparison = a.atk - b.atk;
          break;
        case 'def':
          comparison = a.def - b.def;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'kind':
          comparison = a.kind.localeCompare(b.kind);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return filteredCards;
  }, [cards, searchTerm, kindFilter, elementFilter, sortField, sortOrder]);
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedCards.length / cardsPerPage);
  const startIndex = (leaderPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const pagedLeaderCards = filteredAndSortedCards.slice(startIndex, endIndex);
  
  const handlePreviousPage = () => {
    setLeaderPage(prev => Math.max(1, prev - 1));
  };
  
  const handleNextPage = () => {
    setLeaderPage(prev => Math.min(totalPages, prev + 1));
  };
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">リーダーを選択（リーダーとして使用するカードを選択）</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {pagedLeaderCards.map((card) => (
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
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={handlePreviousPage}
            disabled={leaderPage === 1}
            className={`px-3 py-1 rounded ${
              leaderPage === 1 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            前へ
          </button>
          <span className="text-sm text-gray-600">
            {leaderPage} / {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={leaderPage === totalPages}
            className={`px-3 py-1 rounded ${
              leaderPage === totalPages 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            次へ
          </button>
        </div>
      )}
    </div>
  );
};

export default LeaderSelector;
