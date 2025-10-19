'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface PlayerStats {
  playerName: string;
  count: number;
  totalPayment: number;
}

interface PaymentMethodStats {
  method: string;
  count: number;
  total: number;
}

interface DailyStats {
  date: string;
  count: number;
  payment: number;
}

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]);
  const [paymentStats, setPaymentStats] = useState<PaymentMethodStats[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [totalStats, setTotalStats] = useState({
    totalNFTs: 0,
    totalPayment: 0,
    avgPayment: 0,
    venueAttendees: 0,
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const nftsSnapshot = await getDocs(collection(db, 'nfts'));
      const nfts = nftsSnapshot.docs.map(doc => doc.data());

      // 選手別統計
      const playerMap = new Map<string, { count: number; totalPayment: number }>();
      nfts.forEach(nft => {
        const playerName = nft.playerName;
        const current = playerMap.get(playerName) || { count: 0, totalPayment: 0 };
        playerMap.set(playerName, {
          count: current.count + 1,
          totalPayment: current.totalPayment + (nft.paymentAmount || 0),
        });
      });

      const playerStatsData: PlayerStats[] = Array.from(playerMap.entries())
        .map(([playerName, stats]) => ({
          playerName,
          count: stats.count,
          totalPayment: stats.totalPayment,
        }))
        .sort((a, b) => b.count - a.count);

      setPlayerStats(playerStatsData);

      // 支払方法別統計
      const paymentMap = new Map<string, { count: number; total: number }>();
      nfts.forEach(nft => {
        const method = nft.paymentMethod || 'unknown';
        const current = paymentMap.get(method) || { count: 0, total: 0 };
        paymentMap.set(method, {
          count: current.count + 1,
          total: current.total + (nft.paymentAmount || 0),
        });
      });

      const paymentStatsData: PaymentMethodStats[] = Array.from(paymentMap.entries())
        .map(([method, stats]) => ({
          method,
          count: stats.count,
          total: stats.total,
        }))
        .sort((a, b) => b.count - a.count);

      setPaymentStats(paymentStatsData);

      // 日別統計（過去7日間）
      const dailyMap = new Map<string, { count: number; payment: number }>();
      nfts.forEach(nft => {
        const createdAt = nft.createdAt?.toDate();
        if (createdAt) {
          const dateStr = createdAt.toLocaleDateString('ja-JP');
          const current = dailyMap.get(dateStr) || { count: 0, payment: 0 };
          dailyMap.set(dateStr, {
            count: current.count + 1,
            payment: current.payment + (nft.paymentAmount || 0),
          });
        }
      });

      const dailyStatsData: DailyStats[] = Array.from(dailyMap.entries())
        .map(([date, stats]) => ({
          date,
          count: stats.count,
          payment: stats.payment,
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(-7); // 最新7日分

      setDailyStats(dailyStatsData);

      // 総合統計
      const totalPayment = nfts.reduce((sum, nft) => sum + (nft.paymentAmount || 0), 0);
      const venueAttendees = nfts.filter(nft => nft.isVenueAttendee).length;

      setTotalStats({
        totalNFTs: nfts.length,
        totalPayment,
        avgPayment: nfts.length > 0 ? totalPayment / nfts.length : 0,
        venueAttendees,
      });
    } catch (error) {
      console.error('分析データ取得エラー:', error);
      alert('分析データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl font-black text-yellow-300">読み込み中...</p>
        </div>
      </div>
    );
  }

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'credit': return 'クレジットカード';
      case 'paypay': return 'PayPay';
      case 'aupay': return 'auPay';
      default: return method;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* タイトル */}
      <div className="text-center mb-12">
        <div className="text-6xl mb-4">📊</div>
        <h1 className="text-5xl font-black text-yellow-300 mb-4 tracking-wider">
          詳細分析
        </h1>
        <p className="text-xl text-gray-300 font-bold">
          データドリブンな意思決定をサポート
        </p>
      </div>

      {/* サマリー統計 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 border-4 border-yellow-400 text-center">
          <p className="text-sm text-yellow-200 font-bold mb-2">総NFT数</p>
          <p className="text-4xl font-black text-yellow-300">{totalStats.totalNFTs}</p>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-green-800 p-6 border-4 border-yellow-400 text-center">
          <p className="text-sm text-yellow-200 font-bold mb-2">総売上</p>
          <p className="text-4xl font-black text-yellow-300">¥{totalStats.totalPayment.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 border-4 border-yellow-400 text-center">
          <p className="text-sm text-yellow-200 font-bold mb-2">平均単価</p>
          <p className="text-4xl font-black text-yellow-300">¥{Math.round(totalStats.avgPayment).toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-600 to-orange-800 p-6 border-4 border-yellow-400 text-center">
          <p className="text-sm text-yellow-200 font-bold mb-2">現地参加率</p>
          <p className="text-4xl font-black text-yellow-300">
            {totalStats.totalNFTs > 0 ? Math.round((totalStats.venueAttendees / totalStats.totalNFTs) * 100) : 0}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* 選手別ランキング */}
        <div className="bg-gray-800 p-8 shadow-2xl border-4 border-red-600">
          <h2 className="text-3xl font-black text-yellow-300 mb-6 tracking-wider">
            ⚽ 選手別応援ランキング
          </h2>
          <div className="space-y-4">
            {playerStats.slice(0, 10).map((player, index) => (
              <div
                key={player.playerName}
                className="flex items-center justify-between bg-gray-700 p-4 border-2 border-gray-600"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-black text-yellow-300">#{index + 1}</span>
                  <div>
                    <p className="font-black text-yellow-300 text-lg">{player.playerName}</p>
                    <p className="text-sm text-gray-400 font-medium">
                      {player.count}件 / ¥{player.totalPayment.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className="bg-red-600 h-6"
                    style={{
                      width: `${Math.max(50, (player.count / playerStats[0].count) * 200)}px`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 支払方法別統計 */}
        <div className="bg-gray-800 p-8 shadow-2xl border-4 border-red-600">
          <h2 className="text-3xl font-black text-yellow-300 mb-6 tracking-wider">
            💳 支払方法別統計
          </h2>
          <div className="space-y-4">
            {paymentStats.map((payment) => (
              <div
                key={payment.method}
                className="bg-gray-700 p-6 border-2 border-gray-600"
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="font-black text-yellow-300 text-xl">
                    {getPaymentMethodLabel(payment.method)}
                  </p>
                  <p className="font-black text-yellow-300 text-2xl">
                    {payment.count}件
                  </p>
                </div>
                <div className="flex justify-between text-gray-400 font-medium">
                  <span>合計金額</span>
                  <span className="text-yellow-300 font-bold">¥{payment.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-400 font-medium">
                  <span>平均金額</span>
                  <span className="text-yellow-300 font-bold">
                    ¥{Math.round(payment.total / payment.count).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 日別統計 */}
      <div className="bg-gray-800 p-8 shadow-2xl border-4 border-red-600">
        <h2 className="text-3xl font-black text-yellow-300 mb-6 tracking-wider">
          📅 日別NFT発行数（過去7日間）
        </h2>
        <div className="space-y-4">
          {dailyStats.map((daily) => (
            <div
              key={daily.date}
              className="flex items-center justify-between bg-gray-700 p-4 border-2 border-gray-600"
            >
              <div className="flex-1">
                <p className="font-black text-yellow-300 text-lg">{daily.date}</p>
                <p className="text-sm text-gray-400 font-medium">
                  {daily.count}件 / ¥{daily.payment.toLocaleString()}
                </p>
              </div>
              <div className="flex-1">
                <div
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-8 flex items-center justify-end pr-2"
                  style={{
                    width: `${Math.max(20, (daily.count / Math.max(...dailyStats.map(d => d.count))) * 100)}%`,
                  }}
                >
                  <span className="text-yellow-300 font-black text-sm">{daily.count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
