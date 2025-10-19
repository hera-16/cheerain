'use client';

import { useState, useEffect } from 'react';
import { NFT } from '@/types/nft';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export default function NFTGallery() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const q = query(collection(db, 'nfts'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        const nftList: NFT[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as NFT[];

        setNfts(nftList);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNFTs();
  }, []);

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
      <div className="text-center mb-12">
        <div className="text-6xl mb-4">🎴</div>
        <h2 className="text-4xl font-black text-red-700 mb-4 tracking-wider">応援NFT一覧</h2>
        <p className="text-gray-800 font-bold">
          全{nfts.length}件の応援メッセージNFT
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {nfts.map((nft) => (
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
              <div className="mb-3">
                <span className="inline-block bg-red-700 text-yellow-300 px-3 py-1 font-black text-sm border-2 border-yellow-400">
                  {nft.playerName}
                </span>
              </div>

              <h3 className="text-xl font-black text-red-700 mb-3">
                {nft.title}
              </h3>

              <p className="text-gray-700 mb-4 font-bold line-clamp-3">
                {nft.message}
              </p>

              <div className="text-sm text-gray-600 font-bold">
                発行日: {nft.createdAt.toLocaleDateString('ja-JP')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
