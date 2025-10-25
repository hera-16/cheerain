'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NFTMintForm from '@/components/NFTMintForm';
import NFTGallery from '@/components/NFTGallery';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';

type TabType = 'gallery' | 'mint';

export default function NFTsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('gallery');
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // 未ログインの場合はログインページへリダイレクト
      router.push('/login');
    }
  }, [user, loading, router]);

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

      {/* タブバナー */}
      <div className="bg-white shadow-md border-b-4 border-red-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-8 py-4 font-black tracking-wider transition-all ${
                activeTab === 'gallery'
                  ? 'bg-red-700 text-yellow-300 border-b-4 border-yellow-400'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              🎴 NFT一覧
            </button>
            <button
              onClick={() => setActiveTab('mint')}
              className={`px-8 py-4 font-black tracking-wider transition-all ${
                activeTab === 'mint'
                  ? 'bg-red-700 text-yellow-300 border-b-4 border-yellow-400'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              💬 NFT発行
            </button>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <main className="py-8">
        {activeTab === 'gallery' ? <NFTGallery /> : <NFTMintForm />}
      </main>

      {/* フッター */}
      <footer className="bg-red-700 mt-24 py-8 border-t-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-yellow-300">
          <p className="font-bold">© 2025 CHEERAIN. Built with ❤️ by Team hera-16</p>
        </div>
      </footer>
    </div>
  );
}
