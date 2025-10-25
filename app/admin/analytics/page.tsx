'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { getContractConfig } from '@/lib/contract';

interface NFTMetadata {
  title: string;
  message: string;
  playerName: string;
  imageUrl: string;
  creator: string;
  paymentAmount: string;
  createdAt: string;
  isVenueAttendee: boolean;
}

interface NFTWithId {
  tokenId: bigint;
  metadata: NFTMetadata;
}

interface PlayerStats {
  playerName: string;
  count: number;
  totalPayment: number;
}

interface MonthlyStats {
  month: string;
  count: number;
  payment: number;
}

export default function Analytics() {
  const { address } = useAccount();
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [allNFTs, setAllNFTs] = useState<NFTWithId[]>([]);
  const contractConfig = getContractConfig();

  // 総NFT発行数を取得
  const { data: totalSupply } = useReadContract({
    ...contractConfig,
    functionName: 'totalSupply',
    query: {
      enabled: !!contractConfig,
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // 全NFTのメタデータを取得
  useEffect(() => {
    if (!totalSupply || totalSupply === 0n) {
      setLoading(false);
      return;
    }

    const fetchAllNFTs = async () => {
      setLoading(true);
      try {
        const tokenIds = Array.from({ length: Number(totalSupply) }, (_, i) => BigInt(i));

        const nftPromises = tokenIds.map(async (tokenId) => {
          try {
            const response = await fetch(
              `/api/blockchain/nft-metadata?tokenId=${tokenId.toString()}`
            );

            if (!response.ok) {
              console.error(`Failed to fetch metadata for token ${tokenId}`);
              return null;
            }

            const result = await response.json();
            return {
              tokenId,
              metadata: result.data as NFTMetadata,
            };
          } catch (error) {
            console.error(`Error fetching token ${tokenId}:`, error);
            return null;
          }
        });

        const results = await Promise.all(nftPromises);
        setAllNFTs(results.filter((nft): nft is NFTWithId => nft !== null));
      } catch (error) {
        console.error('Error fetching NFT metadata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllNFTs();
  }, [totalSupply]);

  // 統計データを計算
  const totalNFTs = allNFTs.length;
  const totalPayment = allNFTs.reduce((sum, nft) => sum + parseFloat(nft.metadata.paymentAmount), 0);
  const avgPayment = totalNFTs > 0 ? totalPayment / totalNFTs : 0;
  const venueAttendees = allNFTs.filter(nft => nft.metadata.isVenueAttendee).length;

  // 選手別統計
  const playerStatsMap = new Map<string, { count: number; totalPayment: number }>();
  allNFTs.forEach(nft => {
    const playerName = nft.metadata.playerName;
    const payment = parseFloat(nft.metadata.paymentAmount);

    if (!playerStatsMap.has(playerName)) {
      playerStatsMap.set(playerName, { count: 0, totalPayment: 0 });
    }

    const stats = playerStatsMap.get(playerName)!;
    stats.count += 1;
    stats.totalPayment += payment;
  });

  const playerStats: PlayerStats[] = Array.from(playerStatsMap.entries())
    .map(([playerName, stats]) => ({
      playerName,
      count: stats.count,
      totalPayment: stats.totalPayment,
    }))
    .sort((a, b) => b.count - a.count);

  // 月別統計
  const monthlyStatsMap = new Map<string, { count: number; payment: number }>();
  allNFTs.forEach(nft => {
    const date = new Date(parseInt(nft.metadata.createdAt) * 1000);
    const month = `${date.getFullYear()}年${date.getMonth() + 1}月`;
    const payment = parseFloat(nft.metadata.paymentAmount);

    if (!monthlyStatsMap.has(month)) {
      monthlyStatsMap.set(month, { count: 0, payment: 0 });
    }

    const stats = monthlyStatsMap.get(month)!;
    stats.count += 1;
    stats.payment += payment;
  });

  const monthlyStats: MonthlyStats[] = Array.from(monthlyStatsMap.entries())
    .map(([month, stats]) => ({
      month,
      count: stats.count,
      payment: stats.payment,
    }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-12);

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl font-black text-yellow-300">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl font-black text-yellow-300">NFTデータを読み込み中...</p>
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
          <p className="text-4xl font-black text-yellow-300">{totalNFTs}</p>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-green-800 p-6 border-4 border-yellow-400 text-center">
          <p className="text-sm text-yellow-200 font-bold mb-2">総売上</p>
          <p className="text-4xl font-black text-yellow-300">¥{Math.round(totalPayment).toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 border-4 border-yellow-400 text-center">
          <p className="text-sm text-yellow-200 font-bold mb-2">平均単価</p>
          <p className="text-4xl font-black text-yellow-300">¥{Math.round(avgPayment).toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-600 to-orange-800 p-6 border-4 border-yellow-400 text-center">
          <p className="text-sm text-yellow-200 font-bold mb-2">現地参加率</p>
          <p className="text-4xl font-black text-yellow-300">
            {totalNFTs > 0 ? Math.round((venueAttendees / totalNFTs) * 100) : 0}%
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
            {playerStats.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 font-bold">まだデータがありません</p>
              </div>
            ) : (
              playerStats.slice(0, 10).map((player: PlayerStats, index: number) => (
                <div
                  key={player.playerName}
                  className="flex items-center justify-between bg-gray-700 p-4 border-2 border-gray-600"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-black text-yellow-300">#{index + 1}</span>
                    <div>
                      <p className="font-black text-yellow-300 text-lg">{player.playerName}</p>
                      <p className="text-sm text-gray-400 font-medium">
                        {player.count}件 / ¥{Math.round(player.totalPayment).toLocaleString()}
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
              ))
            )}
          </div>
        </div>

        {/* 現地参加統計 */}
        <div className="bg-gray-800 p-8 shadow-2xl border-4 border-red-600">
          <h2 className="text-3xl font-black text-yellow-300 mb-6 tracking-wider">
            🏟️ 現地参加統計
          </h2>
          <div className="space-y-4">
            <div className="bg-gray-700 p-6 border-2 border-gray-600">
              <div className="flex justify-between items-center mb-2">
                <p className="font-black text-yellow-300 text-xl">現地参加</p>
                <p className="font-black text-yellow-300 text-2xl">{venueAttendees}件</p>
              </div>
              <div className="flex justify-between text-gray-400 font-medium">
                <span>参加率</span>
                <span className="text-yellow-300 font-bold">
                  {totalNFTs > 0 ? Math.round((venueAttendees / totalNFTs) * 100) : 0}%
                </span>
              </div>
            </div>
            <div className="bg-gray-700 p-6 border-2 border-gray-600">
              <div className="flex justify-between items-center mb-2">
                <p className="font-black text-yellow-300 text-xl">オンライン</p>
                <p className="font-black text-yellow-300 text-2xl">{totalNFTs - venueAttendees}件</p>
              </div>
              <div className="flex justify-between text-gray-400 font-medium">
                <span>割合</span>
                <span className="text-yellow-300 font-bold">
                  {totalNFTs > 0 ? Math.round(((totalNFTs - venueAttendees) / totalNFTs) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 月別統計グラフ */}
      <div className="bg-gray-800 p-8 shadow-2xl border-4 border-red-600">
        <h2 className="text-3xl font-black text-yellow-300 mb-6 tracking-wider">
          📅 月別NFT発行数推移（過去12ヶ月）
        </h2>

        {monthlyStats.length > 0 ? (
          <div className="space-y-2">
            {/* グラフ本体 */}
            <div className="flex items-end justify-between gap-2 h-80 bg-gray-900 p-6 border-2 border-gray-700">
              {monthlyStats.map((monthly: MonthlyStats, index: number) => {
                const maxCount = Math.max(...monthlyStats.map((m: MonthlyStats) => m.count), 1);
                const heightPercent = (monthly.count / maxCount) * 100;

                return (
                  <div key={monthly.month} className="flex-1 flex flex-col items-center gap-2">
                    {/* バーと数値 */}
                    <div className="relative w-full flex flex-col items-center">
                      <span className="text-yellow-300 font-black text-sm mb-1">{monthly.count}</span>
                      <div
                        className="w-full bg-gradient-to-t from-red-600 via-orange-500 to-yellow-400 transition-all duration-500 hover:opacity-80 cursor-pointer relative group"
                        style={{
                          height: `${Math.max(heightPercent, 5)}%`,
                          minHeight: '20px',
                        }}
                        title={`${monthly.month}: ${monthly.count}件 / ¥${Math.round(monthly.payment).toLocaleString()}`}
                      >
                        {/* ホバー時のツールチップ */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <div className="bg-gray-800 text-yellow-300 text-xs font-bold px-3 py-2 border-2 border-yellow-400 whitespace-nowrap">
                            {monthly.month}<br/>
                            {monthly.count}件<br/>
                            ¥{Math.round(monthly.payment).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 月ラベル */}
                    <p className="text-xs text-gray-400 font-bold text-center transform -rotate-45 origin-top-left mt-2 whitespace-nowrap">
                      {monthly.month}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* 統計サマリー */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-gray-700 p-4 border-2 border-gray-600 text-center">
                <p className="text-sm text-gray-400 font-bold mb-1">総発行数</p>
                <p className="text-2xl font-black text-yellow-300">
                  {monthlyStats.reduce((sum: number, m: MonthlyStats) => sum + m.count, 0)}件
                </p>
              </div>
              <div className="bg-gray-700 p-4 border-2 border-gray-600 text-center">
                <p className="text-sm text-gray-400 font-bold mb-1">月平均</p>
                <p className="text-2xl font-black text-yellow-300">
                  {monthlyStats.length > 0 ? Math.round(monthlyStats.reduce((sum: number, m: MonthlyStats) => sum + m.count, 0) / monthlyStats.length) : 0}件
                </p>
              </div>
              <div className="bg-gray-700 p-4 border-2 border-gray-600 text-center">
                <p className="text-sm text-gray-400 font-bold mb-1">最高記録</p>
                <p className="text-2xl font-black text-yellow-300">
                  {monthlyStats.length > 0 ? Math.max(...monthlyStats.map((m: MonthlyStats) => m.count)) : 0}件
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 font-bold text-lg">まだデータがありません</p>
          </div>
        )}
      </div>
    </div>
  );
}
