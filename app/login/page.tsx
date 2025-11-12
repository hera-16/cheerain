'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    userId: string;
    email: string;
    role: string;
  };
}

interface RegisterResponse {
  id: string;
  userId: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        // ユーザー登録
        const response = await api.post<RegisterResponse>('/auth/register', {
          email,
          password,
          role: isAdmin ? 'ADMIN' : 'USER',
        });

        if (response.success) {
          alert('登録が完了しました。ログインしてください。');
          setIsSignUp(false);
          setPassword('');
          setIsAdmin(false);
        }
      } else {
        // ログイン
        const response = await api.post<LoginResponse>('/auth/login', {
          email,
          password,
        });

        if (response.success && response.data) {
          // JWTトークンをlocalStorageに保存
          localStorage.setItem('authToken', response.data.token);
          // uidをidと同じ値で追加（マイページとの互換性のため）
          const userWithUid = { ...response.data.user, uid: response.data.user.id };
          localStorage.setItem('user', JSON.stringify(userWithUid));

          // ページをリロードしてAuthContextを更新
          // ロールに応じてリダイレクト
          if (response.data.user.role?.toUpperCase() === 'ADMIN') {
            window.location.href = '/admin';
          } else {
            window.location.href = '/blockchain-mint';
          }
        }
      }
    } catch (err) {
      setError((err as Error).message || 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-red-50 to-yellow-100">
      {/* ヘッダー */}
      <header className="bg-red-700 shadow-lg mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold text-yellow-300 cursor-pointer hover:text-yellow-200 transition tracking-wider">CHEERAIN</h1>
          </Link>
          
          <nav className="flex items-center gap-2">
            <Link
              href="/mypage"
              className="px-4 py-2 text-yellow-100 hover:text-yellow-300 transition font-bold tracking-wide"
            >
              マイページ
            </Link>
          </nav>
        </div>
      </header>

      {/* ログインフォーム */}
      <div className="flex items-center justify-center p-4">
        <div className="bg-white shadow-2xl p-8 w-full max-w-md border-4 border-red-700">
          <h2 className="text-3xl font-black text-center mb-2 text-red-700 tracking-wider">
            CHEERAIN
          </h2>
          <h1 className="text-center text-gray-700 mb-8 font-bold text-2xl">
            {isSignUp ? 'アカウント作成' : 'ログイン'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-800 mb-2 tracking-wide">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 focus:ring-0 focus:border-red-700 outline-none transition font-medium text-gray-900"
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-800 mb-2 tracking-wide">
                パスワード
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 focus:ring-0 focus:border-red-700 outline-none transition font-medium text-gray-900"
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            {/* アカウント種別選択（新規登録時のみ表示） */}
            {isSignUp && (
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2 tracking-wide">
                  アカウント種別
                </label>
                <div className="space-y-2">
                  <label className="flex items-center p-3 border-2 border-gray-300 cursor-pointer hover:border-red-700 transition">
                    <input
                      type="radio"
                      name="accountType"
                      checked={!isAdmin}
                      onChange={() => setIsAdmin(false)}
                      className="mr-3 w-4 h-4 text-red-700 focus:ring-red-700"
                    />
                    <div>
                      <div className="font-bold text-gray-900">👤 一般ユーザー</div>
                      <div className="text-xs text-gray-600">選手への応援メッセージ送信、NFT発行</div>
                    </div>
                  </label>
                  <label className="flex items-center p-3 border-2 border-gray-300 cursor-pointer hover:border-purple-700 transition">
                    <input
                      type="radio"
                      name="accountType"
                      checked={isAdmin}
                      onChange={() => setIsAdmin(true)}
                      className="mr-3 w-4 h-4 text-purple-700 focus:ring-purple-700"
                    />
                    <div>
                      <div className="font-bold text-gray-900">👑 管理者</div>
                      <div className="text-xs text-gray-600">システム管理、統計閲覧、ユーザー管理</div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-100 border-2 border-red-700 text-red-900 px-4 py-3 text-sm font-bold">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-700 text-yellow-300 py-3 font-black hover:bg-red-800 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border-2 border-yellow-400 tracking-wider"
            >
              {loading ? '処理中...' : isSignUp ? 'アカウント作成' : 'ログイン'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setIsAdmin(false);
              }}
              className="text-red-700 hover:text-red-900 text-sm font-bold tracking-wide underline"
            >
              {isSignUp ? 'すでにアカウントをお持ちの方はこちら' : 'アカウントを作成'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
