'use client';

import { useState, useEffect } from 'react';
import { NFT } from '@/types/nft';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function NFTGallery() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [filteredNfts, setFilteredNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchUserId, setSearchUserId] = useState<string>('');

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'nfts'));

        const nftList: NFT[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as NFT[];

        // クライアント側で日付順にソート
        nftList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        setNfts(nftList);
        setFilteredNfts(nftList);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNFTs();
  }, []);

  useEffect(() => {
    // ユーザーID検索フィルタ
    if (searchUserId.trim() === '') {
      setFilteredNfts(nfts);
    } else {
      const filtered = nfts.filter((nft) =>
        nft.creatorUserId?.toLowerCase().includes(searchUserId.toLowerCase())
      );
      setFilteredNfts(filtered);
    }
  }, [searchUserId, nfts]);

  if (isLoading) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">⏳</div>
        <p className="text-xl font-black text-red-700">読み込み中...</p>
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🎴</div>
        <h3 className="text-2xl font-black text-red-700 mb-4">まだNFTがありません</h3>
        <p className="text-gray-800 font-bold">
          最初のNFTを発行してみましょう！
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="text-center mb-6 sm:mb-8">
        <div className="text-5xl sm:text-6xl mb-4">🎴</div>
        <h2 className="text-3xl sm:text-4xl font-black text-red-700 mb-3 sm:mb-4 tracking-wider">応援NFT一覧</h2>
        <p className="text-sm sm:text-base text-gray-800 font-bold mb-4 sm:mb-6">
          全{nfts.length}件の応援メッセージNFT
        </p>

        {/* ユーザーID検索 */}
        <div className="max-w-md mx-auto px-2">
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-700 text-lg sm:text-xl">🔍</span>
            <input
              type="text"
              value={searchUserId}
              onChange={(e) => setSearchUserId(e.target.value)}
              placeholder="ユーザーIDで検索..."
              className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 border-2 sm:border-4 border-red-700 focus:border-yellow-400 focus:outline-none font-bold text-sm sm:text-lg text-gray-900"
            />
          </div>
          {searchUserId && (
            <p className="text-xs sm:text-sm text-gray-800 mt-2 font-medium">
              {filteredNfts.length}件のNFTが見つかりました
            </p>
          )}
        </div>
      </div>

      {filteredNfts.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-black text-red-700 mb-4">該当するNFTが見つかりません</h3>
          <p className="text-gray-800 font-bold">
            別のユーザーIDで検索してみてください
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {filteredNfts.map((nft) => (
          <div
            key={nft.id}
            className="bg-white shadow-2xl border-2 sm:border-4 border-red-700 hover:shadow-3xl transition-shadow overflow-hidden"
          >
            {nft.imageUrl && (
              <div className="h-40 sm:h-48 overflow-hidden bg-yellow-50 border-b-2 sm:border-b-4 border-yellow-400">
                <img
                  src={nft.imageUrl}
                  alt={nft.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-4 sm:p-6">
              <div className="mb-3 flex items-center gap-2 flex-wrap">
                <span className="inline-block bg-red-700 text-yellow-300 px-2 sm:px-3 py-1 font-black text-xs sm:text-sm border-2 border-yellow-400">
                  {nft.playerName}
                </span>
                {nft.isVenueAttendee && (
                  <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 sm:px-3 py-1 font-black text-xs border-2 border-orange-600">
                    🏟️ 現地参加
                  </span>
                )}
              </div>

              <h3 className="text-lg sm:text-xl font-black text-red-700 mb-2 sm:mb-3">
                {nft.title}
              </h3>

              <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 font-bold line-clamp-3">
                {nft.message}
              </p>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 text-xs sm:text-sm text-gray-700 font-bold">
                <span>発行日: {nft.createdAt.toLocaleDateString('ja-JP')}</span>
                {nft.creatorUserId && (
                  <span className="truncate">👤 {nft.creatorUserId}</span>
                )}
              </div>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
}
