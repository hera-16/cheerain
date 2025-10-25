'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount, useReadContract } from 'wagmi';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { getContractConfig } from '@/lib/contract';
import { generateDefaultImageDataURL } from '@/lib/defaultImages';
import WalletConnectButton from '@/components/WalletConnectButton';

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

interface UserData {
  profileImage?: string;
  email?: string;
  role?: string;
}

export default function MyPage() {
  const { user, userData, loading, logout } = useAuth();
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);
  const [nfts, setNfts] = useState<NFTWithId[]>([]);
  const [loadingNFTs, setLoadingNFTs] = useState(false);
  const [profileImage, setProfileImage] = useState<string>('');
  const [monthlyNFTCount, setMonthlyNFTCount] = useState(0);
  const router = useRouter();

  const contractConfig = getContractConfig();

  // ユーザーの称号（NFT数に応じて決定）
  const titles = ['初心者サポーター', 'ブロンズファン', 'シルバーファン', 'ゴールドファン'];
  const [userTitle, setUserTitle] = useState(titles[0]);

  // ユーザーが所有するNFTのトークンIDリストを取得
  const { data: tokenIds } = useReadContract({
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

  useEffect(() => {
    if (!loading && !user) {
      // 未ログインの場合はログインページへリダイレクト
      router.push('/login');
    }
  }, [user, loading, router]);

  // トークンIDからメタデータを取得
  useEffect(() => {
    if (!tokenIds || !address) {
      setNfts([]);
      return;
    }

    const fetchMetadata = async () => {
      setLoadingNFTs(true);
      try {
        const nftPromises = (tokenIds as bigint[]).map(async (tokenId) => {
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
        setLoadingNFTs(false);
      }
    };

    fetchMetadata();
  }, [tokenIds, address]);

  useEffect(() => {
    // userDataからプロフィール画像を読み込む
    const userDataTyped = userData as UserData;
    if (userData && userDataTyped.profileImage) {
      setProfileImage(userDataTyped.profileImage);
    }
  }, [userData]);

  useEffect(() => {
    // NFTの数に応じて称号を決定
    const nftCount = nfts.length;
    if (nftCount >= 10) setUserTitle(titles[3]);
    else if (nftCount >= 5) setUserTitle(titles[2]);
    else if (nftCount >= 1) setUserTitle(titles[1]);
    else setUserTitle(titles[0]);

    // 今月のNFT発行数を計算
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyCount = nfts.filter(nft => {
      const nftDate = new Date(parseInt(nft.metadata.createdAt) * 1000);
      return nftDate >= thisMonthStart;
    }).length;
    setMonthlyNFTCount(monthlyCount);
  }, [nfts, titles]);

  // 画像URLを解決する関数
  const resolveImageUrl = (imageUrl: string): string => {
    if (imageUrl.startsWith('default:')) {
      const imageId = parseInt(imageUrl.replace('default:', ''), 10);
      return generateDefaultImageDataURL(imageId);
    }
    if (imageUrl.startsWith('nft:')) {
      const fileName = imageUrl.replace('nft:', '');
      return `${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/nfts/${fileName}`;
    }
    if (imageUrl.startsWith('nfts/') || imageUrl.startsWith('profiles/') || imageUrl.startsWith('general/')) {
      return `${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/${imageUrl}`;
    }
    return imageUrl;
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-red-50 to-yellow-100">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl font-black text-red-700">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // リダイレクト中
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-red-50 to-yellow-100">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* ユーザー情報セクション */}
        <div className="bg-white shadow-2xl p-4 sm:p-6 mb-6 sm:mb-8 border-2 sm:border-4 border-red-700">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <div
                className="relative w-32 h-32 sm:w-40 sm:h-40 bg-yellow-100 border-4 border-red-700 flex items-center justify-center overflow-hidden flex-shrink-0 rounded-full"
              >
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-6xl">👤</span>
                )}
              </div>
            </div>
            <div className="text-center sm:text-left flex-1 w-full">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-red-700 tracking-wider break-all">{user?.email}</h2>
              <div className="mt-2 inline-flex items-center px-3 py-1 text-xs sm:text-sm font-black bg-yellow-100 text-red-700 border-2 border-yellow-400 tracking-wide">
                🏆 {userTitle}
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-yellow-100 p-3 sm:p-4 text-center border-2 sm:border-4 border-yellow-400">
              <p className="text-xs sm:text-sm text-gray-900 font-bold">保有NFT</p>
              <p className="text-2xl sm:text-3xl font-black text-red-700">{nfts.length}</p>
            </div>
            <div className="bg-green-100 p-3 sm:p-4 text-center border-2 sm:border-4 border-green-400">
              <p className="text-xs sm:text-sm text-gray-900 font-bold">今月のNFT</p>
              <p className="text-2xl sm:text-3xl font-black text-green-700">{monthlyNFTCount}</p>
            </div>
            <div className="bg-yellow-100 p-3 sm:p-4 text-center border-2 sm:border-4 border-yellow-400">
              <p className="text-xs sm:text-sm text-gray-900 font-bold">応援回数</p>
              <p className="text-2xl sm:text-3xl font-black text-red-700">{nfts.length * 3}</p>
            </div>
            <div className="bg-yellow-100 p-3 sm:p-4 text-center border-2 sm:border-4 border-yellow-400">
              <p className="text-xs sm:text-sm text-gray-900 font-bold">ポイント</p>
              <p className="text-2xl sm:text-3xl font-black text-red-700">{nfts.length * 100}</p>
            </div>
          </div>
        </div>

        {/* NFTコレクションセクション */}
        <div className="bg-white shadow-2xl p-4 sm:p-6 border-2 sm:border-4 border-red-700">
          <h3 className="text-lg sm:text-xl font-black text-red-700 mb-4 sm:mb-6 tracking-wider">あなたのNFTコレクション</h3>

          {!mounted ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-900 mb-4 font-bold text-sm sm:text-base">読み込み中...</p>
            </div>
          ) : !isConnected ? (
            <div className="text-center py-8 sm:py-12">
              <div className="text-6xl mb-4">🔗</div>
              <p className="text-gray-900 mb-4 font-bold text-sm sm:text-base">ウォレットを接続してください</p>
              <p className="text-xs sm:text-sm text-gray-700 font-bold mb-6">ブロックチェーン上のNFTを表示するには、ウォレットの接続が必要です</p>
              <WalletConnectButton />
            </div>
          ) : loadingNFTs ? (
            <div className="text-center py-8 sm:py-12">
              <div className="text-6xl mb-4">⏳</div>
              <p className="text-gray-900 mb-4 font-bold text-sm sm:text-base">NFTを読み込み中...</p>
            </div>
          ) : nfts.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-900 mb-4 font-bold text-sm sm:text-base">まだNFTがありません</p>
              <p className="text-xs sm:text-sm text-gray-700 font-bold">選手に応援メッセージを送ってNFTを獲得しましょう!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {nfts.map((nft) => (
                <div
                  key={nft.tokenId.toString()}
                  className="border-2 sm:border-4 border-gray-300 overflow-hidden hover:border-red-700 transition"
                >
                  <div className="bg-gradient-to-br from-red-600 to-red-800 h-40 sm:h-48 flex items-center justify-center relative">
                    <img
                      src={resolveImageUrl(nft.metadata.imageUrl)}
                      alt={nft.metadata.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-black">
                      #{nft.tokenId.toString()}
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 bg-white">
                    <div className="mb-2 flex items-center gap-2 flex-wrap">
                      <h4 className="font-black text-red-700 tracking-wide text-sm sm:text-base">{nft.metadata.title}</h4>
                      {nft.metadata.isVenueAttendee && (
                        <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 font-black text-xs border-2 border-orange-600">
                          🏟️ 現地
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-900 mb-1 font-bold">選手: {nft.metadata.playerName}</p>
                    <p className="text-xs sm:text-sm text-gray-800 mb-2 line-clamp-2 font-bold">{nft.metadata.message}</p>
                    <p className="text-xs text-gray-700 font-bold">
                      {new Date(parseInt(nft.metadata.createdAt) * 1000).toLocaleDateString('ja-JP')}
                    </p>
                    <div className="mt-3 pt-2 border-t">
                      <a
                        href={`https://amoy.polygonscan.com/token/${contractConfig?.address}?a=${nft.tokenId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-xs flex items-center gap-1"
                      >
                        <span>🔍</span>
                        <span>Polygonscanで確認</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
