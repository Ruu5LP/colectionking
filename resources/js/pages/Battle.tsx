import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Deck as DeckType, BattleState } from '../types';
import { useUserId } from '../hooks/useUserId';
import { apiGet } from '../hooks/useApi';
import BattleUI from '../components/BattleUI';
import { judgeBattle, shuffleDeck, drawCards } from '../shared/rules/battle';

const Battle: React.FC = () => {
  const navigate = useNavigate();
  const userId = useUserId();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playerLeaderCard, setPlayerLeaderCard] = useState<Card | null>(null);
  const [cpuLeaderCard, setCpuLeaderCard] = useState<Card | null>(null);
  const [battleState, setBattleState] = useState<BattleState | null>(null);
  const [battleKey, setBattleKey] = useState(0); // For forcing re-initialization

  // Initialize battle
  useEffect(() => {
    const initBattle = async () => {
      try {
        setLoading(true);
        
        // Fetch player deck
        const deck = await apiGet<DeckType | null>(`/api/decks/${userId}`);
        if (!deck) {
          navigate('/deck');
          return;
        }

        // Fetch all cards
        const allCards = await apiGet<Card[]>('/api/cards');

        // Get player leader card
        const playerLeaderCardData = allCards.find(c => c.id === deck.leader_card_id);
        if (!playerLeaderCardData) {
          setError('リーダーカードが見つかりません');
          return;
        }
        setPlayerLeaderCard(playerLeaderCardData);

        // Get player cards
        const playerCards = allCards.filter(c => deck.cards_json.includes(c.id));
        if (playerCards.length !== 10) {
          setError('デッキが正しくありません');
          return;
        }

        // Setup CPU (random leader card and cards)
        const cpuLeaderCardData = allCards[Math.floor(Math.random() * allCards.length)];
        setCpuLeaderCard(cpuLeaderCardData);

        // Random CPU deck
        const shuffledCards = shuffleDeck(allCards);
        const cpuCards = shuffledCards.slice(0, 10);

        // Initialize battle state
        const playerDeck = shuffleDeck(playerCards);
        const cpuDeck = shuffleDeck(cpuCards);
        
        const playerDrawResult = drawCards(playerDeck, 3);
        const cpuDrawResult = drawCards(cpuDeck, 3);

        setBattleState({
          playerHp: playerLeaderCardData.hp,
          cpuHp: cpuLeaderCardData.hp,
          turn: 1,
          playerHand: playerDrawResult.drawn,
          cpuHand: cpuDrawResult.drawn,
          playerDeck: playerDrawResult.remaining,
          cpuDeck: cpuDrawResult.remaining,
          selectedCard: null,
          selectedHand: null,
          cpuSelectedCard: null,
          cpuSelectedHand: null,
          battleLog: ['バトル開始！'],
          phase: 'SELECT_CARD',
          winner: null,
        });

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('バトルの初期化に失敗しました');
        setLoading(false);
      }
    };

    initBattle();
  }, [userId, navigate, battleKey]);

  const handleCardSelect = (card: Card) => {
    if (!battleState || battleState.phase !== 'SELECT_CARD') return;
    
    setBattleState(prev => prev ? { ...prev, selectedCard: card } : null);
  };

  const handleConfirmCard = () => {
    if (!battleState || !battleState.selectedCard || battleState.phase !== 'SELECT_CARD') return;
    
    // Move to hand selection phase
    setBattleState(prev => prev ? { ...prev, phase: 'SELECT_HAND' } : null);
  };

  const handleHandSelect = (hand: 'ROCK' | 'SCISSORS' | 'PAPER') => {
    if (!battleState || battleState.phase !== 'SELECT_HAND') return;
    
    setBattleState(prev => prev ? { ...prev, selectedHand: hand } : null);
  };

  const handleConfirmHand = () => {
    if (!battleState || !battleState.selectedCard || !battleState.selectedHand || battleState.phase !== 'SELECT_HAND') return;

    // CPU selects random card and hand
    const cpuCard = battleState.cpuHand[Math.floor(Math.random() * battleState.cpuHand.length)];
    const cpuHand = ['ROCK', 'SCISSORS', 'PAPER'][Math.floor(Math.random() * 3)] as 'ROCK' | 'SCISSORS' | 'PAPER';
    
    // Judge battle
    const result = judgeBattle(
      battleState.selectedCard,
      cpuCard,
      battleState.selectedHand,
      cpuHand,
      battleState.playerHp,
      battleState.cpuHp
    );
    
    const newPlayerHp = Math.max(0, battleState.playerHp - result.playerDamage);
    const newCpuHp = Math.max(0, battleState.cpuHp - result.cpuDamage);
    
    const newLog = [
      ...battleState.battleLog,
      `ターン${battleState.turn}: ${result.message}`,
    ];

    // Remove used cards from hand
    const newPlayerHand = battleState.playerHand.filter(c => c.id !== battleState.selectedCard!.id);
    const newCpuHand = battleState.cpuHand.filter(c => c.id !== cpuCard.id);

    // Check for winner
    let winner: 'PLAYER' | 'CPU' | 'DRAW' | null = null;
    let phase: 'SELECT_CARD' | 'SELECT_HAND' | 'JUDGE' | 'END' = 'JUDGE';
    
    if (newPlayerHp <= 0 && newCpuHp <= 0) {
      winner = 'DRAW';
      phase = 'END';
      newLog.push('引き分け！');
    } else if (newPlayerHp <= 0) {
      winner = 'CPU';
      phase = 'END';
      newLog.push('敗北...');
    } else if (newCpuHp <= 0) {
      winner = 'PLAYER';
      phase = 'END';
      newLog.push('勝利！');
    }

    setBattleState({
      ...battleState,
      playerHp: newPlayerHp,
      cpuHp: newCpuHp,
      playerHand: newPlayerHand,
      cpuHand: newCpuHand,
      cpuSelectedCard: cpuCard,
      cpuSelectedHand: cpuHand,
      battleLog: newLog,
      phase,
      winner,
    });
  };

  const handleNextTurn = () => {
    if (!battleState || battleState.phase !== 'JUDGE') return;

    const newTurn = battleState.turn + 1;
    
    // Draw new cards if available
    let newPlayerHand = [...battleState.playerHand];
    let newPlayerDeck = [...battleState.playerDeck];
    let newCpuHand = [...battleState.cpuHand];
    let newCpuDeck = [...battleState.cpuDeck];

    if (newPlayerDeck.length > 0) {
      const drawResult = drawCards(newPlayerDeck, 1);
      newPlayerHand = [...newPlayerHand, ...drawResult.drawn];
      newPlayerDeck = drawResult.remaining;
    }

    if (newCpuDeck.length > 0) {
      const drawResult = drawCards(newCpuDeck, 1);
      newCpuHand = [...newCpuHand, ...drawResult.drawn];
      newCpuDeck = drawResult.remaining;
    }

    // Check if battle should end (no cards left)
    if (newPlayerHand.length === 0 && newCpuHand.length === 0) {
      const winner = battleState.playerHp > battleState.cpuHp ? 'PLAYER' : 'CPU';
      setBattleState({
        ...battleState,
        turn: newTurn,
        playerHand: newPlayerHand,
        cpuHand: newCpuHand,
        playerDeck: newPlayerDeck,
        cpuDeck: newCpuDeck,
        selectedCard: null,
        cpuSelectedCard: null,
        phase: 'END',
        winner,
        battleLog: [...battleState.battleLog, 'カードが無くなりました！'],
      });
      return;
    }

    setBattleState({
      ...battleState,
      turn: newTurn,
      playerHand: newPlayerHand,
      cpuHand: newCpuHand,
      playerDeck: newPlayerDeck,
      cpuDeck: newCpuDeck,
      selectedCard: null,
      selectedHand: null,
      cpuSelectedCard: null,
      cpuSelectedHand: null,
      phase: 'SELECT_CARD',
    });
  };

  const handleRestart = () => {
    setBattleKey(prev => prev + 1); // Increment key to trigger re-initialization
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">バトルを準備中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-bold text-red-700 mb-4">エラー</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/deck')}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            デッキビルダーへ
          </button>
        </div>
      </div>
    );
  }

  if (!battleState || !playerLeaderCard || !cpuLeaderCard) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-900">バトル</h1>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              メニューへ戻る
            </button>
          </div>
        </div>
      </nav>

      <BattleUI
        playerHp={battleState.playerHp}
        cpuHp={battleState.cpuHp}
        playerMaxHp={playerLeaderCard.hp}
        cpuMaxHp={cpuLeaderCard.hp}
        turn={battleState.turn}
        playerHand={battleState.playerHand}
        cpuHandCount={battleState.cpuHand.length}
        selectedCard={battleState.selectedCard}
        selectedHand={battleState.selectedHand}
        cpuSelectedCard={battleState.cpuSelectedCard}
        cpuSelectedHand={battleState.cpuSelectedHand}
        battleLog={battleState.battleLog}
        phase={battleState.phase}
        winner={battleState.winner}
        onCardSelect={handleCardSelect}
        onConfirmCard={handleConfirmCard}
        onHandSelect={handleHandSelect}
        onConfirmHand={handleConfirmHand}
        onNextTurn={handleNextTurn}
        onRestart={handleRestart}
      />
    </div>
  );
};

export default Battle;
