'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

interface Stats {
  totalNFTs: number;
  totalUsers: number;
  totalPayments: number;
  venueAttendees: number;
  todayNFTs: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalNFTs: 0,
    totalUsers: 0,
    totalPayments: 0,
    venueAttendees: 0,
    todayNFTs: 0,
  });
  const [loading, setLoading] = useState(true);

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

        // 今日のNFT発行数
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayNFTs = nfts.filter(nft => {
          const createdAt = nft.createdAt?.toDate();
          return createdAt && createdAt >= today;
        }).length;

        setStats({
          totalNFTs: nfts.length,
          totalUsers: usersSnapshot.size,
          totalPayments,
          venueAttendees,
          todayNFTs,
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

        {/* 本日のNFT */}
        <div className="bg-gradient-to-br from-orange-600 to-orange-800 p-8 shadow-2xl border-4 border-yellow-400">
          <div className="text-center">
            <div className="text-5xl mb-3">📅</div>
            <p className="text-sm text-yellow-200 font-bold mb-2">本日のNFT発行</p>
            <p className="text-5xl font-black text-yellow-300">{stats.todayNFTs}</p>
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
    </div>
  );
}
