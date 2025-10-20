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
        (nft as any).creatorUserId?.toLowerCase().includes(searchUserId.toLowerCase())
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🎴</div>
        <h2 className="text-4xl font-black text-red-700 mb-4 tracking-wider">応援NFT一覧</h2>
        <p className="text-gray-800 font-bold mb-6">
          全{nfts.length}件の応援メッセージNFT
        </p>

        {/* ユーザーID検索 */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-700 text-xl">🔍</span>
            <input
              type="text"
              value={searchUserId}
              onChange={(e) => setSearchUserId(e.target.value)}
              placeholder="ユーザーIDで検索..."
              className="w-full pl-12 pr-4 py-3 border-4 border-red-700 focus:border-yellow-400 focus:outline-none font-bold text-lg text-gray-900"
            />
          </div>
          {searchUserId && (
            <p className="text-sm text-gray-800 mt-2 font-medium">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNfts.map((nft) => (
          <div
            key={nft.id}
            className="bg-white shadow-2xl border-4 border-red-700 hover:shadow-3xl transition-shadow overflow-hidden"
          >
            {nft.imageUrl && (
              <div className="h-48 overflow-hidden bg-yellow-50 border-b-4 border-yellow-400">
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
                {(nft as any).isVenueAttendee && (
                  <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 font-black text-xs border-2 border-orange-600">
                    🏟️ 現地参加
                  </span>
                )}
              </div>

              <h3 className="text-xl font-black text-red-700 mb-3">
                {nft.title}
              </h3>

              <p className="text-gray-700 mb-4 font-bold line-clamp-3">
                {nft.message}
              </p>

              <div className="flex justify-between items-center text-sm text-gray-700 font-bold">
                <span>発行日: {nft.createdAt.toLocaleDateString('ja-JP')}</span>
                {(nft as any).creatorUserId && (
                  <span>👤 {(nft as any).creatorUserId}</span>
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
