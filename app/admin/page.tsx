'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

export default function AdminDashboard() {
  const router = useRouter();
  const { isAdmin, loading: authLoading, userData } = useAuth();

  const [codes, setCodes] = useState<any[]>([]);
  const [newCode, setNewCode] = useState('');
  const [venueName, setVenueName] = useState('');
  const [creating, setCreating] = useState(false);

  // 管理者権限チェック
  useEffect(() => {
    if (!authLoading) {
      console.log('Auth check:', { isAdmin, userData });
      if (!isAdmin) {
        // デバッグ情報を含むアラート
        alert(`管理者権限が必要です\n\nデバッグ情報:\nisAdmin: ${isAdmin}\nrole: ${userData?.role}\nemail: ${userData?.email}`);
        router.push('/login');
      }
    }
  }, [isAdmin, authLoading, router, userData]);

  // 初回ロードで既存の有効な現地コードを取得
  useEffect(() => {
    const loadCodes = async () => {
      try {
        const response = await api.get<any[]>('/venue-codes');
        if (response.success && response.data) {
          setCodes(response.data);
        }
      } catch (err) {
        console.error('現地コード取得エラー', err);
      }
    };
    loadCodes();
  }, []);

  if (authLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl font-black text-yellow-300">データを読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* タイトル */}
      <div className="text-center mb-12">
        <div className="text-6xl mb-4">📊</div>
        <h1 className="text-5xl font-black text-yellow-300 mb-4 tracking-wider">
          管理ダッシュボード
        </h1>
        <p className="text-xl text-gray-300 font-bold">
          CHEERAIN 管理画面
        </p>
      </div>

      {/* クイックアクション */}
      <div className="bg-gray-800 p-8 shadow-2xl border-4 border-red-600">
        <h2 className="text-3xl font-black text-yellow-300 mb-6 tracking-wider">
          🚀 クイックアクション
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            href="/admin/users"
            className="block bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-center hover:from-blue-700 hover:to-blue-800 transition shadow-lg border-2 border-yellow-400"
          >
            <div className="text-4xl mb-2">👥</div>
            <p className="text-xl font-black text-yellow-300">ユーザー管理</p>
          </a>
          <a
            href="/admin/nfts"
            className="block bg-gradient-to-r from-red-600 to-red-700 p-6 text-center hover:from-red-700 hover:to-red-800 transition shadow-lg border-2 border-yellow-400"
          >
            <div className="text-4xl mb-2">🎴</div>
            <p className="text-xl font-black text-yellow-300">NFT管理</p>
          </a>
          <a
            href="/admin/analytics"
            className="block bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-center hover:from-purple-700 hover:to-purple-800 transition shadow-lg border-2 border-yellow-400"
          >
            <div className="text-4xl mb-2">📊</div>
            <p className="text-xl font-black text-yellow-300">詳細分析</p>
          </a>
          <a
            href="/admin/venue-codes"
            className="block bg-gradient-to-r from-green-600 to-green-700 p-6 text-center hover:from-green-700 hover:to-green-800 transition shadow-lg border-2 border-yellow-400"
          >
            <div className="text-4xl mb-2">🎫</div>
            <p className="text-xl font-black text-yellow-300">現地コード</p>
          </a>
        </div>
      </div>
      
      {/* 現地コード管理 - 管理者がコードを作成/削除できます（24時間で期限切れ） */}
      <div className="bg-white mt-8 p-8 shadow-2xl border-4 border-red-700">
        <h2 className="text-2xl font-black text-red-700 mb-4 tracking-wider">🏷️ 現地コード管理</h2>
        <p className="text-sm text-gray-700 mb-4">管理者が現地で使うコードを作成できます。コードは24時間で期限切れになります（フロントから期限切れを自動削除します）。</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-800 mb-2">コード（5桁必須）</label>
            <input
              value={newCode}
              onChange={(e) => {
                const value = e.target.value;
                // 5文字以内に制限
                if (value.length <= 5) {
                  setNewCode(value);
                }
              }}
              className="w-full px-4 py-2 border-2 border-gray-300"
              placeholder="5桁のコードを入力（例: 12345）"
              maxLength={5}
            />
            <p className="text-xs text-red-600 mt-1 font-bold">※ 必ず5文字で入力してください</p>
            <label className="block text-sm font-bold text-gray-800 mb-2 mt-3">会場名（任意）</label>
            <input
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300"
              placeholder="例: 東京スタジアム"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={async () => {
                if (creating) return;
                
                // コードの桁数チェック
                const codeVal = newCode.trim();
                if (!codeVal || codeVal.length !== 5) {
                  alert('コードは必ず5文字で入力してください');
                  return;
                }
                
                setCreating(true);
                try {
                  const response = await api.post<any>('/venue-codes', {
                    code: codeVal,
                    venueName: venueName || null,
                  });
                  
                  if (response.success) {
                    // 再取得
                    const listResponse = await api.get<any[]>('/venue-codes');
                    if (listResponse.success && listResponse.data) {
                      setCodes(listResponse.data);
                    }
                    setNewCode('');
                    setVenueName('');
                    alert('現地コードを作成しました！');
                  }
                } catch (err: any) {
                  console.error('コード作成エラー', err);
                  alert(err.message || 'コード作成に失敗しました');
                } finally {
                  setCreating(false);
                }
              }}
              className="w-full bg-red-700 text-yellow-300 font-black py-2 px-4 border-2 border-yellow-400 hover:bg-red-800"
            >
              {creating ? '作成中...' : codes && codes.length > 0 ? 'コードを更新' : 'コードを作成'}
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-3">有効な現地コード</h3>
          <div className="space-y-3">
            {(!codes || codes.length === 0) ? (
              <p className="text-sm text-gray-600">現在有効なコードはありません。</p>
            ) : (
              (() => {
                const c = codes[0];
                return (
                  <div key={c.id} className="flex items-center justify-between bg-gray-50 p-3 border-2 border-gray-200">
                    <div>
                      <div className="font-black text-lg text-red-700 tracking-wider">{c.code}</div>
                      <div className="text-sm text-gray-700">会場名: {c.venueName || '-'}</div>
                      <div className="text-xs text-gray-600">有効期限: {c.expiresAt ? new Date(c.expiresAt).toLocaleString() : '-'}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={async () => {
                          try{
                            await navigator.clipboard.writeText(c.code);
                            alert('コードをコピーしました');
                          }catch(e){ console.error(e); }
                        }}
                        className="px-3 py-2 bg-yellow-400 font-bold text-red-800 border-2 border-red-700"
                      >コピー</button>
                      <button
                        onClick={async () => {
                          try{
                            await api.delete(`/venue-codes/${c.id}`);
                            // 再取得
                            const response = await api.get<any[]>('/venue-codes');
                            if (response.success && response.data) {
                              setCodes(response.data);
                            }
                            alert('現地コードを削除しました');
                          }catch(e: any){ 
                            console.error(e);
                            alert(e.message || '削除に失敗しました');
                          }
                        }}
                        className="px-3 py-2 bg-gray-300 font-bold text-gray-800 border-2 border-gray-400"
                      >削除</button>
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
