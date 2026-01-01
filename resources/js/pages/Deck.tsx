import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Leader, Deck as DeckType } from '../types';
import { useApi, apiPost } from '../hooks/useApi';
import { useUserId } from '../hooks/useUserId';
import LeaderSelector from '../components/LeaderSelector';
import DeckSelector from '../components/DeckSelector';

const Deck: React.FC = () => {
  const navigate = useNavigate();
  const userId = useUserId();

  const { data: leaders, loading: leadersLoading } = useApi<Leader[]>('/api/leaders');
  const { data: cards, loading: cardsLoading } = useApi<Card[]>('/api/cards');
  const { data: existingDeck } = useApi<DeckType | null>(`/api/decks/${userId}`);

  const [selectedLeaderId, setSelectedLeaderId] = useState<string | null>(null);
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const MAX_CARDS = 10;

  // Load existing deck
  useEffect(() => {
    if (existingDeck) {
      setSelectedLeaderId(existingDeck.leader_id);
      setSelectedCardIds(existingDeck.cards_json);
    }
  }, [existingDeck]);

  const handleLeaderSelect = (leader: Leader) => {
    setSelectedLeaderId(leader.id);
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
    if (!selectedLeaderId) {
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
        leaderId: selectedLeaderId,
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

  const isLoading = leadersLoading || cardsLoading;
  const canSave = selectedLeaderId && selectedCardIds.length === MAX_CARDS && !saving;

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

        {!isLoading && leaders && cards && (
          <>
            {/* Leader Selection */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <LeaderSelector
                leaders={leaders}
                selectedLeaderId={selectedLeaderId}
                onSelect={handleLeaderSelect}
              />
            </div>

            {/* Card Selection */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <DeckSelector
                availableCards={cards}
                selectedCardIds={selectedCardIds}
                onCardSelect={handleCardSelect}
                maxCards={MAX_CARDS}
              />
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
