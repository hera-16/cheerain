'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';

interface NFT {
  id: string;
  title: string;
  playerName: string;
  message: string;
  createdAt: any;
  imageUrl?: string;
}

export default function MyPage() {
  const { user, userData, loading, logout } = useAuth();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [profileImage, setProfileImage] = useState<string>('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
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
    if (userData && (userData as any).profileImage) {
      setProfileImage((userData as any).profileImage);
    }
  }, [userData]);

  useEffect(() => {
    // NFTの数に応じて称号を決定
    const nftCount = nfts.length;
    if (nftCount >= 10) setUserTitle(titles[3]);
    else if (nftCount >= 5) setUserTitle(titles[2]);
    else if (nftCount >= 1) setUserTitle(titles[1]);
    else setUserTitle(titles[0]);
  }, [nfts]);

  const fetchUserNFTs = async (userId: string) => {
    try {
      // Firestoreから自分が発行したNFTを取得
      const nftsRef = collection(db, 'nfts');
      const q = query(
        nftsRef,
        where('creatorUid', '==', userId)
      );
      const querySnapshot = await getDocs(q);

      const fetchedNFTs: NFT[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as NFT[];

      // クライアント側で日付順にソート
      fetchedNFTs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      setNfts(fetchedNFTs);
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
      // Base64エンコード
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;

        // Firestoreに保存
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
          profileImage: base64Image
        });

        setProfileImage(base64Image);
        alert('プロフィール写真を更新しました！');
      };
      reader.readAsDataURL(file);
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ユーザー情報セクション */}
        <div className="bg-white shadow-2xl p-6 mb-8 border-4 border-red-700">
          <div className="flex items-center space-x-4">
            <div className="relative w-20 h-20 bg-yellow-100 border-4 border-red-700 flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-80 transition" onClick={() => document.getElementById('profileImageInput')?.click()}>
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl">👤</span>
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
            <div>
              <h2 className="text-2xl font-black text-red-700 tracking-wider">{user?.email}</h2>
              <div className="mt-2 inline-flex items-center px-3 py-1 text-sm font-black bg-yellow-100 text-red-700 border-2 border-yellow-400 tracking-wide">
                🏆 {userTitle}
              </div>
              <p className="text-xs text-gray-700 mt-2 font-medium">📷 画像をクリックして変更</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-yellow-100 p-4 text-center border-4 border-yellow-400">
              <p className="text-sm text-gray-900 font-bold">保有NFT</p>
              <p className="text-3xl font-black text-red-700">{nfts.length}</p>
            </div>
            <div className="bg-yellow-100 p-4 text-center border-4 border-yellow-400">
              <p className="text-sm text-gray-900 font-bold">応援回数</p>
              <p className="text-3xl font-black text-red-700">{nfts.length * 3}</p>
            </div>
            <div className="bg-yellow-100 p-4 text-center border-4 border-yellow-400">
              <p className="text-sm text-gray-900 font-bold">ポイント</p>
              <p className="text-3xl font-black text-red-700">{nfts.length * 100}</p>
            </div>
          </div>
        </div>

        {/* NFTコレクションセクション */}
        <div className="bg-white shadow-2xl p-6 border-4 border-red-700">
          <h3 className="text-xl font-black text-red-700 mb-6 tracking-wider">あなたのNFTコレクション</h3>
          
          {nfts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-900 mb-4 font-bold">まだNFTがありません</p>
              <p className="text-sm text-gray-700 font-bold">選手に応援メッセージを送ってNFTを獲得しましょう!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nfts.map((nft) => (
                <div
                  key={nft.id}
                  className="border-4 border-gray-300 overflow-hidden hover:border-red-700 transition"
                >
                  <div className="bg-gradient-to-br from-red-600 to-red-800 h-48 flex items-center justify-center">
                    {nft.imageUrl ? (
                      <img src={nft.imageUrl} alt={nft.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-6xl">🎴</span>
                    )}
                  </div>
                  <div className="p-4 bg-white">
                    <div className="mb-2 flex items-center gap-2 flex-wrap">
                      <h4 className="font-black text-red-700 tracking-wide">{nft.title}</h4>
                      {(nft as any).isVenueAttendee && (
                        <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 font-black text-xs border-2 border-orange-600">
                          🏟️ 現地
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-900 mb-1 font-bold">選手: {nft.playerName}</p>
                    <p className="text-sm text-gray-800 mb-2 line-clamp-2 font-bold">{nft.message}</p>
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
