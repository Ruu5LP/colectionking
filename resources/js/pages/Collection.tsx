import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { UserCard } from '../types';
import { useApi } from '../hooks/useApi';
import CardGrid from '../components/CardGrid';

const Collection: React.FC = () => {
  const { data: cards, loading, error } = useApi<UserCard[]>('/api/user/cards');
  
  const [rarityFilter, setRarityFilter] = useState<number | 'ALL'>('ALL');

  const filteredCards = useMemo(() => {
    if (!cards) return [];
    
    return cards.filter(card => {
      if (rarityFilter !== 'ALL' && card.rarity !== rarityFilter) return false;
      return true;
    });
  }, [cards, rarityFilter]);

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
            <div className="mb-4 flex items-center gap-4">
              <div className="text-gray-600">
                {filteredCards.length}枚のカード
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">レアリティ:</label>
                <select 
                  value={rarityFilter} 
                  onChange={(e) => setRarityFilter(e.target.value === 'ALL' ? 'ALL' : parseInt(e.target.value))}
                  className="px-3 py-1 border border-gray-300 rounded-lg"
                >
                  <option value="ALL">すべて</option>
                  {[1, 2, 3, 4, 5, 6].map(r => (
                    <option key={r} value={r}>★{r}</option>
                  ))}
                </select>
              </div>
            </div>

            {filteredCards.length > 0 ? (
              <CardGrid cards={filteredCards} showQuantity={true} />
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
