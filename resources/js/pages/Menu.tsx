import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Menu: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();

  const menuItems = [
    { 
      label: 'シングル', 
      path: '/battle', 
      icon: '⚔️', 
      available: true,
      description: 'CPU対戦'
    },
    { 
      label: 'デッキ', 
      path: '/deck', 
      icon: '🃏', 
      available: true,
      description: 'デッキ編成'
    },
    { 
      label: 'コレクション', 
      path: '/collection', 
      icon: '📚', 
      available: true,
      description: 'カード一覧'
    },
    { 
      label: 'マルチ', 
      path: '#', 
      icon: '🌐', 
      available: false,
      description: '未実装'
    },
    { 
      label: '交換所', 
      path: '#', 
      icon: '🏪', 
      available: false,
      description: '未実装'
    },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            CollectionKing
          </h1>
          <p className="text-xl text-white/90">
            カードバトルゲーム
          </p>
          
          {!loading && (
            <div className="mt-4">
              {user ? (
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 inline-block">
                  <p className="text-white text-lg mb-2">
                    ようこそ <span className="font-bold">{user.display_name}</span> さん
                  </p>
                  <button
                    onClick={handleLogout}
                    className="text-white/90 hover:text-white underline text-sm"
                  >
                    ログアウト
                  </button>
                </div>
              ) : (
                <div className="space-x-4">
                  <button
                    onClick={() => navigate('/login')}
                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                  >
                    ログイン
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                  >
                    新規登録
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => item.available && navigate(item.path)}
              disabled={!item.available}
              className={`
                bg-white rounded-xl shadow-lg p-8 transition-all transform
                ${item.available 
                  ? 'hover:scale-105 hover:shadow-2xl cursor-pointer' 
                  : 'opacity-50 cursor-not-allowed'
                }
              `}
            >
              <div className="text-6xl mb-4 text-center">{item.icon}</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                {item.label}
              </h2>
              <p className="text-sm text-gray-600 text-center">
                {item.description}
              </p>
            </button>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-white/80 text-sm">
            Rock-Paper-Scissors card battle game
          </p>
        </div>
      </div>
    </div>
  );
};

export default Menu;
