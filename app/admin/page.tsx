'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, addDoc, deleteDoc, doc, serverTimestamp, Timestamp, orderBy } from 'firebase/firestore';

interface Stats {
  totalNFTs: number;
  totalUsers: number;
  totalPayments: number;
  venueAttendees: number;
  thisMonthNFTs: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalNFTs: 0,
    totalUsers: 0,
    totalPayments: 0,
    venueAttendees: 0,
    thisMonthNFTs: 0,
  });
  const [loading, setLoading] = useState(true);
  const [codes, setCodes] = useState<any[]>([]);
  const [newCode, setNewCode] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // NFT統計
        const nftsSnapshot = await getDocs(collection(db, 'nfts'));
        const nfts = nftsSnapshot.docs.map(doc => doc.data());

        // ユーザー統計
        const usersSnapshot = await getDocs(collection(db, 'users'));

        // 支払い総額
        const totalPayments = nfts.reduce((sum, nft) => sum + (nft.paymentAmount || 0), 0);

        // 会場参加者数
        const venueAttendees = nfts.filter(nft => nft.isVenueAttendee).length;

        // 今月のNFT発行数
        const now = new Date();
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const thisMonthNFTs = nfts.filter(nft => {
          const createdAt = nft.createdAt?.toDate();
          return createdAt && createdAt >= thisMonthStart;
        }).length;

        setStats({
          totalNFTs: nfts.length,
          totalUsers: usersSnapshot.size,
          totalPayments,
          venueAttendees,
          thisMonthNFTs,
        });
      } catch (error) {
        console.error('統計データの取得エラー:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
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
          CHEERAIN システム統計
        </p>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {/* 総NFT数 */}
        <div className="bg-gradient-to-br from-red-600 to-red-800 p-8 shadow-2xl border-4 border-yellow-400">
          <div className="text-center">
            <div className="text-5xl mb-3">🎴</div>
            <p className="text-sm text-yellow-200 font-bold mb-2">総NFT発行数</p>
            <p className="text-5xl font-black text-yellow-300">{stats.totalNFTs}</p>
          </div>
        </div>

        {/* 総ユーザー数 */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 shadow-2xl border-4 border-yellow-400">
          <div className="text-center">
            <div className="text-5xl mb-3">👥</div>
            <p className="text-sm text-yellow-200 font-bold mb-2">登録ユーザー数</p>
            <p className="text-5xl font-black text-yellow-300">{stats.totalUsers}</p>
          </div>
        </div>

        {/* 支払い総額 */}
        <div className="bg-gradient-to-br from-green-600 to-green-800 p-8 shadow-2xl border-4 border-yellow-400">
          <div className="text-center">
            <div className="text-5xl mb-3">💰</div>
            <p className="text-sm text-yellow-200 font-bold mb-2">支払い総額</p>
            <p className="text-5xl font-black text-yellow-300">
              ¥{stats.totalPayments.toLocaleString()}
            </p>
          </div>
        </div>

        {/* 現地参加者数 */}
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-8 shadow-2xl border-4 border-yellow-400">
          <div className="text-center">
            <div className="text-5xl mb-3">🏟️</div>
            <p className="text-sm text-yellow-200 font-bold mb-2">現地参加者</p>
            <p className="text-5xl font-black text-yellow-300">{stats.venueAttendees}</p>
          </div>
        </div>

        {/* 今月のNFT */}
        <div className="bg-gradient-to-br from-orange-600 to-orange-800 p-8 shadow-2xl border-4 border-yellow-400">
          <div className="text-center">
            <div className="text-5xl mb-3">📅</div>
            <p className="text-sm text-yellow-200 font-bold mb-2">今月のNFT発行</p>
            <p className="text-5xl font-black text-yellow-300">{stats.thisMonthNFTs}</p>
          </div>
        </div>

        {/* 平均支払額 */}
        <div className="bg-gradient-to-br from-pink-600 to-pink-800 p-8 shadow-2xl border-4 border-yellow-400">
          <div className="text-center">
            <div className="text-5xl mb-3">📈</div>
            <p className="text-sm text-yellow-200 font-bold mb-2">平均支払額</p>
            <p className="text-5xl font-black text-yellow-300">
              ¥{stats.totalNFTs > 0 ? Math.round(stats.totalPayments / stats.totalNFTs).toLocaleString() : 0}
            </p>
          </div>
        </div>
      </div>

      {/* クイックアクション */}
      <div className="bg-gray-800 p-8 shadow-2xl border-4 border-red-600">
        <h2 className="text-3xl font-black text-yellow-300 mb-6 tracking-wider">
          🚀 クイックアクション
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </div>
      </div>
      
      {/* 現地コード管理 - 管理者がコードを作成/削除できます（24時間で期限切れ） */}
      <div className="bg-white mt-8 p-8 shadow-2xl border-4 border-red-700">
        <h2 className="text-2xl font-black text-red-700 mb-4 tracking-wider">🏷️ 現地コード管理</h2>
        <p className="text-sm text-gray-700 mb-4">管理者が現地で使うコードを作成できます。コードは24時間で期限切れになります（フロントから期限切れを自動削除します）。</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-800 mb-2">コード（任意）</label>
            <input
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300"
              placeholder="空欄の場合はランダム生成されます（5桁の数字推奨）"
            />
            <p className="text-xs text-gray-500 mt-2">5桁の数字を推奨（互換性のため）。</p>
          </div>
          <div className="flex items-end">
            <button
              onClick={async () => {
                if (creating) return;
                setCreating(true);
                try {
                  const codeVal = newCode && newCode.trim().length > 0 ? newCode.trim() : String(Math.floor(10000 + Math.random() * 90000));
                  const now = new Date();
                  const expires = new Date(now.getTime() + 24 * 60 * 60 * 1000);
                  await addDoc(collection(db, 'venueCodes'), {
                    code: codeVal,
                    createdAt: serverTimestamp(),
                    expiresAt: Timestamp.fromDate(expires),
                    createdBy: 'admin',
                  });
                  setNewCode('');
                  // 再取得
                  const q = query(collection(db, 'venueCodes'), orderBy('createdAt','desc'));
                  const snap = await getDocs(q);
                  const nowDate = new Date();
                  const items: any[] = [];
                  for(const d of snap.docs){
                    const data = d.data();
                    const expiresAt = data.expiresAt ? data.expiresAt.toDate() : null;
                    if (expiresAt && expiresAt < nowDate){
                      await deleteDoc(doc(db, 'venueCodes', d.id));
                      continue;
                    }
                    items.push({ id: d.id, ...data });
                  }
                  setCodes(items);
                } catch (err) {
                  console.error('コード作成エラー', err);
                } finally {
                  setCreating(false);
                }
              }}
              className="w-full bg-red-700 text-yellow-300 font-black py-2 px-4 border-2 border-yellow-400 hover:bg-red-800"
            >
              {creating ? '作成中...' : 'コードを作成'}
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-3">有効な現地コード</h3>
          <div className="space-y-3">
            {codes.length === 0 ? (
              <p className="text-sm text-gray-600">現在有効なコードはありません。</p>
            ) : (
              codes.map((c) => (
                <div key={c.id} className="flex items-center justify-between bg-gray-50 p-3 border-2 border-gray-200">
                  <div>
                    <div className="font-black text-lg text-red-700 tracking-wider">{c.code}</div>
                    <div className="text-xs text-gray-600">有効期限: {c.expiresAt?.toDate ? c.expiresAt.toDate().toLocaleString() : '-'}</div>
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
                          await deleteDoc(doc(db,'venueCodes',c.id));
                          setCodes(prev=>prev.filter(p=>p.id!==c.id));
                        }catch(e){ console.error(e); }
                      }}
                      className="px-3 py-2 bg-gray-300 font-bold text-gray-800 border-2 border-gray-400"
                    >削除</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
