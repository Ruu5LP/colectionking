import React from 'react';
import { Card } from '../types';

interface BattleUIProps {
  playerHp: number;
  cpuHp: number;
  playerMaxHp: number;
  cpuMaxHp: number;
  turn: number;
  playerHand: Card[];
  cpuHandCount: number;
  selectedCard: Card | null;
  cpuSelectedCard: Card | null;
  battleLog: string[];
  phase: 'SELECT' | 'JUDGE' | 'END';
  winner: 'PLAYER' | 'CPU' | 'DRAW' | null;
  onCardSelect: (card: Card) => void;
  onConfirm: () => void;
  onNextTurn: () => void;
  onRestart: () => void;
}

const BattleUI: React.FC<BattleUIProps> = ({
  playerHp,
  cpuHp,
  playerMaxHp,
  cpuMaxHp,
  turn,
  playerHand,
  cpuHandCount,
  selectedCard,
  cpuSelectedCard,
  battleLog,
  phase,
  winner,
  onCardSelect,
  onConfirm,
  onNextTurn,
  onRestart,
}) => {
  const getHandIcon = (hand: string) => {
    switch (hand) {
      case 'ROCK': return '✊';
      case 'SCISSORS': return '✌️';
      case 'PAPER': return '✋';
      default: return '';
    }
  };

  const getHpBarColor = (hp: number, maxHp: number) => {
    const percentage = (hp / maxHp) * 100;
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* HP Bars */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Player HP */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-bold mb-2 text-blue-600">プレイヤー</h3>
          <div className="text-2xl font-bold mb-2">{playerHp} / {playerMaxHp}</div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className={`h-4 rounded-full transition-all ${getHpBarColor(playerHp, playerMaxHp)}`}
              style={{ width: `${Math.max(0, (playerHp / playerMaxHp) * 100)}%` }}
            />
          </div>
        </div>

        {/* CPU HP */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-bold mb-2 text-red-600">CPU</h3>
          <div className="text-2xl font-bold mb-2">{cpuHp} / {cpuMaxHp}</div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className={`h-4 rounded-full transition-all ${getHpBarColor(cpuHp, cpuMaxHp)}`}
              style={{ width: `${Math.max(0, (cpuHp / cpuMaxHp) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Turn Counter */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 text-center">
        <h3 className="text-xl font-bold">ターン {turn}</h3>
      </div>

      {/* Battle Field */}
      <div className="bg-gradient-to-b from-blue-100 to-red-100 rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-2 gap-8">
          {/* Player Side */}
          <div className="text-center">
            <h4 className="text-lg font-bold mb-4 text-blue-600">プレイヤー</h4>
            {selectedCard && (
              <div className="bg-white border-4 border-blue-500 rounded-lg p-4 inline-block">
                <div className="text-sm font-bold mb-2">{selectedCard.name}</div>
                <div className="text-4xl mb-2">{getHandIcon(selectedCard.hand)}</div>
                <div className="text-xs">
                  <div className="text-red-600">ATK: {selectedCard.atk}</div>
                  <div className="text-blue-600">DEF: {selectedCard.def}</div>
                  {selectedCard.element && (
                    <div className="mt-1 font-bold">{selectedCard.element}</div>
                  )}
                </div>
              </div>
            )}
            {!selectedCard && phase === 'SELECT' && (
              <div className="text-gray-400 text-lg">カードを選択してください</div>
            )}
          </div>

          {/* CPU Side */}
          <div className="text-center">
            <h4 className="text-lg font-bold mb-4 text-red-600">CPU</h4>
            {cpuSelectedCard && phase === 'JUDGE' ? (
              <div className="bg-white border-4 border-red-500 rounded-lg p-4 inline-block">
                <div className="text-sm font-bold mb-2">{cpuSelectedCard.name}</div>
                <div className="text-4xl mb-2">{getHandIcon(cpuSelectedCard.hand)}</div>
                <div className="text-xs">
                  <div className="text-red-600">ATK: {cpuSelectedCard.atk}</div>
                  <div className="text-blue-600">DEF: {cpuSelectedCard.def}</div>
                  {cpuSelectedCard.element && (
                    <div className="mt-1 font-bold">{cpuSelectedCard.element}</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-lg">
                {phase === 'SELECT' ? '考え中...' : ''}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Player Hand */}
      {phase === 'SELECT' && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h3 className="text-lg font-bold mb-4">手札 ({playerHand.length}枚)</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {playerHand.map((card) => (
              <div
                key={card.id}
                onClick={() => onCardSelect(card)}
                className={`
                  border-2 rounded-lg p-3 cursor-pointer transition-all
                  ${selectedCard?.id === card.id 
                    ? 'border-blue-500 bg-blue-50 ring-4 ring-blue-300 scale-105' 
                    : 'border-gray-300 bg-white hover:border-blue-300 hover:shadow-md'
                  }
                `}
              >
                <div className="text-xs font-bold mb-1 truncate" title={card.name}>
                  {card.name}
                </div>
                <div className="text-2xl text-center mb-1">{getHandIcon(card.hand)}</div>
                <div className="text-xs text-center">
                  <div className="text-red-600">ATK: {card.atk}</div>
                  <div className="text-blue-600">DEF: {card.def}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-500">
            CPU手札: {cpuHandCount}枚
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        {phase === 'SELECT' && (
          <button
            onClick={onConfirm}
            disabled={!selectedCard}
            className={`
              w-full py-3 px-6 rounded-lg font-bold text-white text-lg
              ${selectedCard 
                ? 'bg-blue-500 hover:bg-blue-600 cursor-pointer' 
                : 'bg-gray-300 cursor-not-allowed'
              }
            `}
          >
            決定
          </button>
        )}
        {phase === 'JUDGE' && !winner && (
          <button
            onClick={onNextTurn}
            className="w-full py-3 px-6 rounded-lg font-bold text-white text-lg bg-green-500 hover:bg-green-600"
          >
            次のターン
          </button>
        )}
        {phase === 'END' && winner && (
          <div>
            <div className={`text-3xl font-bold text-center mb-4 ${
              winner === 'PLAYER' ? 'text-blue-600' : 
              winner === 'CPU' ? 'text-red-600' : 
              'text-gray-600'
            }`}>
              {winner === 'PLAYER' ? '勝利！' : winner === 'CPU' ? '敗北...' : '引き分け！'}
            </div>
            <button
              onClick={onRestart}
              className="w-full py-3 px-6 rounded-lg font-bold text-white text-lg bg-purple-500 hover:bg-purple-600"
            >
              もう一度プレイ
            </button>
          </div>
        )}
      </div>

      {/* Battle Log */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-bold mb-4">バトルログ</h3>
        <div className="max-h-60 overflow-y-auto space-y-2">
          {battleLog.slice().reverse().map((log, index) => (
            <div key={index} className="text-sm text-gray-700 border-b border-gray-200 pb-2">
              {log}
            </div>
          ))}
          {battleLog.length === 0 && (
            <div className="text-gray-400 text-sm">バトルを開始してください</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BattleUI;
