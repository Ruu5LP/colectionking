import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardKind, Element } from '../types';
import CardGrid from './CardGrid';

interface DeckSelectorProps {
  availableCards: Card[];
  selectedCardIds: string[];
  selectedLeaderCardId?: string | null;
  onCardSelect: (card: Card) => void;
  maxCards: number;
}

type SortField = 'hp' | 'atk' | 'def' | 'name' | 'kind';
type SortOrder = 'asc' | 'desc';

const DeckSelector: React.FC<DeckSelectorProps> = ({
  availableCards,
  selectedCardIds,
  selectedLeaderCardId = null,
  onCardSelect,
  maxCards,
}) => {
  const selectedCards = availableCards.filter(card => selectedCardIds.includes(card.id));
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 15; // 5 columns × 3 rows
  
  // Filter and sort state
  const [searchTerm, setSearchTerm] = useState('');
  const [kindFilter, setKindFilter] = useState<CardKind | 'ALL'>('ALL');
  const [elementFilter, setElementFilter] = useState<Element | 'ALL'>('ALL');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  
  // Reset page to 1 when filters/search/sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, kindFilter, elementFilter, sortField, sortOrder]);
  
  // Filter and sort cards
  const filteredAndSortedCards = useMemo(() => {
    // Exclude leader card from available cards
    let cards = availableCards.filter(card => card.id !== selectedLeaderCardId);
    
    // Apply search filter
    if (searchTerm) {
      cards = cards.filter(card => 
        card.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply kind filter
    if (kindFilter !== 'ALL') {
      cards = cards.filter(card => card.kind === kindFilter);
    }
    
    // Apply element filter
    if (elementFilter !== 'ALL') {
      cards = cards.filter(card => card.element === elementFilter);
    }
    
    // Apply sorting
    cards.sort((a, b) => {
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
    
    return cards;
  }, [availableCards, selectedLeaderCardId, searchTerm, kindFilter, elementFilter, sortField, sortOrder]);
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedCards.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const currentPageCards = filteredAndSortedCards.slice(startIndex, endIndex);
  
  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };
  
  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };
  
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };
  
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

      {/* Available Cards Section with Filters */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">利用可能なカード</h3>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                前へ
              </button>
              <span className="text-sm text-gray-600">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                次へ
              </button>
            </div>
          )}
        </div>
        
        {/* Search and Filters */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              カード名で検索
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="カード名を入力..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Kind Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                種類
              </label>
              <select
                value={kindFilter}
                onChange={(e) => setKindFilter(e.target.value as CardKind | 'ALL')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">すべて</option>
                <option value="NORMAL">NORMAL</option>
                <option value="SPECIAL">SPECIAL</option>
              </select>
            </div>
            
            {/* Element Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                属性
              </label>
              <select
                value={elementFilter === null ? 'NULL' : elementFilter}
                onChange={(e) => {
                  const value = e.target.value;
                  setElementFilter(value === 'ALL' ? 'ALL' : value === 'NULL' ? null : value as Element);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">すべて</option>
                <option value="FIRE">FIRE</option>
                <option value="WIND">WIND</option>
                <option value="WATER">WATER</option>
                <option value="NULL">なし</option>
              </select>
            </div>
            
            {/* Sort Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                並び替え
              </label>
              <div className="flex gap-2">
                <select
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value as SortField)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="name">名前</option>
                  <option value="hp">HP</option>
                  <option value="atk">ATK</option>
                  <option value="def">DEF</option>
                  <option value="kind">種類</option>
                </select>
                <button
                  onClick={toggleSortOrder}
                  className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                  title={sortOrder === 'asc' ? '昇順' : '降順'}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
          </div>
          
          {/* Results count */}
          <div className="text-sm text-gray-600">
            {filteredAndSortedCards.length}枚のカードが見つかりました
          </div>
        </div>
        
        {/* Card Grid */}
        {currentPageCards.length > 0 ? (
          <CardGrid
            cards={currentPageCards}
            selectedCards={selectedCardIds}
            onCardClick={onCardSelect}
            maxSelection={maxCards}
          />
        ) : (
          <div className="text-center py-12 text-gray-500">
            カードが見つかりませんでした
          </div>
        )}
      </div>
    </div>
  );
};

export default DeckSelector;
