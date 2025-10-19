'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
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
  const { user, loading, logout } = useAuth();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const router = useRouter();

  // ユーザーの称号（NFT数に応じて決定）
  const titles = ['初心者サポーター', 'ブロンズファン', 'シルバーファン', 'ゴールドファン'];
  const [userTitle, setUserTitle] = useState(titles[0]);

  useEffect(() => {
    if (user) {
      fetchUserNFTs(user.uid);
    }
  }, [user]);

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
        where('creatorUid', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);

      const fetchedNFTs: NFT[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as NFT[];

      setNfts(fetchedNFTs);
    } catch (error) {
      console.error('NFT取得エラー:', error);
      setNfts([]);
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">読み込み中...</div>
      </div>
    );
  }

  // 未ログイン時の表示
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-red-50 to-yellow-100">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white shadow-2xl p-12 border-4 border-red-700">
              <div className="text-6xl mb-6">🔒</div>
              <h2 className="text-3xl font-black text-red-700 mb-4 tracking-wider">
                ログインが必要です
              </h2>
              <p className="text-lg text-gray-900 mb-8 font-bold">
                マイページを表示するには、アカウントにログインしてください。<br />
                まだアカウントをお持ちでない方は、無料で作成できます。
              </p>
              
              <div className="flex gap-4 justify-center">
                <Link
                  href="/login"
                  className="px-8 py-3 bg-red-700 text-yellow-300 hover:bg-red-800 transition font-black text-lg shadow-lg border-2 border-yellow-400 tracking-wider"
                >
                  ログイン / 新規登録
                </Link>
                <Link
                  href="/"
                  className="px-8 py-3 bg-gray-200 text-gray-900 hover:bg-gray-300 transition font-black border-2 border-gray-400 tracking-wide"
                >
                  トップページへ
                </Link>
              </div>

              <div className="mt-8 pt-8 border-t-4 border-gray-300">
                <h3 className="text-lg font-black text-red-700 mb-4 tracking-wider">マイページでできること</h3>
                <ul className="text-left space-y-2 text-gray-900">
                  <li className="flex items-start">
                    <span className="text-red-700 mr-2 font-black">✓</span>
                    <span className="font-bold">あなたの称号とステータスの確認</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-700 mr-2 font-black">✓</span>
                    <span className="font-bold">保有しているNFTコレクションの閲覧</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-700 mr-2 font-black">✓</span>
                    <span className="font-bold">応援回数やポイントの確認</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-700 mr-2 font-black">✓</span>
                    <span className="font-bold">限定特典の受け取り</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-red-50 to-yellow-100">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ユーザー情報セクション */}
        <div className="bg-white shadow-2xl p-6 mb-8 border-4 border-red-700">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-yellow-100 border-4 border-red-700 flex items-center justify-center">
              <span className="text-3xl">👤</span>
            </div>
            <div>
              <h2 className="text-2xl font-black text-red-700 tracking-wider">{user?.email}</h2>
              <div className="mt-2 inline-flex items-center px-3 py-1 text-sm font-black bg-yellow-100 text-red-700 border-2 border-yellow-400 tracking-wide">
                🏆 {userTitle}
              </div>
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
                    <h4 className="font-black text-red-700 mb-2 tracking-wide">{nft.title}</h4>
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
