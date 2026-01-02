import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Deck as DeckType } from '../types';
import { useApi, apiPost } from '../hooks/useApi';
import { useUserId } from '../hooks/useUserId';
import CardGrid from '../components/CardGrid';
import ElementBar from '../components/ElementBar';

// Helper function to validate image URL
const isValidImageUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;
  try {
    const urlObj = new URL(url, window.location.origin);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

const Deck: React.FC = () => {
  const navigate = useNavigate();
  const userId = useUserId();
  
  const { data: cards, loading: cardsLoading } = useApi<Card[]>('/api/cards');
  const { data: existingDeck } = useApi<DeckType | null>(`/api/decks/${userId}`);
  
  const [selectedLeaderCardId, setSelectedLeaderCardId] = useState<string | null>(null);
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [mode, setMode] = useState<'leader' | 'deck'>('leader');
  const [searchTerm, setSearchTerm] = useState('');

  const MAX_CARDS = 10;

  // Load existing deck
  useEffect(() => {
    if (existingDeck) {
      setSelectedLeaderCardId(existingDeck.leader_card_id);
      setSelectedCardIds(Array.isArray(existingDeck.cards_json) ? existingDeck.cards_json : []);
      if (existingDeck.leader_card_id) {
        setMode('deck');
      }
    }
  }, [existingDeck]);

  const handleLeaderSelect = (card: Card) => {
    setSelectedLeaderCardId(card.id);
    setMode('deck');
    setSuccess(false);
  };

  const handleCardSelect = (card: Card) => {
    setSuccess(false);
    if (selectedCardIds.includes(card.id)) {
      // Remove card if already selected
      setSelectedCardIds(prev => prev.filter(id => id !== card.id));
    } else if (selectedCardIds.length < MAX_CARDS) {
      // Add card if under limit
      setSelectedCardIds(prev => [...prev, card.id]);
    }
  };

  const handleSave = async () => {
    if (!selectedLeaderCardId) {
      setError('リーダーを選択してください');
      return;
    }
    
    if (selectedCardIds.length !== MAX_CARDS) {
      setError(`カードを${MAX_CARDS}枚選択してください（現在: ${selectedCardIds.length}枚）`);
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      await apiPost(`/api/decks/${userId}`, {
        leaderCardId: selectedLeaderCardId,
        cards: selectedCardIds,
      });
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('デッキの保存に失敗しました');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const isLoading = cardsLoading;
  const canSave = selectedLeaderCardId && selectedCardIds.length === MAX_CARDS && !saving;
  
  const leaderCard = cards?.find(c => c.id === selectedLeaderCardId);
  const selectedCards = cards?.filter(c => selectedCardIds.includes(c.id)) || [];
  
  // Filter cards based on search term
  const filteredCards = cards?.filter(card => 
    card.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-900">デッキビルダー</h1>
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
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">読み込み中...</p>
          </div>
        )}

        {!isLoading && cards && (
          <>
            {/* Mode Selector */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex gap-4">
                <button
                  onClick={() => setMode('leader')}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    mode === 'leader' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  リーダー選択
                </button>
                <button
                  onClick={() => setMode('deck')}
                  disabled={!selectedLeaderCardId}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    mode === 'deck' && selectedLeaderCardId
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  デッキ選択 ({selectedCardIds.length}/{MAX_CARDS})
                </button>
              </div>
            </div>

            {/* Selected Leader and Deck Display - Side by Side */}
            {leaderCard && (
              <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Leader Card Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">選択中のリーダー</h3>
                    <div className="border-2 rounded-lg p-3 transition-all bg-white border-blue-500 ring-2 ring-blue-500">
                      <div className="text-sm font-bold mb-2 truncate" title={leaderCard.name}>
                        {leaderCard.name}
                      </div>
                      
                      {isValidImageUrl(leaderCard.image_url) ? (
                        <img 
                          src={leaderCard.image_url!} 
                          alt={leaderCard.name}
                          className="w-[249px] h-[380px] object-cover rounded mb-2 mx-auto"
                        />
                      ) : (
                        <div className="w-[249px] h-[380px] bg-gray-200 rounded mb-2 flex items-center justify-center text-gray-400 text-sm mx-auto">
                          画像なし
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-xs mb-2">
                        <div className="text-left space-y-1">
                          <div className="text-green-600">HP: {leaderCard.hp}</div>
                          <div className="text-red-600">ATK: {leaderCard.atk}</div>
                          <div className="text-blue-600">DEF: {leaderCard.def}</div>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <ElementBar elements={leaderCard.elements} />
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedLeaderCardId(null);
                        setMode('leader');
                      }}
                      className="mt-2 text-red-500 hover:text-red-700 underline text-sm"
                    >
                      リーダーを変更
                    </button>
                  </div>
                  
                  {/* Selected Deck Cards Section */}
                  <div className="lg:col-span-2">
                    <h3 className="text-lg font-semibold mb-3">
                      選択中のデッキ ({selectedCards.length}/{MAX_CARDS})
                    </h3>
                    {selectedCards.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                        {selectedCards.map((card) => (
                          <div
                            key={card.id}
                            className="border-2 rounded-lg p-2 transition-all bg-white border-green-500 ring-1 ring-green-500"
                          >
                            <div className="text-xs font-bold mb-1 truncate" title={card.name}>
                              {card.name}
                            </div>
                            {isValidImageUrl(card.image_url) ? (
                              <img 
                                src={card.image_url!} 
                                alt={card.name}
                                className="w-[249px] h-[380px] object-cover rounded mb-1 mx-auto"
                              />
                            ) : (
                              <div className="w-[249px] h-[380px] bg-gray-200 rounded mb-1 flex items-center justify-center text-gray-400 text-sm mx-auto">
                                画像なし
                              </div>
                            )}
                            <div className="text-xs space-y-0.5">
                              <div className="text-green-600">HP: {card.hp}</div>
                              <div className="text-red-600">ATK: {card.atk}</div>
                              <div className="text-blue-600">DEF: {card.def}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500 text-sm py-8 text-center border-2 border-dashed border-gray-300 rounded-lg">
                        デッキカードを選択してください
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Card Selection Area */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {mode === 'leader' ? 'リーダーを選択' : 'デッキカードを選択'}
                </h3>
                {/* Search Box */}
                <div className="w-64">
                  <input
                    type="text"
                    placeholder="カード名で検索..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              {filteredCards.length > 0 ? (
                <CardGrid
                  cards={filteredCards}
                  selectedCards={mode === 'leader' ? (selectedLeaderCardId ? [selectedLeaderCardId] : []) : selectedCardIds}
                  onCardClick={mode === 'leader' ? handleLeaderSelect : handleCardSelect}
                  maxSelection={mode === 'leader' ? 1 : MAX_CARDS}
                />
              ) : (
                <div className="text-center py-12 text-gray-500">
                  検索条件に一致するカードがありません
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-green-700">
                デッキを保存しました！
              </div>
            )}

            {/* Save Button */}
            <div className="bg-white rounded-lg shadow p-6">
              <button
                onClick={handleSave}
                disabled={!canSave}
                className={`
                  w-full py-3 px-6 rounded-lg font-bold text-white text-lg transition-colors
                  ${canSave 
                    ? 'bg-blue-500 hover:bg-blue-600 cursor-pointer' 
                    : 'bg-gray-300 cursor-not-allowed'
                  }
                `}
              >
                {saving ? '保存中...' : 'デッキを保存'}
              </button>
              
              <div className="mt-4 text-center">
                <button
                  onClick={() => navigate('/battle')}
                  className="text-blue-500 hover:text-blue-700 underline"
                >
                  バトルへ進む
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Deck;
