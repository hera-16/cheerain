'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function DebugPage() {
  const { user, userData, isAdmin, loading } = useAuth();
  const [token, setToken] = useState<string>('');
  const [decodedToken, setDecodedToken] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('authToken') || '';
      setToken(storedToken);

      if (storedToken) {
        try {
          // JWTトークンをデコード
          const payload = JSON.parse(atob(storedToken.split('.')[1]));
          setDecodedToken(payload);
        } catch (error) {
          console.error('Token decode error:', error);
        }
      }
    }
  }, []);

  const clearStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      alert('LocalStorageをクリアしました。ページをリロードします。');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-red-600">🔧 デバッグ情報</h1>

        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-bold mb-4 text-blue-600">認証状態</h2>
          <div className="space-y-2">
            <p><strong>Loading:</strong> {loading ? 'true' : 'false'}</p>
            <p><strong>Is Admin:</strong> <span className={isAdmin ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{isAdmin ? 'true ✅' : 'false ❌'}</span></p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-bold mb-4 text-blue-600">ユーザー情報 (localStorage)</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-bold mb-4 text-blue-600">ユーザーデータ (AuthContext)</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(userData, null, 2)}
          </pre>
          {userData && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-300 rounded">
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Role:</strong> <span className="font-mono text-lg">{userData.role}</span></p>
              <p><strong>Role (uppercase):</strong> {userData.role?.toUpperCase()}</p>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-bold mb-4 text-blue-600">JWTトークン</h2>
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">トークン（最初の50文字）:</p>
            <p className="bg-gray-100 p-2 rounded text-xs break-all font-mono">
              {token ? token.substring(0, 50) + '...' : 'なし'}
            </p>
          </div>
          
          {decodedToken && (
            <div>
              <p className="text-sm text-gray-600 mb-2">デコードされたペイロード:</p>
              <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
                {JSON.stringify(decodedToken, null, 2)}
              </pre>
              {decodedToken.roles && (
                <div className="mt-4 p-4 bg-green-50 border border-green-300 rounded">
                  <p><strong>Roles in Token:</strong> <span className="font-mono text-lg">{decodedToken.roles}</span></p>
                </div>
              )}
              {!decodedToken.roles && (
                <div className="mt-4 p-4 bg-red-50 border border-red-300 rounded">
                  <p className="text-red-700"><strong>⚠️ 警告:</strong> JWTトークンにロール情報が含まれていません！</p>
                  <p className="text-sm mt-2">再ログインが必要です。</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-blue-600">アクション</h2>
          <button
            onClick={clearStorage}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition"
          >
            🗑️ LocalStorageをクリアして再ログイン
          </button>
          <p className="text-sm text-gray-600 mt-2">
            ※ クリック後、自動的にページがリロードされます
          </p>
        </div>

        <div className="mt-6 text-center">
          <a href="/login" className="text-blue-600 hover:underline">← ログインページに戻る</a>
          {' | '}
          <a href="/admin" className="text-blue-600 hover:underline">管理者ページへ →</a>
        </div>
      </div>
    </div>
  );
}
