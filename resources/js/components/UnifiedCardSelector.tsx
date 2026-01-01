import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardKind, Element } from '../types';

interface UnifiedCardSelectorProps {
  availableCards: Card[];
  selectedLeaderCardId: string | null;
  selectedCardIds: string[];
  onLeaderSelect: (card: Card) => void;
  onLeaderDeselect: () => void;
  onCardSelect: (card: Card) => void;
  maxCards: number;
}

type SelectionMode = 'leader' | 'deck';
type SortField = 'hp' | 'atk' | 'def' | 'name' | 'kind';
type SortOrder = 'asc' | 'desc';

const UnifiedCardSelector: React.FC<UnifiedCardSelectorProps> = ({
  availableCards,
  selectedLeaderCardId,
  selectedCardIds,
  onLeaderSelect,
  onLeaderDeselect,
  onCardSelect,
  maxCards,
}) => {
  // Mode state - default to 'leader' if no leader selected
  const [mode, setMode] = useState<SelectionMode>(selectedLeaderCardId ? 'deck' : 'leader');
  
  // Update mode when leader is selected/deselected
  useEffect(() => {
    if (!selectedLeaderCardId && mode === 'deck') {
      setMode('leader');
    }
  }, [selectedLeaderCardId, mode]);
  
  // Filter and sort state
  const [searchTerm, setSearchTerm] = useState('');
  const [kindFilter, setKindFilter] = useState<CardKind | 'ALL'>('ALL');
  const [elementFilter, setElementFilter] = useState<Element | 'ALL'>('ALL');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 15; // 5 columns × 3 rows
  
  // Reset page to 1 when filters/search/sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, kindFilter, elementFilter, sortField, sortOrder]);
  
  // Get selected cards for display
  const selectedCards = availableCards.filter(card => selectedCardIds.includes(card.id));
  const leaderCard = availableCards.find(card => card.id === selectedLeaderCardId);
  
  // Filter and sort cards
  const filteredAndSortedCards = useMemo(() => {
    let cards = [...availableCards];
    
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
  }, [availableCards, searchTerm, kindFilter, elementFilter, sortField, sortOrder]);
  
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
  
  const handleCardClick = (card: Card) => {
    if (mode === 'leader') {
      // Leader mode: set as leader (remove from deck if present)
      if (selectedCardIds.includes(card.id)) {
        onCardSelect(card); // Remove from deck first
      }
      onLeaderSelect(card);
    } else {
      // Deck mode: add/remove from deck (only if not leader)
      if (card.id !== selectedLeaderCardId) {
        onCardSelect(card);
      }
    }
  };
  
  const getElementColor = (element: string | null) => {
    switch (element) {
      case 'FIRE': return 'border-red-500 bg-red-50';
      case 'WIND': return 'border-green-500 bg-green-50';
      case 'WATER': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-300 bg-white';
    }
  };
  
  const isCardLeader = (cardId: string) => cardId === selectedLeaderCardId;
  const isCardInDeck = (cardId: string) => selectedCardIds.includes(cardId);
  
  return (
    <div>
      {/* Fixed Header Area: Leader + Deck Slots */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Leader Slot */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span>👑</span>
              <span>リーダー</span>
            </h3>
            {leaderCard ? (
              <div 
                onClick={onLeaderDeselect}
                className="border-2 border-yellow-500 bg-yellow-50 rounded-lg p-4 cursor-pointer hover:shadow-lg transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-bold text-base mb-2">{leaderCard.name}</div>
                    <div className="text-sm space-y-1">
                      <div className="text-green-600 font-semibold">HP: {leaderCard.hp}</div>
                      <div className="text-red-600">ATK: {leaderCard.atk}</div>
                      <div className="text-blue-600">DEF: {leaderCard.def}</div>
                      {leaderCard.element && (
                        <div className="text-xs font-semibold text-gray-700">{leaderCard.element}</div>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onLeaderDeselect();
                    }}
                    className="text-red-500 hover:text-red-700 font-bold text-xl"
                  >
                    ×
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-400">
                <div className="text-4xl mb-2">👑</div>
                <div className="text-sm">リーダー未選択</div>
              </div>
            )}
          </div>
          
          {/* Deck Slots */}
          <div>
            <h3 className="text-lg font-semibold mb-3">
              デッキ ({selectedCardIds.length}/{maxCards})
            </h3>
            {selectedCardIds.length > 0 ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-h-32 overflow-y-auto">
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
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-400">
                <div className="text-sm">デッキが空です</div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mode Toggle */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center justify-center gap-4">
          <span className="text-sm font-medium text-gray-700">選択モード:</span>
          <div className="inline-flex rounded-lg border border-gray-300">
            <button
              onClick={() => setMode('leader')}
              className={`px-6 py-2 text-sm font-medium rounded-l-lg transition-colors ${
                mode === 'leader'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              👑 リーダーにセット
            </button>
            <button
              onClick={() => setMode('deck')}
              className={`px-6 py-2 text-sm font-medium rounded-r-lg transition-colors ${
                mode === 'deck'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              デッキに追加
            </button>
          </div>
        </div>
      </div>
      
      {/* Card List Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">カード一覧</h3>
        
        {/* Search and Filters */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-3 mb-4">
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-4">
            {currentPageCards.map((card) => {
              const isLeader = isCardLeader(card.id);
              const inDeck = isCardInDeck(card.id);
              const clickable = mode === 'leader' || (mode === 'deck' && !isLeader);
              
              return (
                <div
                  key={card.id}
                  onClick={() => clickable && handleCardClick(card)}
                  className={`
                    border-2 rounded-lg p-4 transition-all relative
                    ${getElementColor(card.element)}
                    ${isLeader ? 'ring-4 ring-yellow-500' : inDeck ? 'ring-4 ring-blue-500' : ''}
                    ${clickable ? 'cursor-pointer hover:shadow-lg' : 'cursor-not-allowed opacity-60'}
                  `}
                >
                  {/* Status Badge */}
                  {isLeader && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                      LEADER
                    </div>
                  )}
                  {!isLeader && inDeck && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                      IN DECK
                    </div>
                  )}
                  
                  <div className="text-sm font-bold mb-2 truncate" title={card.name}>
                    {card.name}
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    <span className={`inline-block px-2 py-1 rounded ${card.kind === 'SPECIAL' ? 'bg-purple-200' : 'bg-gray-200'}`}>
                      {card.kind}
                    </span>
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="text-green-600">HP: {card.hp}</div>
                    <div className="text-red-600">ATK: {card.atk}</div>
                    <div className="text-blue-600">DEF: {card.def}</div>
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
        ) : (
          <div className="text-center py-12 text-gray-500 mb-4">
            カードが見つかりませんでした
          </div>
        )}
        
        {/* Pagination Controls - Centered */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4 border-t">
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
    </div>
  );
};

export default UnifiedCardSelector;
