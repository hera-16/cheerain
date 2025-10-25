'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { api } from '@/lib/api';

interface NFT {
  id: string;
  title: string;
  playerName: string;
  message: string;
  createdAt: Date;
  imageUrl?: string;
  isVenueAttendee?: boolean;
}

interface UserData {
  profileImage?: string;
  email?: string;
  role?: string;
}

export default function MyPage() {
  const { user, userData, loading, logout } = useAuth();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [profileImage, setProfileImage] = useState<string>('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [monthlyNFTCount, setMonthlyNFTCount] = useState(0);
  const router = useRouter();

  // ユーザーの称号（NFT数に応じて決定）
  const titles = ['初心者サポーター', 'ブロンズファン', 'シルバーファン', 'ゴールドファン'];
  const [userTitle, setUserTitle] = useState(titles[0]);

  useEffect(() => {
    if (!loading && !user) {
      // 未ログインの場合はログインページへリダイレクト
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchUserNFTs(user.uid);
    }
  }, [user]);

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
      return nft.createdAt >= thisMonthStart;
    }).length;
    setMonthlyNFTCount(monthlyCount);
  }, [nfts, titles]);

  const fetchUserNFTs = async (userId: string) => {
    try {
      // REST APIから自分が発行したNFTを取得
      const response = await api.get<{ content: NFT[] }>('/nfts/my');

      if (response.success && response.data) {
        const fetchedNFTs: NFT[] = response.data.content.map(nft => ({
          ...nft,
          createdAt: new Date(nft.createdAt),
        }));
        setNfts(fetchedNFTs);
      }
    } catch (error) {
      console.error('NFT取得エラー:', error);
      setNfts([]);
    }
  };

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploadingImage(true);

    try {
      // Java APIにアップロード
      const formDataObj = new FormData();
      formDataObj.append('file', file);
      formDataObj.append('type', 'profile');

      const uploadResponse = await api.uploadFile<{ url: string; fileName: string }>('/upload/image', formDataObj);

      if (uploadResponse.success && uploadResponse.data) {
        const imageUrl = uploadResponse.data.url;

        // REST APIでユーザー情報を更新
        await api.patch('/users/me', {
          profileImage: imageUrl
        });

        setProfileImage(imageUrl);
        alert('プロフィール写真を更新しました！');
      } else {
        throw new Error('画像のアップロードに失敗しました');
      }
    } catch (error) {
      console.error('プロフィール写真アップロードエラー:', error);
      alert('プロフィール写真の更新に失敗しました');
    } finally {
      setIsUploadingImage(false);
    }
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
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-yellow-100 border-2 sm:border-4 border-red-700 flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-80 transition flex-shrink-0" onClick={() => document.getElementById('profileImageInput')?.click()}>
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl sm:text-4xl">👤</span>
              )}
              {isUploadingImage && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white text-xs">...</span>
                </div>
              )}
            </div>
            <input
              id="profileImageInput"
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
              className="hidden"
            />
            <div className="text-center sm:text-left flex-1 w-full">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-red-700 tracking-wider break-all">{user?.email}</h2>
              <div className="mt-2 inline-flex items-center px-3 py-1 text-xs sm:text-sm font-black bg-yellow-100 text-red-700 border-2 border-yellow-400 tracking-wide">
                🏆 {userTitle}
              </div>
              <p className="text-xs text-gray-700 mt-2 font-medium">📷 画像をクリックして変更</p>
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

          {nfts.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-900 mb-4 font-bold text-sm sm:text-base">まだNFTがありません</p>
              <p className="text-xs sm:text-sm text-gray-700 font-bold">選手に応援メッセージを送ってNFTを獲得しましょう!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {nfts.map((nft) => (
                <div
                  key={nft.id}
                  className="border-2 sm:border-4 border-gray-300 overflow-hidden hover:border-red-700 transition"
                >
                  <div className="bg-gradient-to-br from-red-600 to-red-800 h-40 sm:h-48 flex items-center justify-center">
                    {nft.imageUrl ? (
                      <img src={nft.imageUrl} alt={nft.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-5xl sm:text-6xl">🎴</span>
                    )}
                  </div>
                  <div className="p-3 sm:p-4 bg-white">
                    <div className="mb-2 flex items-center gap-2 flex-wrap">
                      <h4 className="font-black text-red-700 tracking-wide text-sm sm:text-base">{nft.title}</h4>
                      {nft.isVenueAttendee && (
                        <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 font-black text-xs border-2 border-orange-600">
                          🏟️ 現地
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-900 mb-1 font-bold">選手: {nft.playerName}</p>
                    <p className="text-xs sm:text-sm text-gray-800 mb-2 line-clamp-2 font-bold">{nft.message}</p>
                    <p className="text-xs text-gray-700 font-bold">{nft.createdAt.toLocaleDateString('ja-JP')}</p>
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
