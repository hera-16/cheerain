'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { getContractConfig } from '@/lib/contract';
import { generateDefaultImageDataURL } from '@/lib/defaultImages';
import WalletConnectButton from './WalletConnectButton';

interface NFTMetadata {
  title: string;
  message: string;
  playerName: string;
  imageUrl: string;
  creator: string;
  paymentAmount: string; // API経由で文字列として受け取る
  createdAt: string; // API経由で文字列として受け取る
  isVenueAttendee: boolean;
}

interface NFTWithId {
  tokenId: bigint;
  metadata: NFTMetadata;
}

export default function BlockchainNFTGallery() {
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [nfts, setNfts] = useState<NFTWithId[]>([]);
  const [loading, setLoading] = useState(false);

  const contractConfig = getContractConfig();

  // ユーザーが所有するNFTのトークンIDリストを取得
  const { data: tokenIds, isError: isTokenIdsError, isLoading: isTokenIdsLoading } = useReadContract({
    ...contractConfig,
    functionName: 'getNFTsByUser',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contractConfig,
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // トークンIDからメタデータを取得
  useEffect(() => {
    if (!tokenIds || !address) {
      setNfts([]);
      return;
    }

    const fetchMetadata = async () => {
      setLoading(true);
      try {
        const nftPromises = (tokenIds as bigint[]).map(async (tokenId) => {
          // 各NFTのメタデータを取得
          const response = await fetch(
            `/api/blockchain/nft-metadata?tokenId=${tokenId.toString()}`
          );

          if (!response.ok) {
            console.error(`Failed to fetch metadata for token ${tokenId}`);
            return null;
          }

          const metadata = await response.json();
          return {
            tokenId,
            metadata: metadata.data as NFTMetadata,
          };
        });

        const results = await Promise.all(nftPromises);
        setNfts(results.filter((nft): nft is NFTWithId => nft !== null));
      } catch (error) {
        console.error('Error fetching NFT metadata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [tokenIds, address]);

  // 画像URLを解決する関数
  const resolveImageUrl = (imageUrl: string): string => {
    // デフォルト画像の場合
    if (imageUrl.startsWith('default:')) {
      const imageId = parseInt(imageUrl.replace('default:', ''), 10);
      return generateDefaultImageDataURL(imageId);
    }
    // カスタムアップロード画像の場合（ファイル名のみ）
    if (imageUrl.startsWith('nft:')) {
      const fileName = imageUrl.replace('nft:', '');
      return `${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/nfts/${fileName}`;
    }
    // バックエンドAPIから取得した画像の場合（相対パス）
    if (imageUrl.startsWith('nfts/') || imageUrl.startsWith('profiles/') || imageUrl.startsWith('general/')) {
      return `${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/${imageUrl}`;
    }
    // それ以外（完全なURL）
    return imageUrl;
  };

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-8 text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-6xl mb-4">🔗</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            ウォレットを接続してください
          </h2>
          <p className="text-gray-600 mb-6">
            ブロックチェーン上のNFTを表示するには、ウォレットの接続が必要です
          </p>
          <WalletConnectButton />
        </div>
      </div>
    );
  }

  if (isTokenIdsLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl font-bold text-gray-700">NFTを読み込み中...</p>
        </div>
      </div>
    );
  }

  if (isTokenIdsError) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-red-800 font-semibold">
            NFTの取得中にエラーが発生しました
          </p>
        </div>
      </div>
    );
  }

  if (!nfts || nfts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            NFTがまだありません
          </h2>
          <p className="text-gray-600 mb-6">
            「NFT発行」タブから最初のNFTを発行してみましょう！
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          あなたのブロックチェーンNFT
        </h2>
        <p className="text-gray-600">
          {nfts.length} 個のNFTを所有しています
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nfts.map((nft) => (
          <div
            key={nft.tokenId.toString()}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
          >
            {/* NFT画像 */}
            <div className="relative h-64 bg-gradient-to-br from-blue-100 to-purple-100">
              <img
                src={resolveImageUrl(nft.metadata.imageUrl)}
                alt={nft.metadata.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                #{nft.tokenId.toString()}
              </div>
            </div>

            {/* NFT情報 */}
            <div className="p-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {nft.metadata.title}
              </h3>

              <div className="mb-3">
                <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                  ⚽ {nft.metadata.playerName}
                </span>
              </div>

              <p className="text-gray-700 mb-4 line-clamp-3">
                {nft.metadata.message}
              </p>

              {/* メタ情報 */}
              <div className="border-t pt-3 space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>💰 支払額:</span>
                  <span className="font-semibold">
                    {(parseInt(nft.metadata.paymentAmount) / 100).toFixed(0)}円
                  </span>
                </div>

                {nft.metadata.isVenueAttendee && (
                  <div className="flex items-center gap-2 text-green-600 font-semibold">
                    <span>🏟️</span>
                    <span>現地参加</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>📅 発行日:</span>
                  <span>
                    {new Date(parseInt(nft.metadata.createdAt) * 1000).toLocaleDateString('ja-JP')}
                  </span>
                </div>
              </div>

              {/* Polygonscanリンク */}
              <div className="mt-4 pt-3 border-t">
                <a
                  href={`https://amoy.polygonscan.com/token/${contractConfig?.address}?a=${nft.tokenId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 text-sm flex items-center justify-center gap-1"
                >
                  <span>🔍</span>
                  <span>Polygonscanで確認</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
