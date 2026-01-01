import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardKind, Hand, Element } from '../types';
import { useApi } from '../hooks/useApi';
import CardGrid from '../components/CardGrid';
import CardFilterPanel from '../components/CardFilterPanel';

const Collection: React.FC = () => {
  const { data: cards, loading, error } = useApi<Card[]>('/api/cards');
  
  const [kindFilter, setKindFilter] = useState<CardKind | 'ALL'>('ALL');
  const [handFilter, setHandFilter] = useState<Hand | 'ALL'>('ALL');
  const [elementFilter, setElementFilter] = useState<Element | 'ALL'>('ALL');

  const filteredCards = useMemo(() => {
    if (!cards) return [];
    
    return cards.filter(card => {
      if (kindFilter !== 'ALL' && card.kind !== kindFilter) return false;
      if (handFilter !== 'ALL' && card.hand !== handFilter) return false;
      if (elementFilter !== 'ALL' && card.element !== elementFilter) return false;
      return true;
    });
  }, [cards, kindFilter, handFilter, elementFilter]);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-900">コレクション</h1>
            <Link
              to="/"
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              メニューへ戻る
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">読み込み中...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            エラーが発生しました: {error.message}
          </div>
        )}

        {!loading && !error && cards && (
          <>
            <CardFilterPanel
              kindFilter={kindFilter}
              handFilter={handFilter}
              elementFilter={elementFilter}
              onKindChange={setKindFilter}
              onHandChange={setHandFilter}
              onElementChange={setElementFilter}
            />

            <div className="mb-4 text-gray-600">
              {filteredCards.length}枚のカード
            </div>

            {filteredCards.length > 0 ? (
              <CardGrid cards={filteredCards} />
            ) : (
              <div className="text-center py-12 text-gray-500">
                条件に一致するカードがありません
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Collection;
