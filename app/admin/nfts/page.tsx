'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

interface NFT {
  id: string;
  title: string;
  message: string;
  playerName: string;
  imageUrl?: string;
  creatorUserId: string;
  creatorAddress: string;
  paymentAmount: number;
  paymentMethod: string;
  isVenueAttendee: boolean;
  venueId?: string;
  createdAt: string;
}

export default function NFTsManagement() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVenue, setFilterVenue] = useState<boolean | null>(null);

  useEffect(() => {
    fetchNFTs();
  }, []);

  const fetchNFTs = async () => {
    try {
      const response = await api.get<NFT[]>('/admin/nfts');
      const nftsList = response.data;

      // 作成日で降順ソート
      nftsList.sort((a: NFT, b: NFT) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setNfts(nftsList);
    } catch (error) {
      console.error('NFTリスト取得エラー:', error);
      alert('NFT情報の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const deleteNFT = async (nftId: string, nftTitle: string) => {
    if (!confirm(`NFT「${nftTitle}」を削除しますか？\nこの操作は取り消せません。`)) {
      return;
    }

    try {
      await api.delete(`/admin/nfts/${nftId}`);

      // ローカルステートを更新
      setNfts(nfts.filter(nft => nft.id !== nftId));

      alert('NFTを削除しました');
    } catch (error) {
      console.error('NFT削除エラー:', error);
      alert('NFTの削除に失敗しました');
    }
  };

  const filteredNFTs = nfts.filter(nft => {
    const matchesSearch =
      nft.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nft.playerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nft.creatorUserId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesVenue =
      filterVenue === null ||
      nft.isVenueAttendee === filterVenue;

    return matchesSearch && matchesVenue;
  });

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* タイトル */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🎴</div>
        <h1 className="text-5xl font-black text-yellow-300 mb-4 tracking-wider">
          NFT管理
        </h1>
        <div className="flex justify-center gap-8 text-lg font-bold">
          <p className="text-gray-300">
            全{nfts.length}件
          </p>
          <p className="text-green-400">
            会場参加: {nfts.filter(n => n.isVenueAttendee).length}件
          </p>
          <p className="text-blue-400">
            リモート: {nfts.filter(n => !n.isVenueAttendee).length}件
          </p>
        </div>
      </div>

      {/* フィルター＆検索 */}
      <div className="mb-8 space-y-4">
        {/* 検索バー */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="タイトル、選手名、ユーザーIDで検索..."
              className="w-full pl-12 pr-4 py-3 border-4 border-red-600 bg-gray-800 text-yellow-300 placeholder-gray-500 focus:border-yellow-400 focus:outline-none font-bold text-lg"
            />
          </div>
        </div>

        {/* 会場フィルター */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setFilterVenue(null)}
            className={`px-6 py-2 font-bold border-2 transition ${
              filterVenue === null
                ? 'bg-red-600 text-yellow-300 border-yellow-400'
                : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
            }`}
          >
            全て
          </button>
          <button
            onClick={() => setFilterVenue(true)}
            className={`px-6 py-2 font-bold border-2 transition ${
              filterVenue === true
                ? 'bg-red-600 text-yellow-300 border-yellow-400'
                : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
            }`}
          >
            🏟️ 現地参加のみ
          </button>
          <button
            onClick={() => setFilterVenue(false)}
            className={`px-6 py-2 font-bold border-2 transition ${
              filterVenue === false
                ? 'bg-red-600 text-yellow-300 border-yellow-400'
                : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
            }`}
          >
            オンラインのみ
          </button>
        </div>

        {searchQuery && (
          <p className="text-sm text-gray-400 text-center font-medium">
            {filteredNFTs.length}件のNFTが見つかりました
          </p>
        )}
      </div>

      {/* NFTグリッド */}
      {filteredNFTs.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-black text-yellow-300 mb-4">該当するNFTが見つかりません</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNFTs.map((nft) => (
            <div
              key={nft.id}
              className="bg-gray-800 shadow-2xl border-4 border-red-600 hover:shadow-3xl transition-shadow overflow-hidden"
            >
              {nft.imageUrl && (
                <div className="h-48 overflow-hidden bg-gray-900 border-b-4 border-yellow-400">
                  <img
                    src={nft.imageUrl}
                    alt={nft.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-6">
                <div className="mb-3 flex items-center gap-2 flex-wrap">
                  <span className="inline-block bg-red-700 text-yellow-300 px-3 py-1 font-black text-sm border-2 border-yellow-400">
                    {nft.playerName}
                  </span>
                  {nft.isVenueAttendee && (
                    <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 font-black text-xs border-2 border-orange-600">
                      🏟️ 現地参加
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-black text-yellow-300 mb-3">
                  {nft.title}
                </h3>

                <p className="text-gray-300 mb-4 font-bold line-clamp-2">
                  {nft.message}
                </p>

                <div className="space-y-2 text-sm text-gray-400 font-medium mb-4">
                  <div>👤 {nft.creatorUserId}</div>
                  <div>💰 ¥{nft.paymentAmount.toLocaleString()} ({nft.paymentMethod})</div>
                  <div>📅 {new Date(nft.createdAt).toLocaleDateString('ja-JP')}</div>
                  {nft.venueId && <div>🏟️ 会場ID: {nft.venueId}</div>}
                </div>

                <button
                  onClick={() => deleteNFT(nft.id, nft.title)}
                  className="w-full px-4 py-2 bg-red-600 text-yellow-300 hover:bg-red-700 transition font-bold border-2 border-red-400"
                >
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
