import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Leader, Deck as DeckType, BattleState } from '../types';
import { useUserId } from '../hooks/useUserId';
import { apiGet } from '../hooks/useApi';
import BattleUI from '../components/BattleUI';
import { judgeBattle, shuffleDeck, drawCards } from '../shared/rules/battle';

const Battle: React.FC = () => {
  const navigate = useNavigate();
  const userId = useUserId();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playerLeader, setPlayerLeader] = useState<Leader | null>(null);
  const [cpuLeader, setCpuLeader] = useState<Leader | null>(null);
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

        // Fetch all leaders and cards
        const [leaders, allCards] = await Promise.all([
          apiGet<Leader[]>('/api/leaders'),
          apiGet<Card[]>('/api/cards'),
        ]);

        // Get player leader
        const playerLeaderData = leaders.find(l => l.id === deck.leader_id);
        if (!playerLeaderData) {
          setError('リーダーが見つかりません');
          return;
        }
        setPlayerLeader(playerLeaderData);

        // Get player cards
        const playerCards = allCards.filter(c => deck.cards_json.includes(c.id));
        if (playerCards.length !== 10) {
          setError('デッキが正しくありません');
          return;
        }

        // Setup CPU (random leader and cards)
        const cpuLeaderData = leaders[Math.floor(Math.random() * leaders.length)];
        setCpuLeader(cpuLeaderData);

        // Random CPU deck
        const shuffledCards = shuffleDeck(allCards);
        const cpuCards = shuffledCards.slice(0, 10);

        // Initialize battle state
        const playerDeck = shuffleDeck(playerCards);
        const cpuDeck = shuffleDeck(cpuCards);
        
        const playerDrawResult = drawCards(playerDeck, 5);
        const cpuDrawResult = drawCards(cpuDeck, 5);

        setBattleState({
          playerHp: playerLeaderData.hp,
          cpuHp: cpuLeaderData.hp,
          turn: 1,
          playerHand: playerDrawResult.drawn,
          cpuHand: cpuDrawResult.drawn,
          playerDeck: playerDrawResult.remaining,
          cpuDeck: cpuDrawResult.remaining,
          selectedCard: null,
          cpuSelectedCard: null,
          battleLog: ['バトル開始！'],
          phase: 'SELECT',
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
    if (!battleState || battleState.phase !== 'SELECT') return;
    
    setBattleState(prev => prev ? { ...prev, selectedCard: card } : null);
  };

  const handleConfirm = () => {
    if (!battleState || !battleState.selectedCard || battleState.phase !== 'SELECT') return;

    // CPU selects random card
    const cpuCard = battleState.cpuHand[Math.floor(Math.random() * battleState.cpuHand.length)];
    
    // Judge battle
    const result = judgeBattle(battleState.selectedCard, cpuCard);
    
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
    let phase: 'SELECT' | 'JUDGE' | 'END' = 'JUDGE';
    
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

    // Check if battle should end (no cards left in hand)
    if (newPlayerHand.length === 0 && newCpuHand.length === 0) {
      let finalWinner: 'PLAYER' | 'CPU' | 'DRAW' = 'DRAW';
      if (battleState.playerHp > battleState.cpuHp) {
        finalWinner = 'PLAYER';
      } else if (battleState.cpuHp > battleState.playerHp) {
        finalWinner = 'CPU';
      }
      
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
        winner: finalWinner,
        battleLog: [...battleState.battleLog, 'カードが無くなりました！'],
      });
      return;
    }
    
    // Check if turn limit reached (10 turns maximum)
    if (newTurn > 10) {
      let finalWinner: 'PLAYER' | 'CPU' | 'DRAW' = 'DRAW';
      const newBattleLog = [...battleState.battleLog];
      
      if (battleState.playerHp > battleState.cpuHp) {
        finalWinner = 'PLAYER';
        newBattleLog.push('10ターン終了！ HPが高いプレイヤーの勝利！');
      } else if (battleState.cpuHp > battleState.playerHp) {
        finalWinner = 'CPU';
        newBattleLog.push('10ターン終了！ HPが高いCPUの勝利！');
      } else {
        finalWinner = 'DRAW';
        newBattleLog.push('10ターン終了！ HPが同じで引き分け！');
      }
      
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
        winner: finalWinner,
        battleLog: newBattleLog,
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
      cpuSelectedCard: null,
      phase: 'SELECT',
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

  if (!battleState || !playerLeader || !cpuLeader) {
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
        playerMaxHp={playerLeader.hp}
        cpuMaxHp={cpuLeader.hp}
        turn={battleState.turn}
        playerHand={battleState.playerHand}
        cpuHandCount={battleState.cpuHand.length}
        selectedCard={battleState.selectedCard}
        cpuSelectedCard={battleState.cpuSelectedCard}
        battleLog={battleState.battleLog}
        phase={battleState.phase}
        winner={battleState.winner}
        onCardSelect={handleCardSelect}
        onConfirm={handleConfirm}
        onNextTurn={handleNextTurn}
        onRestart={handleRestart}
      />
    </div>
  );
};

export default Battle;
